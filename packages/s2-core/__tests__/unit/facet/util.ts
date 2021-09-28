import { 
  transformIndexesData,
} from '@/utils/dataset/pivot-data-set';
import { assembleDataCfg } from '../../util/sheet-entry';

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
};
