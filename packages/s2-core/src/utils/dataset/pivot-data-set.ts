import { forEach, has, intersection, last, set, find, get } from 'lodash';
import type { CellData } from '../../data-set/cell-data';
import {
<<<<<<< HEAD
  EXTRA_FIELD,
  NODE_ID_SEPARATOR,
  ROOT_NODE_ID,
  TOTAL_VALUE,
  MULTI_VALUE,
} from '../../common/constant';
import type { BaseFields, RawData } from '../../common/interface';
=======
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
import type { PickEssential } from '../../common/interface/utils';
import {
  EMPTY_EXTRA_FIELD_PLACEHOLDER,
  EXTRA_FIELD,
  ID_SEPARATOR,
  MULTI_VALUE,
  QueryDataType,
  ROOT_ID,
  TOTAL_VALUE,
} from '../../common/constant';
import type { Meta } from '../../common/interface/basic';
>>>>>>> origin/master
import type {
  DataPath,
  DataPathParams,
<<<<<<< HEAD
=======
  DataType,
  FlattingIndexesData,
>>>>>>> origin/master
  PivotMeta,
  PivotMetaValue,
  SortedDimensionValues,
  TotalStatus,
} from '../../data-set/interface';
import type { Node } from '../../facet/layout/node';

<<<<<<< HEAD
export function filterExtraDimension(dimensions: string[] = []) {
  return dimensions.filter((d) => d !== EXTRA_FIELD);
}

export function transformDimensionsValues(
  record: RawData,
  dimensions: string[],
  placeholder: string = TOTAL_VALUE,
): string[] {
  return filterExtraDimension(dimensions).map((dimension) =>
    !has(record, dimension) ? placeholder : String(record[dimension]),
  );
}

