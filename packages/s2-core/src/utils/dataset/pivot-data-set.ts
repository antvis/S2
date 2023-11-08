import {
  find,
  flatMap,
  forEach,
  get,
  intersection,
  isArray,
  isEmpty,
  isNull,
  last,
  set,
} from 'lodash';
import {
  EXTRA_FIELD,
  ID_SEPARATOR,
  MULTI_VALUE,
  QueryDataType,
  ROOT_ID,
  TOTAL_VALUE,
} from '../../common/constant';
import type { Meta } from '../../common/interface/basic';
import type {
  DataPathParams,
  DataType,
  FlattingIndexesData,
  PivotMeta,
  SortedDimensionValues,
  TotalStatus,
} from '../../data-set/interface';
import type { Node } from '../../facet/layout/node';

export function shouldQueryMultiData(pathValue: string | number) {
  return pathValue === MULTI_VALUE;
}

/**
 * Transform from origin single data to correct dimension values
 * data: {
 *  price: 16,
 *  province: '辽宁省',
 *  city: '芜湖市',
 *  category: '家具',
 *  subCategory: '椅子',
 * }
 * dimensions: [province, city]
 * return [辽宁省, 芜湖市]
 *
 * @param record
 * @param dimensions
 */

export function transformDimensionsValues(
  record: DataType,
  dimensions: string[] = [],
  placeholder: string = TOTAL_VALUE,
): string[] {
  return dimensions.reduce((res: string[], dimension: string) => {
    if (dimension === EXTRA_FIELD) {
      return res;
    }
    // push undefined when not exist
    const value = record[dimension];
    if (!(dimension in record)) {
      res.push(placeholder);
    } else {
      res.push(String(value));
    }
    return res;
  }, []);
}

/**
 * Get dimensions without path pre
 * dimensions: ['辽宁省[&]芜湖市[&]家具[&]椅子']
 * return ['椅子']
 *
 * @param dimensions
 */
export function getDimensionsWithoutPathPre(dimensions: string[]) {
  return dimensions.map((item) => {
    const splitArr = item?.split(ID_SEPARATOR);
    return splitArr[splitArr?.length - 1] || item;
  });
}

/**
 * Get dimensions with parent path
 * field: 'category'
 * defaultDimensions: ['province', 'city', 'category', 'subCategory']
 * dimensions: [
 *  {
 *   province: '辽宁省',
 *   city: '芜湖市',
 *   category: '家具',
 *   subCategory: '椅子',
 *   price: ''
 *  },
 * ]
 * return ['辽宁省[&]芜湖市[&]家具']
 *
 * @param field
 * @param defaultDimensions
 * @param dimensions
 */
export function getDimensionsWithParentPath(
  field: string,
  defaultDimensions: string[],
  dimensions: DataType[],
) {
  const measure = defaultDimensions.slice(
    0,
    defaultDimensions.indexOf(field) + 1,
  );
  return dimensions
    .map((item) => measure.map((i) => item[i]).join(`${ID_SEPARATOR}`))
    ?.filter((item) => item);
}

/**
 * Transform a single data to path
 * {
 * $$VALUE$$: 15
 * $$EXTRA$$: 'price'
 * "price": 15,
 * "province": "辽宁省",
 * "city": "达州市",
 * "category": "家具",
 * "subCategory": "椅子"
 * }
 * rows: [province, city]
 * columns: [category, subCategory, $$EXTRA$$]
 *
 * rowDimensionValues = [辽宁省, 达州市]
 * colDimensionValues = [家具, 椅子, price]
 *
 * @param params
 */
