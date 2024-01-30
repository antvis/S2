import {
  compact,
  find,
  flatMap,
  forEach,
  get,
  indexOf,
  intersection,
  isArray,
  isEmpty,
  isNull,
  last,
  set,
  sortBy,
} from 'lodash';
import {
  EMPTY_EXTRA_FIELD_PLACEHOLDER,
  EXTRA_FIELD,
  MULTI_VALUE,
  NODE_ID_SEPARATOR,
  QueryDataType,
  ROOT_NODE_ID,
  TOTAL_VALUE,
} from '../../common/constant';
import type { Meta } from '../../common/interface/basic';
import type { PickEssential } from '../../common/interface/type-utils';
import type { CellData } from '../../data-set/cell-data';
import type {
  DataPath,
  DataPathParams,
  FlattingIndexesData,
  OnFirstCreateParams,
  PivotMeta,
  PivotMetaValue,
  SortedDimensionValues,
  TotalStatus,
} from '../../data-set/interface';
import type { Node } from '../../facet/layout/node';
import type { RawData } from '../../common';

export function filterExtraDimension(dimensions: string[] = []) {
  return dimensions.filter((d) => d !== EXTRA_FIELD);
}

export function isMultiValue(pathValue: string | number | undefined) {
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
  record: RawData = {},
  dimensions: string[] = [],
  placeholder = TOTAL_VALUE,
): string[] {
  return dimensions.reduce((res: string[], dimension: string) => {
    const value = record[dimension];

    if (!(dimension in record)) {
      res.push(placeholder);
    } else {
      res.push(String(value));
    }

    return res;
  }, []);
}

export function getExistValues(data: RawData, values: string[]) {
  const result = values.filter((v) => v in data);

  if (isEmpty(result)) {
    result.push(EMPTY_EXTRA_FIELD_PLACEHOLDER);
  }

  return result;
}

export function transformDimensionsValuesWithExtraFields(
  record: RawData = {},
  dimensions: string[] = [],
  values: string[] | null,
) {
  const result = [];

  function transform(data: RawData, fields: string[], valueField?: string) {
    return fields.reduce((res: string[], dimension: string) => {
      const value = data[dimension];

      if (!(dimension in data)) {
        if (dimension === EXTRA_FIELD && valueField) {
          res.push(valueField);
        } else {
          res.push(TOTAL_VALUE);
        }
      } else {
        res.push(String(value));
      }

      return res;
    }, []);
  }

  if (values) {
    values.forEach((value) => {
      result.push(transform(record, dimensions, value));
    });
  } else {
    result.push(transform(record, dimensions));
  }

  return result;
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
  defaultDimensions: string[] = [],
  dimensions: CellData[],
) {
  const measure = defaultDimensions.slice(
    0,
    defaultDimensions.indexOf(field) + 1,
  );

  return dimensions
    .map((item) =>
      measure.map((i) => item.getValueByField(i)).join(`${NODE_ID_SEPARATOR}`),
    )
    ?.filter(Boolean);
}

