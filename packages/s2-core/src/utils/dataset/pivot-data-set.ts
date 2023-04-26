import { forEach, has, intersection, last, set, find, get } from 'lodash';
import type { CellData } from '../../data-set/cell-data';
import {
  EXTRA_FIELD,
  NODE_ID_SEPARATOR,
  ROOT_NODE_ID,
  TOTAL_VALUE,
  MULTI_VALUE,
} from '../../common/constant';
import type { BaseFields, RawData } from '../../common/interface';
import type {
  DataPath,
  DataPathParams,
  PivotMeta,
  SortedDimensionValues,
} from '../../data-set/interface';
import type { Meta } from '../../common/interface/basic';

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

    return splitArr?.[splitArr?.length! - 1] || item;
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
    shouldCreateOrUpdate,
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

  /*
   * 根据行、列维度值生成对应的 path路径，始终将总计小计置于第 0 位，明细数据从第 1 位开始，有两个情况：
   * 如果是汇总格子: path = [0,0,0,0] path中会存在 0的值（这里在indexesData里面会映射）
   * 如果是明细格子: path = [1,1,1] 数字均不为0
   */
  const getPath = (
    dimensions: string[],
    dimensionValues: string[],
    pivotMeta: PivotMeta,
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

      // 只出现在 getMultiData 中， 使用特殊的 value 指明当前复合选择
      if (value === MULTI_VALUE) {
        path.push(value);
      } else {
        path.push(meta?.level!);
      }

      if (meta) {
        if (shouldCreateOrUpdate && meta.childField !== dimensions?.[i + 1]) {
          meta.childField = dimensions?.[i + 1];
        }

        currentMeta = meta?.children;
      }
    }

    return path;
  };

  const rowPath = getPath(rows as string[], rowDimensionValues, rowPivotMeta!);
  const colPath = getPath(
    columns as string[],
    colDimensionValues,
    colPivotMeta!,
  );
  const result = rowPath.concat(...colPath);

  return result;
}

interface Param extends BaseFields {
  originData: RawData[];
  indexesData: RawData[][] | RawData[];
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
    sortedDimensionValues,
    rowPivotMeta,
    colPivotMeta,
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
      return;
    }

    (
      sortedDimensionValues[dimension] ||
      (sortedDimensionValues[dimension] = [])
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