export function getDataPath(params: DataPathParams) {
  const {
    rowDimensionValues,
    colDimensionValues,
    isFirstCreate,
    onFirstCreate,
    rowFields,
    colFields,
    valueFields,
    rowPivotMeta,
    colPivotMeta,
  } = params;

  const getDimensionPrefix = () => {
    return rowFields
      .concat(colFields)
      .filter((i) => i !== EXTRA_FIELD)
      .join(ID_SEPARATOR);
  };

  const appendValues = () => {
    const map = new Map();
    valueFields?.forEach((v, idx) => {
      map.set(v, {
        level: idx,
        children: new Map(),
      });
    });
    return map;
  };

  // 根据行、列维度值生成对应的 path 路径，始终将总计小计置于第 0 位，明细数据从第 1 位开始，有两个情况：
  // 如果是汇总格子: path = [0, 0, 0, 0] path 中会存在 0 的值
  // 如果是明细格子: path = [1, 1, 1] 数字均不为 0
  const getPath = (
    dimensions: string[],
    dimensionValues: string[],
    pivotMeta: PivotMeta,
  ): number[] => {
    let currentMeta = pivotMeta;
    const path = [];
    for (let i = 0; i < dimensionValues.length; i++) {
      const value = dimensionValues[i];
      if (isFirstCreate && currentMeta && !currentMeta?.has(value)) {
        const isTotal = value === TOTAL_VALUE;

        currentMeta.set(value, {
          level: isTotal ? 0 : currentMeta.size + 1,
          children:
            dimensionValues[i + 1] === EXTRA_FIELD ? appendValues() : new Map(),
        });

        onFirstCreate?.({
          dimension: dimensions?.[i],
          dimensionPath: dimensionValues.slice(0, i + 1),
        });
      }
      const meta = currentMeta?.get(value);

      path.push(value === MULTI_VALUE ? value : meta?.level);

      if (meta) {
        if (isFirstCreate && meta.childField !== dimensions?.[i + 1]) {
          // mark the child field
          // NOTE: should take more care when reset meta.childField to undefined, the meta info is shared with brother nodes.
          meta.childField = dimensions?.[i + 1];
        }
        currentMeta = meta?.children;
      }
    }
    return path;
  };

  const rowPath = getPath(rowFields, rowDimensionValues, rowPivotMeta);
  const colPath = getPath(colFields, colDimensionValues, colPivotMeta);

  return [getDimensionPrefix(), ...rowPath, ...colPath];
}
interface Param {
  rows: string[];
  columns: string[];
  values: string[];
  data: DataType[];
  indexesData: Record<string, DataType[][] | DataType[]>;
  sortedDimensionValues: SortedDimensionValues;
  rowPivotMeta?: PivotMeta;
  colPivotMeta?: PivotMeta;
}

/**
 * 转换原始数据为二维数组数据
 */
export function transformIndexesData(params: Param) {
  const {
    rows,
    columns,
    values,
    data = [],
    indexesData = {},
    sortedDimensionValues,
    rowPivotMeta,
    colPivotMeta,
  } = params;
  const paths = [];

  /**
   * 记录行头、列头重复的字段
   */
  const repeatedDimensionSet = new Set(intersection(rows, columns));

  /**
   * 在 PivotMap 创建新节点时，填充 sortedDimensionValues 维度数据
   */
  const onFirstCreate = ({ dimension, dimensionPath }) => {
    if (repeatedDimensionSet.has(dimension)) {
      // 当行、列都配置了同一维度字段时，因为 getDataPath 先处理行、再处理列
      // 所有重复字段的维度值无需再加入到 sortedDimensionValues
      return;
    }

    (
      sortedDimensionValues[dimension] ||
      (sortedDimensionValues[dimension] = [])
    ).push(
      // 拼接维度路径
      // [1, undefined] => ['1', 'undefined'] => '1[&]undefined
      dimensionPath.map((it) => `${it}`).join(ID_SEPARATOR),
    );
  };

  data.forEach((item) => {
    // 空数据没有意义，直接跳过
    if (!item || isEmpty(item)) {
      return;
    }

    const rowDimensionValues = transformDimensionsValues(item, rows);
    const colDimensionValues = transformDimensionsValues(item, columns);
    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta,
      colPivotMeta,
      rowFields: rows,
      colFields: columns,
      valueFields: values,
      isFirstCreate: true,
      onFirstCreate,
    });
    paths.push(path);
    set(indexesData, path, item);
  });

  return {
    paths,
    indexesData,
    rowPivotMeta,
    colPivotMeta,
    sortedDimensionValues,
  };
}

export function deleteMetaById(meta: PivotMeta, nodeId: string) {
  if (!meta || !nodeId) {
    return;
  }
  const paths = nodeId.split(ID_SEPARATOR);
  const deletePath = last(paths);
  let currentMeta = meta;
  forEach(paths, (path, idx) => {
    const pathMeta = currentMeta.get(path);
    if (pathMeta) {
      if (path === deletePath) {
        pathMeta.children = new Map();
        pathMeta.childField = undefined;
      } else {
        currentMeta = pathMeta.children;
      }
      return true;
    }

    // exit iteration early when pathMeta not exists
    return idx === 0 && path === ROOT_ID;
  });
}

export function generateExtraFieldMeta(
  meta: Meta[],
  cornerExtraFieldText: string,
  defaultText: string,
) {
  const valueFormatter = (value: string) => {
    const currentMeta = find(meta, ({ field }: Meta) => field === value);
    return get(currentMeta, 'name', value);
  };
  // 虚拟列字段，为文本分类字段
  const extraFieldName = cornerExtraFieldText || defaultText;

  const extraFieldMeta: Meta = {
    field: EXTRA_FIELD,
    name: extraFieldName,
    formatter: (value: string) => valueFormatter(value),
  };

  return extraFieldMeta;
}

