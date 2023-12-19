import { assembleDataCfg } from 'tests/util';
<<<<<<< HEAD
import type { RawData } from '../../../src/common';
import { transformIndexesData } from '@/utils/dataset/pivot-data-set';
=======
import {
  getExistValues,
  transformIndexesData,
} from '@/utils/dataset/pivot-data-set';
>>>>>>> origin/master

/**
 * 获取 Mock 数据
 */
export function getMockPivotMeta() {
  const sortedDimensionValues = {};
  const rawRowPivotMeta = new Map();
  const rawColPivotMeta = new Map();
<<<<<<< HEAD
  const rawIndexesData: RawData[][] | RawData[] = [];
  const { fields, data } = assembleDataCfg();

=======
  const rawIndexesData = {};
  const { fields, data, totalData } = assembleDataCfg();
>>>>>>> origin/master
  return transformIndexesData({
    rows: fields.rows,
    columns: fields.columns,
    values: fields.values,
<<<<<<< HEAD
    originData: data,
=======
    data: data.concat(totalData),
>>>>>>> origin/master
    indexesData: rawIndexesData,
    sortedDimensionValues,
    rowPivotMeta: rawRowPivotMeta,
    colPivotMeta: rawColPivotMeta,
    valueInCols: true,
    getExistValuesByDataItem: getExistValues,
  });
}