export function shouldQueryMultiData(pathValue: string | number) {
  return pathValue === MULTI_VALUE;
=======
export function isMultiValue(pathValue: string | number) {
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
  record: DataType = {},
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

export function getExistValues(data: DataType, values: string[]) {
  const result = values.filter((v) => v in data);
  if (isEmpty(result)) {
    result.push(EMPTY_EXTRA_FIELD_PLACEHOLDER);
  }

  return result;
}

export function transformDimensionsValuesWithExtraFields(
  record: DataType = {},
  dimensions: string[] = [],
  values?: string[],
) {
  const result = [];

  function transform(data: DataType, fields: string[], valueField?: string) {
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
>>>>>>> origin/master
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
<<<<<<< HEAD
    const splitArr = item?.split(NODE_ID_SEPARATOR);

    return splitArr?.[splitArr?.length! - 1] || item;
=======
    const splitArr = item?.split(ID_SEPARATOR);
    return splitArr[splitArr?.length - 1] ?? item;
>>>>>>> origin/master
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
    .join(ID_SEPARATOR);
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
    rows,
    columns,
    values,
    rowDimensionValues,
    colDimensionValues,
<<<<<<< HEAD
    shouldCreateOrUpdate,
    onCreate,
=======
    isFirstCreate,
    onFirstCreate,
    rowFields,
    colFields,
>>>>>>> origin/master
    rowPivotMeta,
    colPivotMeta,
    prefix = '',
  } = params;

<<<<<<< HEAD
  // TODO: extract as a layout hook
  const appendValues = () => {
    const map = new Map();

    values?.forEach((v, idx) => {
      map.set(v, {
        level: idx,
        children: new Map(),
      });
    });

    return map;
  };

  /*
   * 根据行、列维度值生成对应的 path路径，始终将总计小计置于第 0 位，明细数据从第 1 位开始，有两个情况：
   * 如果是汇总格子: path = [0,0,0,0] path中会存在 0的值（这里在indexesData里面会映射）
   * 如果是明细格子: path = [1,1,1] 数字均不为0
   */
=======
  // 根据行、列维度值生成对应的 path 路径，始终将总计小计置于第 0 位，明细数据从第 1 位开始，有两个情况：
  // 如果是汇总格子: path = [0, 0, 0, 0] path 中会存在 0 的值
  // 如果是明细格子: path = [1, 1, 1] 数字均不为 0
>>>>>>> origin/master
  const getPath = (
    dimensions: string[],
    dimensionValues: string[],
    pivotMeta: PivotMeta,
<<<<<<< HEAD
  ): DataPath => {
    let currentMeta = pivotMeta;
    const path: DataPath = [];

    for (let i = 0; i < dimensionValues.length; i++) {
      const value = dimensionValues[i];
      const isTotal = value === TOTAL_VALUE;

      if (shouldCreateOrUpdate && !currentMeta.has(value)) {
        currentMeta.set(value, {
          level: isTotal ? 0 : currentMeta.size + 1,
          childField: dimensions?.[i + 1],
          children:
            dimensions?.[i + 1] === EXTRA_FIELD ? appendValues() : new Map(),
        });
        onCreate?.({
          dimension: dimensions?.[i],
          dimensionPath: dimensionValues.slice(0, i + 1),
        });
      }

      const meta = currentMeta.get(value);

      // 只出现在 getCellMultiData 中， 使用特殊的 value 指明当前复合选择
      if (value === MULTI_VALUE) {
        path.push(value);
      } else {
        path.push(meta?.level!);
      }

      if (meta) {
        if (shouldCreateOrUpdate && meta.childField !== dimensions?.[i + 1]) {
          meta.childField = dimensions?.[i + 1];
=======
    careRepeated: boolean,
  ): number[] => {
    let currentMeta = pivotMeta;
    const path = [];
    for (let i = 0; i < dimensionValues.length; i++) {
      const value = dimensionValues[i];

      if (isFirstCreate && currentMeta && !currentMeta?.has(value)) {
        const id = dimensionValues
          .slice(0, i + 1)
          .map((it) => String(it))
          .join(ID_SEPARATOR);

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
>>>>>>> origin/master
        }

        currentMeta = meta?.children;
      }
    }

    return path;
  };

<<<<<<< HEAD
  const rowPath = getPath(rows as string[], rowDimensionValues, rowPivotMeta!);
  const colPath = getPath(
    columns as string[],
    colDimensionValues,
    colPivotMeta!,
  );
  const result = rowPath.concat(...colPath);
=======
  const rowPath = getPath(rowFields, rowDimensionValues, rowPivotMeta, false);
  const colPath = getPath(colFields, colDimensionValues, colPivotMeta, true);
>>>>>>> origin/master

  return [prefix, ...rowPath, ...colPath];
}
interface Param {
  rows: string[];
  columns: string[];
  values: string[];
  valueInCols: boolean;
  data: DataType[];
  indexesData: Record<string, DataType[][] | DataType[]>;
  sortedDimensionValues: SortedDimensionValues;
  rowPivotMeta?: PivotMeta;
  colPivotMeta?: PivotMeta;
  getExistValuesByDataItem?: (data: DataType, values: string[]) => string[];
}

<<<<<<< HEAD
interface Param extends BaseFields {
  originData: RawData[];
  indexesData: RawData[][] | RawData[];
  sortedDimensionValues: SortedDimensionValues;
  rowPivotMeta?: PivotMeta;
  colPivotMeta?: PivotMeta;
}

/**
 * 转换原始数据为多维数组数据
=======
export interface TransformResult {
  paths: (string | number)[];
  indexesData: Record<string, DataType[][] | DataType[]>;
  rowPivotMeta: PivotMeta;
  colPivotMeta: PivotMeta;
  sortedDimensionValues: SortedDimensionValues;
}

/**
 * 转换原始数据为二维数组数据
>>>>>>> origin/master
 */
export function transformIndexesData(params: Param): TransformResult {
  const {
    rows,
    columns,
    values,
<<<<<<< HEAD
    originData = [],
    indexesData = [],
=======
    valueInCols,
    data = [],
    indexesData = {},
>>>>>>> origin/master
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
<<<<<<< HEAD
  const onFirstCreate = ({
    dimension,
    dimensionPath,
  }: {
    // 维度 id，如 city
    dimension: string;
    // 维度数组 ['四川省', '成都市']
    dimensionPath: string[];
  }) => {
    if (repeatedDimensionSet.has(dimension)) {
      /*
       * 当行、列都配置了同一维度字段时，因为 getDataPath 先处理行、再处理列
       * 所有重复字段的维度值无需再加入到 sortedDimensionValues
       */
=======
  const onFirstCreate = ({ dimension, dimensionPath, careRepeated = true }) => {
    if (careRepeated && repeatedDimensionSet.has(dimension)) {
      // 当行、列都配置了同一维度字段时，因为 getDataPath 先处理行、再处理列
      // 所有重复字段的维度值无需再加入到 sortedDimensionValues
>>>>>>> origin/master
      return;
    }

    (
      sortedDimensionValues[dimension] ||
      (sortedDimensionValues[dimension] = [])
<<<<<<< HEAD
    ).push(
      // 拼接维度路径 [1, undefined] => ['1', 'undefined'] => '1[&]undefined
      dimensionPath.map((it) => `${it}`).join(NODE_ID_SEPARATOR),
    );
  };

  originData.forEach((data) => {
    // 空数据没有意义，直接跳过
    if (!data) {
      return;
    }

    const rowDimensionValues = transformDimensionsValues(
      data,
      rows as string[],
    );
    const colDimensionValues = transformDimensionsValues(
      data,
      columns as string[],
    );
    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta,
      colPivotMeta,
      shouldCreateOrUpdate: true,
      onCreate: onFirstCreate,
      rows,
      columns,
      values,
    });

    paths.push(path);
    set(indexesData, path, data);
=======
    ).push(dimensionPath);
  };

  const prefix = getDataPathPrefix(rows, columns as string[]);

  data.forEach((item: DataType) => {
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
          rowPivotMeta,
          colPivotMeta,
          rowFields: rows,
          colFields: columns,
          isFirstCreate: true,
          onFirstCreate,
          prefix,
        });
        paths.push(path);
        set(indexesData, path, item);
      }
    }
>>>>>>> origin/master
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
        .map((v) => v.children.get(dimensionValue))
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

  return metaValues.map((v) => v.id.split(ID_SEPARATOR));
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
    return [data];
  }
  return flatMap(data, (dimensionData) => {
    if (!isArray(dimensionData)) {
      return [dimensionData];
    }
    // 数组的第 0 项是总计/小计专位，从第 1 项开始是明细数据
    const startIdx = queryType === QueryDataType.DetailOnly ? 1 : 0;
    return dimensionData.slice(startIdx).filter(Boolean);
  });
}