export function getHeaderTotalStatus(row: Node, col: Node): TotalStatus {
  return {
    isRowTotal: row.isGrandTotals,
    isRowSubTotal: row.isSubTotals,
    isColTotal: col.isGrandTotals,
    isColSubTotal: col.isSubTotals,
  };
}

/**
 * 检查 getMultiData 时，传入的 query 是否是包含总计、小计分组的场景
 * MULTI_VALUE 后面再出现具体的名字，就表明是分组场景
 * 以 rows: [province, city] 为例
 * 如果是: [四川, MULTI_VALUE] => 代表获取四川下面的所有 city
 * 如果是: [MULTI_VALUE, 成都] => 这种结果就是所有成都的小计分组
 *    每个 province 下面的 city 都不一样的
 *    就算换成 [province, sex] => [MULTI_VALUE, 女] 这样的形式，去获取所有 province 下的女性，但是每个 province 下的女性的 index 也可能不同
 *    需要将其拓展成多个结构 =>  [MULTI_VALUE, 女] => [[四川，女], [北京，女], ....] => [[1,1],[2,1],[3,2]....]
 */
export function existDimensionTotalGroup(path: string[]) {
  let multiIdx = null;
  for (let i = 0; i < path.length; i++) {
    const element = path[i];
    if (element === MULTI_VALUE) {
      multiIdx = i;
    } else if (!isNull(multiIdx) && multiIdx < i) {
      return true;
    }
  }
  return false;
}

export function satisfyDimensionValues(
  dimensionValues: string[],
  sortedDimensionValue: string,
  fieldIdx: number,
) {
  return sortedDimensionValue.split(ID_SEPARATOR).every((value, idx) => {
    // 只检查截止到目标 field 为止的内容
    if (idx > fieldIdx) {
      return true;
    }
    // 不包含总计、小计维度，只获取具体的维度
    if (value === TOTAL_VALUE) {
      return false;
    }

    const dimension = dimensionValues[idx];
    // 如果是 MULTI_VALUE， 则说明是获取全部维度
    if (dimension === MULTI_VALUE) {
      return true;
    }

    return value === dimension;
  });
}

export function flattenDimensionValues(
  fields: string[],
  dimensionValues: string[],
  sortedDimensionValues: SortedDimensionValues,
) {
  fields = fields.filter((i) => i !== EXTRA_FIELD);

  if (!existDimensionTotalGroup(dimensionValues)) {
    return [dimensionValues];
  }

  let queries = [dimensionValues];
  let hadMultiBefore = false;
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const value = dimensionValues[i];
    if (value === MULTI_VALUE) {
      hadMultiBefore = true;
    } else if (hadMultiBefore) {
      const temp = [];
      const allSortedDimensionValues = sortedDimensionValues[field];
      for (const sortedValues of allSortedDimensionValues) {
        for (const query of queries) {
          if (satisfyDimensionValues(query, sortedValues, i)) {
            const newQuery = sortedValues
              .split(ID_SEPARATOR)
              .slice(0, i)
              .concat(query.slice(i));
            temp.push(newQuery);
          }
        }
      }
      queries = temp;
    }
  }
  return queries;
}

export function getFlattenDimensionValues(params: {
  rowDimensionValues: string[];
  colDimensionValues: string[];
  rowFields: string[];
  colFields: string[];
  sortedDimensionValue: SortedDimensionValues;
}) {
  const {
    rowFields,
    rowDimensionValues,
    colFields,
    colDimensionValues,
    sortedDimensionValue,
  } = params;
  const rowQueries = flattenDimensionValues(
    rowFields,
    rowDimensionValues,
    sortedDimensionValue,
  );
  const colQueries = flattenDimensionValues(
    colFields,
    colDimensionValues,
    sortedDimensionValue,
  );
  return {
    rowQueries,
    colQueries,
  };
}

export function flattenIndexesData(
  data: FlattingIndexesData,
  queryType: QueryDataType,
): FlattingIndexesData {
  if (!data) {
    return [];
  }
  if (!isArray(data)) {
    return [data];
  }
  return flatMap(data, (dimensionData) => {
    if (!isArray(dimensionData)) {
      return [dimensionData];
    }
    // 数组的第 0 项是总计/小计专位，从第 1 项开始是明细数据
    const startIdx = queryType === QueryDataType.DetailOnly ? 1 : 0;
    const length = queryType === QueryDataType.TotalOnly ? 1 : undefined;
    return dimensionData.slice(startIdx, length).filter(Boolean);
  });
}
