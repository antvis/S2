import { assembleDataCfg } from 'tests/util/sheet-entry';
import { transformIndexesData } from '@/utils/dataset/pivot-data-set';

/**
 * 获取 Mock 数据
 */
export function getMockPivotMeta() {
  const sortedDimensionValues = new Map();
  const rawRowPivotMeta = new Map();
  const rawColPivotMeta = new Map();
  const { fields, data, totalData } = assembleDataCfg();
  return transformIndexesData({
    rows: fields.rows,
    columns: fields.columns,
    originData: data,
    totalData,
    sortedDimensionValues,
    rowPivotMeta: rawRowPivotMeta,
    colPivotMeta: rawColPivotMeta,
  });
}
