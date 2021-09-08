/**
 * 标准表格测试
 */

import STANDARD_SPREADSHEET_DATA from './standard-spreadsheet-data.json';
import STANDARD_TOTAL_DATA from './standard-total-data.json';

export const FIELDS = {
  rows: ['province', 'city'],
  columns: ['category', 'subCategory'],
  values: ['price'],
  valueInCols: true,
}

export const DATA_CFG = {
  fields: FIELDS,
  data: STANDARD_SPREADSHEET_DATA.data,
};

export const DATA_TOTAL_CFG = {
  fields: FIELDS,
  data: STANDARD_SPREADSHEET_DATA.data,
  totalData: STANDARD_TOTAL_DATA.data,
};

export const OPTION = {
  width: 1200, 
  height: 800,
};