export function getDataPathPrefix(rowFields: string[], colFields: string[]) {
  return rowFields
    .concat(colFields)
    .filter((i) => i !== EXTRA_FIELD)
    .join(NODE_ID_SEPARATOR);
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
export function getDataPath(params: DataPathParams): DataPath {
  const {
    rowDimensionValues,
    colDimensionValues,
    isFirstCreate,
    onFirstCreate,
    rowFields,
    colFields,
    rowPivotMeta,
    colPivotMeta,
    prefix = '',
  } = params;

  // 根据行、列维度值生成对应的 path 路径，始终将总计小计置于第 0 位，明细数据从第 1 位开始，有两个情况：
  // 如果是汇总格子: path = [0, 0, 0, 0] path 中会存在 0 的值
  // 如果是明细格子: path = [1, 1, 1] 数字均不为 0
  const getPath = (
    dimensions: string[],
    dimensionValues: string[],
    pivotMeta: PivotMeta,
    careRepeated: boolean,
  ) => {
    let currentMeta = pivotMeta;
    const path: DataPath = [];

    for (let i = 0; i < dimensionValues.length; i++) {
      const value = dimensionValues[i];

      if (isFirstCreate && currentMeta && !currentMeta?.has(value)) {
        const currentDimensions = dimensionValues
          .slice(0, i + 1)
          .map((it) => String(it));
        const id = currentDimensions.join(NODE_ID_SEPARATOR);

        const isTotal = value === TOTAL_VALUE;

        let level;

        if (isTotal) {
          level = 0;
        } else if (currentMeta.has(TOTAL_VALUE)) {
          level = currentMeta.size;
        } else {
          level = currentMeta.size + 1;
        }

        currentMeta.set(value, {
          id,
          dimensions: currentDimensions,
          value,
          level,
          children: new Map(),
        });
        onFirstCreate?.({
          dimension: dimensions?.[i],
          dimensionPath: id,
          careRepeated,
        });
      }

      const meta = currentMeta?.get(value);

      path.push(isMultiValue(value) ? value : meta?.level);

      if (meta) {
        const childDimension = dimensions?.[i + 1];

        if (isFirstCreate && meta.childField !== childDimension) {
          // mark the child field
          // NOTE: should take more care when reset meta.childField to undefined, the meta info is shared with brother nodes.
          meta.childField = childDimension;
        }

        currentMeta = meta?.children;
      }
    }

    return path;
  };

  const rowPath = getPath(rowFields, rowDimensionValues, rowPivotMeta, false);
  const colPath = getPath(colFields, colDimensionValues, colPivotMeta, true);

  return [prefix, ...rowPath, ...colPath];
}
interface Param {
  rows: string[];
  columns: string[];
  values: string[];
  valueInCols: boolean;
  data: RawData[];
  indexesData: Record<string, RawData[][] | RawData[]>;
  sortedDimensionValues: SortedDimensionValues;
  rowPivotMeta?: PivotMeta;
  colPivotMeta?: PivotMeta;
  getExistValuesByDataItem?: (data: RawData, values: string[]) => string[];
}

export interface TransformResult {
  paths: DataPath[];
  indexesData: Record<string, RawData[][] | RawData[]>;
  rowPivotMeta: PivotMeta;
  colPivotMeta: PivotMeta;
  sortedDimensionValues: SortedDimensionValues;
}

/**
 * 转换原始数据为二维数组数据
 */
export function transformIndexesData(params: Param): TransformResult {
  const {
    rows,
    columns,
    values,
    valueInCols,
    data = [],
    indexesData = {},
    sortedDimensionValues,
    rowPivotMeta,
    colPivotMeta,
    getExistValuesByDataItem,
  } = params;

  const paths: DataPath[] = [];

  /**
   * 记录行头、列头重复的字段
   */
  const repeatedDimensionSet = new Set(intersection(rows, columns));

  /**
   * 在 PivotMap 创建新节点时，填充 sortedDimensionValues 维度数据
   */
  const onFirstCreate = ({
    dimension,
    dimensionPath,
    careRepeated = true,
  }: OnFirstCreateParams) => {
    if (careRepeated && repeatedDimensionSet.has(dimension)) {
      // 当行、列都配置了同一维度字段时，因为 getDataPath 先处理行、再处理列
      // 所有重复字段的维度值无需再加入到 sortedDimensionValues
      return;
    }

    (
      sortedDimensionValues[dimension] ||
      (sortedDimensionValues[dimension] = [])
    ).push(dimensionPath);
  };

  const prefix = getDataPathPrefix(rows, columns as string[]);

  data.forEach((item: RawData) => {
    // 空数据没有意义，直接跳过
    if (!item || isEmpty(item)) {
      return;
    }

    const existValues = getExistValuesByDataItem
      ? getExistValuesByDataItem(item, values)
      : getExistValues(item, values);

    const multiRowDimensionValues = transformDimensionsValuesWithExtraFields(
      item,
      rows,
      valueInCols ? null : existValues,
    );
    const multiColDimensionValues = transformDimensionsValuesWithExtraFields(
      item,
      columns,
      valueInCols ? existValues : null,
    );

    for (const rowDimensionValues of multiRowDimensionValues) {
      for (const colDimensionValues of multiColDimensionValues) {
        const path = getDataPath({
          rowDimensionValues,
          colDimensionValues,
          rowPivotMeta: rowPivotMeta!,
          colPivotMeta: colPivotMeta!,
          rowFields: rows,
          colFields: columns,
          isFirstCreate: true,
          onFirstCreate,
          prefix,
        });

        paths.push(path);
        set(indexesData, path as (string | number)[], item);
      }
    }
  });

  return {
    paths,
    indexesData,
    rowPivotMeta: rowPivotMeta!,
    colPivotMeta: colPivotMeta!,
    sortedDimensionValues,
  };
}

export function deleteMetaById(meta: PivotMeta, nodeId: string) {
  if (!meta || !nodeId) {
    return;
  }

  const paths = nodeId.split(NODE_ID_SEPARATOR);
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
    return idx === 0 && path === ROOT_NODE_ID;
  });
}

