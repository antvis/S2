import { set, map, reduce, isUndefined, forEach, last } from 'lodash';
import { DataType } from '@/data-set/interface';
import {
  DataPathParams,
  PivotMeta,
  SortedDimensionValues,
} from '@/data-set/interface';
import { ROOT_ID, ID_SEPARATOR } from '@/common/constant';

interface Param {
  rows: string[];
  columns: string[];
  originData: DataType[];
  indexesData: DataType[][] | DataType[];
  totalData?: DataType[];
  sortedDimensionValues: SortedDimensionValues;
  rowPivotMeta?: PivotMeta;
  colPivotMeta?: PivotMeta;
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
  dimensions: string[],
  sortedDimensionValues: SortedDimensionValues,
): string[] {
  const dimensionValuePath: string[] = [];
  return map(dimensions, (dimension) => {
    const dimensionValue = record[dimension];
    dimensionValuePath.push(`${dimensionValue}`);
    const cacheKey = dimensionValuePath.join(`${ID_SEPARATOR}`);

    if (!sortedDimensionValues[dimension]) {
      sortedDimensionValues[dimension] = [cacheKey];
    } else if (!sortedDimensionValues[dimension]?.includes(cacheKey)) {
      sortedDimensionValues[dimension].push(cacheKey);
    }

    // 保证 undefined 之外的数据都为 string 类型
    if (dimensionValue === undefined) {
      return dimensionValue;
    }
    return `${dimensionValue}`;
  });
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
    careUndefined,
    isFirstCreate,
    rowFields,
    colFields,
    rowPivotMeta,
    colPivotMeta,
  } = params;

  // 根据行、列维度值生成对应的 path路径，有两个情况
  // 如果是汇总格子：path = [0,undefined, 0] path中会存在undefined的值（这里在indexesData里面会映射）
  // 如果是明细格子: path = [0,0,0] 全数字，无undefined存在
  const getPath = (
    dimensionValues: string[],
    isRow = true,
    rowMeta: PivotMeta,
    colMeta: PivotMeta,
  ): number[] => {
    let currentMeta = isRow ? rowMeta : colMeta;
    const fields = isRow ? rowFields : colFields;
    const path = [];
    for (let i = 0; i < dimensionValues.length; i++) {
      const value = dimensionValues[i];
      if (!currentMeta.has(value)) {
        if (isFirstCreate) {
          currentMeta.set(value, {
            level: currentMeta.size,
            children: new Map(),
          });
        } else {
          const meta = currentMeta.get(value);
          if (meta) {
            path.push(meta.level);
          }
          if (!careUndefined) {
            break;
          }
        }
      }
      const meta = currentMeta.get(value);
      if (isUndefined(value) && careUndefined) {
        path.push(value);
      } else {
        path.push(meta?.level);
      }
      if (meta) {
        if (isFirstCreate) {
          // mark the child field
          meta.childField = fields?.[i + 1];
        }
        currentMeta = meta?.children;
      }
    }
    return path;
  };

  const rowPath = getPath(rowDimensionValues, true, rowPivotMeta, colPivotMeta);
  const colPath = getPath(
    colDimensionValues,
    false,
    rowPivotMeta,
    colPivotMeta,
  );
  const result = rowPath.concat(...colPath);

  return result;
}

/**
 * 获取查询结果中的纬度值
 * @param dimensions [province, city]
 * @param query { province: '四川省', city: '成都市', type: '办公用品' }
 * @returns ['四川省', '成都市']
 */
export function getQueryDimValues(
  dimensions: string[],
  query: DataType,
): string[] {
  return reduce(
    dimensions,
    (res: string[], dimension: string) => {
      // push undefined when not exist
      res.push(query[dimension]);
      return res;
    },
    [],
  );
}

/**
 * 转换原始数据为二维数组数据
 * @param rows
 * @param columns
 * @param originData
 * @param indexesData
 * @param totalData
 * @param sortedDimensionValues
 * @param rowPivotMeta
 * @param colPivotMeta
 */
export function transformIndexesData(params: Param) {
  const {
    rows,
    columns,
    originData = [],
    indexesData = [],
    totalData = [],
    sortedDimensionValues,
    rowPivotMeta,
    colPivotMeta,
  } = params;
  const paths = [];
  for (const data of [...originData, ...totalData]) {
    const rowDimensionValues = transformDimensionsValues(
      data,
      rows,
      sortedDimensionValues,
    );
    const colDimensionValues = transformDimensionsValues(
      data,
      columns,
      sortedDimensionValues,
    );
    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta,
      colPivotMeta,
      isFirstCreate: true,
      careUndefined: totalData?.length > 0,
      rowFields: rows,
      colFields: columns,
    });
    paths.push(path);
    set(indexesData, path, data);
  }
  return {
    paths,
    indexesData,
    rowPivotMeta,
    colPivotMeta,
    sortedDimensionValues,
  };
}

export function deleteMetaById(meta: PivotMeta, nodeId: string) {
  if (!meta || !nodeId) return;
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
