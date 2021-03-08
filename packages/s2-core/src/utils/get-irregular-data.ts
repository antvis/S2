import { cloneDeep, size } from 'lodash';
import { DataCfg } from '../common/interface';

export const DEFAULT_ROW = '_row_';
export const DEFAULT_COLUMN = '_column_';
export const DEFAULT_VALUE = '_value_';

/**
 * 如果当前数据有异常情况，处理数据。
 * 异常情况：仅列、仅行、仅行列
 */
export function processIrregularData(dataCfg: DataCfg) {
  // const newDataCfg = JSON.parse(JSON.stringify(dataCfg)); 不能使用 JSON.parse(JSON.stringify())，有format函数
  const newDataCfg = cloneDeep(dataCfg);
  const { fields } = newDataCfg;
  const rowNumber = size(fields.rows);
  const colNumber = size(fields.columns);
  const valueNumber = size(fields.values);
  // 仅列
  if (colNumber && !rowNumber && !valueNumber) {
    // fields.rows.push(DEFAULT_ROW);
    // fields.values.push(DEFAULT_VALUE);
    // meta.push({
    //   field: DEFAULT_ROW,
    //   name: '',
    //   type: 'continuous',
    // });
    // meta.push({
    //   field: DEFAULT_VALUE,
    //   name: '',
    //   type: 'continuous',
    // });
    // data.map((d) => {
    //   d[DEFAULT_ROW] = '';
    //   d[DEFAULT_VALUE] = '';
    // });
  }
  // 仅行
  if (rowNumber && !colNumber && !valueNumber) {
    // fields.columns.push(DEFAULT_COLUMN);
    // fields.values.push(DEFAULT_VALUE);
    // meta.push({
    //   field: DEFAULT_COLUMN,
    //   name: '',
    //   type: 'continuous',
    // });
    // meta.push({
    //   field: DEFAULT_VALUE,
    //   name: '',
    //   type: 'continuous',
    // });
    // data.map((d) => {
    //   d[DEFAULT_COLUMN] = '';
    //   d[DEFAULT_VALUE] = '';
    // });
  }
  // 仅行列
  if (rowNumber && colNumber && !valueNumber) {
    // fields.values.push(DEFAULT_VALUE);
    // meta.push({
    //   field: DEFAULT_VALUE,
    //   name: '',
    //   type: 'continuous',
    // });
    // data.map((d) => {
    //   d[DEFAULT_VALUE] = DEFAULT_PLACEHOLDER;
    // });
  }
  return newDataCfg;
}