export function generateExtraFieldMeta(
  meta: Meta[],
  cornerExtraFieldText: string | undefined,
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
    formatter: (value: unknown) => valueFormatter(value as string),
  };

  return extraFieldMeta;
}

export function getHeaderTotalStatus(row: Node, col: Node): TotalStatus {
  return {
    isRowTotal: row.isGrandTotals!,
    isRowSubTotal: row.isSubTotals!,
    isColTotal: col.isGrandTotals!,
    isColSubTotal: col.isSubTotals!,
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

    if (isMultiValue(element)) {
      multiIdx = i;
    } else if (!isNull(multiIdx) && multiIdx < i) {
      return true;
    }
  }

  return false;
}

export function getSatisfiedPivotMetaValues(params: {
  pivotMeta: PivotMeta;
  dimensionValues: string[];
  fieldIdx: number;
  queryType: QueryDataType;
  fields: string[];
  sortedDimensionValues: SortedDimensionValues;
}) {
  const {
    pivotMeta,
    dimensionValues,
    fieldIdx,
    queryType,
    fields,
    sortedDimensionValues,
  } = params;
  const rootContainer = {
    children: pivotMeta,
  } as PivotMetaValue;

  let metaValueList = [rootContainer];

  function flattenMetaValue(list: PivotMetaValue[], field: string) {
    const allValues = flatMap(list, (metaValue) => {
      const values = [...metaValue.children.values()];

      return values.filter(
        (v) =>
          v.value !== EMPTY_EXTRA_FIELD_PLACEHOLDER &&
          (queryType === QueryDataType.All ? true : v.value !== TOTAL_VALUE),
      );
    });

    if (list.length > 1) {
      // 从不同父维度中获取的子维度需要再排一次，比如province => city 按照字母倒序，那么在获取了所有 province 的 city 后需要再排一次
      const sortedDimensionValue = sortedDimensionValues[field] ?? [];

      return sortBy(allValues, (item) =>
        indexOf(sortedDimensionValue, item.id),
      );
    }

    return allValues;
  }

  for (let i = 0; i <= fieldIdx; i++) {
    const dimensionValue = dimensionValues[i];
    const field = fields[i];

    if (isMultiValue(dimensionValue)) {
      metaValueList = flattenMetaValue(metaValueList, field);
    } else {
      metaValueList = metaValueList
        .map((v) => v.children.get(dimensionValue)!)
        .filter(Boolean);
    }
  }

  return metaValueList;
}

export function flattenDimensionValues(params: {
  dimensionValues: string[];
  pivotMeta: PivotMeta;
  fields: string[];
  sortedDimensionValues: SortedDimensionValues;
  queryType?: QueryDataType;
}) {
  const {
    dimensionValues,
    pivotMeta,
    fields,
    sortedDimensionValues,
    queryType = QueryDataType.All,
  } = params;

  if (!existDimensionTotalGroup(dimensionValues)) {
    return [dimensionValues];
  }

  const metaValues = getSatisfiedPivotMetaValues({
    pivotMeta,
    dimensionValues,
    fieldIdx: dimensionValues.length - 1,
    queryType,
    fields,
    sortedDimensionValues,
  });

  return metaValues.map((v) => v.dimensions);
}

export function getFlattenDimensionValues(
  params: PickEssential<DataPathParams> & {
    sortedDimensionValues: SortedDimensionValues;
    queryType: QueryDataType;
  },
) {
  const {
    rowFields,
    rowDimensionValues,
    rowPivotMeta,
    colFields,
    colDimensionValues,
    colPivotMeta,
    queryType,
    sortedDimensionValues,
  } = params;
  const rowQueries = flattenDimensionValues({
    dimensionValues: rowDimensionValues,
    pivotMeta: rowPivotMeta,
    fields: rowFields,
    sortedDimensionValues,
    queryType,
  });
  const colQueries = flattenDimensionValues({
    dimensionValues: colDimensionValues,
    pivotMeta: colPivotMeta,
    fields: colFields,
    sortedDimensionValues,
    queryType,
  });

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
    return compact([data]);
  }

  return flatMap(data, (dimensionData: RawData[]) => {
    if (!isArray(dimensionData)) {
      return compact([dimensionData]) as RawData[];
    }

    // 数组的第 0 项是总计/小计专位，从第 1 项开始是明细数据
    const startIdx = queryType === QueryDataType.DetailOnly ? 1 : 0;

    return compact(dimensionData.slice(startIdx));
  }) as unknown as FlattingIndexesData;
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
    const splitArr = item?.split(NODE_ID_SEPARATOR);

    return splitArr[splitArr?.length - 1] ?? item;
  });
}
