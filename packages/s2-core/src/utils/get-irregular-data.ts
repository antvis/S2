import * as _ from 'lodash';
import { DataCfg } from '../common/interface';

export const DEFAULT_ROW = '_row_';
export const DEFAULT_COLUMN = '_column_';
export const DEFAULT_VALUE = '_value_';
const DEFAULT_PLACEHOLDER = 'abc';

/**
 * 如果当前数据有异常情况，处理数据。
 * 异常情况：仅列、仅行、仅行列
 * 解决此问题： http://gitlab.alipay-inc.com/eva-engine/eva-engine/issues/246
 */
export function processIrregularData(dataCfg: DataCfg) {
  // const newDataCfg = JSON.parse(JSON.stringify(dataCfg)); 不能使用 JSON.parse(JSON.stringify())，有format函数
  const newDataCfg = _.cloneDeep(dataCfg);
  const { fields, meta, data } = newDataCfg;
  const rowNumber = _.size(fields.rows);
  const colNumber = _.size(fields.columns);
  const valueNumber = _.size(fields.values);
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
