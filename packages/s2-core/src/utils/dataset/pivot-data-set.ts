import { forEach, has, intersection, last, set } from 'lodash';
import type { CellData } from '../../data-set/cell-data';
import {
  EXTRA_FIELD,
  ID_SEPARATOR,
  ROOT_ID,
  TOTAL_VALUE,
  MULTI_VALUE,
} from '../../common/constant';
import type { BaseFields, RawData } from '../../common/interface';
import type {
  DataPathParams,
  PivotMeta,
  SortedDimensionValues,
} from '../../data-set/interface';

export function filterExtraDimension(dimensions: string[] = []) {
  return dimensions.filter((d) => d !== EXTRA_FIELD);
}

export function transformDimensionsValues(
  record: RawData,
  dimensions: string[],
  placeholder: string = TOTAL_VALUE,
): string[] {
  return filterExtraDimension(dimensions).map((dimension) => {
    return !has(record, dimension) ? placeholder : String(record[dimension]);
  });
}

export function shouldQueryMultiData(pathValue: string | number) {
  return pathValue === MULTI_VALUE;
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
  dimensions: CellData[],
) {
  const measure = defaultDimensions.slice(
    0,
    defaultDimensions.indexOf(field) + 1,
  );
  return dimensions
    .map((item) =>
      measure.map((i) => item.getValueByKey(i)).join(`${ID_SEPARATOR}`),
    )
    ?.filter(Boolean);
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
    rows,
    columns,
    values,
    rowDimensionValues,
    colDimensionValues,
    createIfNotExist,
    onCreate,
    rowPivotMeta,
    colPivotMeta,
  } = params;

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

  // 根据行、列维度值生成对应的 path路径，始终将总计小计置于第 0 位，明细数据从第 1 位开始，有两个情况：
  // 如果是汇总格子: path = [0,0,0,0] path中会存在 0的值（这里在indexesData里面会映射）
  // 如果是明细格子: path = [1,1,1] 数字均不为0
  const getPath = (
    dimensions: string[],
    dimensionValues: string[],
    pivotMeta: PivotMeta,
  ): number[] => {
    let currentMeta = pivotMeta;
    const path = [];
    for (let i = 0; i < dimensionValues.length; i++) {
      const value = dimensionValues[i];
      const isTotal = value === TOTAL_VALUE;

      if (!currentMeta.has(value) && createIfNotExist) {
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

      // 只出现在 getMultiData 中， 使用特殊的 value 指明当前复合选择
      if (value === MULTI_VALUE) {
        path.push(value);
      } else {
        path.push(meta?.level);
      }

      if (meta) {
        currentMeta = meta?.children;
      }
    }
    return path;
  };

  const rowPath = getPath(rows, rowDimensionValues, rowPivotMeta);
  const colPath = getPath(columns, colDimensionValues, colPivotMeta);
  const result = rowPath.concat(...colPath);

  return result;
}

interface Param extends BaseFields {
  originData: RawData[];
  indexesData: RawData[][] | RawData[];
  totalData?: RawData[];
  sortedDimensionValues: SortedDimensionValues;
  rowPivotMeta?: PivotMeta;
  colPivotMeta?: PivotMeta;
}

/**
 * 转换原始数据为多维数组数据
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
    // 空数据没有意义，直接跳过，而不是在后面 getMultiData 再来 compact
    if (!data) {
      return;
    }
    const rowDimensionValues = transformDimensionsValues(data, rows);
    const colDimensionValues = transformDimensionsValues(data, columns);
    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta,
      colPivotMeta,
      createIfNotExist: true,
      onCreate: onFirstCreate,
      rows,
      columns,
      values,
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
