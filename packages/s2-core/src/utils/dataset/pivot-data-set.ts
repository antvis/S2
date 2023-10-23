import {
  find,
  forEach,
  get,
  intersection,
  isEmpty,
  last,
  reduce,
  set,
} from 'lodash';
import {
  EXTRA_FIELD,
  ID_SEPARATOR,
  MULTI_VALUE,
  ROOT_ID,
  TOTAL_VALUE,
} from '../../common/constant';
import type { Meta } from '../../common/interface/basic';
import type {
  DataPathParams,
  DataType,
  PivotMeta,
  SortedDimensionValues,
  TotalStatus,
} from '../../data-set/interface';
import type { Node } from '../../facet/layout/node';

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
  dimensions: string[],
  placeholder: string = TOTAL_VALUE,
): string[] {
  return reduce(
    dimensions,
    (res: string[], dimension: string) => {
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
    },
    [],
  );
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
      if (isFirstCreate && !currentMeta.has(value)) {
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
      const meta = currentMeta.get(value);

      path.push(value === MULTI_VALUE ? value : meta?.level);

      if (meta) {
        if (isFirstCreate && meta.childField !== dimensions?.[i + i]) {
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
  return rowPath.concat(...colPath);
}
interface Param {
  rows: string[];
  columns: string[];
  values: string[];
  originData: DataType[];
  indexesData: DataType[][] | DataType[];
  totalData?: DataType[];
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
    originData = [],
    indexesData = [],
    totalData = [],
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

  const allData = originData.concat(totalData);
  allData.forEach((data) => {
    // 空数据没有意义，直接跳过
    if (!data || isEmpty(data)) {
      return;
    }

    const rowDimensionValues = transformDimensionsValues(data, rows);
    const colDimensionValues = transformDimensionsValues(data, columns);
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
    set(indexesData, path, data);
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
