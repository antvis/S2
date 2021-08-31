/** 明细表核心数据流程 */
import { flattenDeep, get } from 'lodash';
import { SpreadSheet } from 'src/sheet-type';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import STANDARD_SPREADSHEET_DATA from '../../../data/standard-spreadsheet-data.json';
import { getContainer } from '../../../util/helpers';

describe('List Table Core Data Process', () => {
  const options = { width: 600, height: 400, mode: 'table' };
  const dataCfg = {
    fields: { columns: ['province', 'city', 'category', 'subCategory', 'price'] },
    data: STANDARD_SPREADSHEET_DATA.data,
  };
  const ss = new SpreadSheet(getContainer(), dataCfg, options);
  ss.render();

  describe('1、Transform indexes data', () => {
    
  });

  describe('2、Generate hierarchy', () => {
   
  });

  describe('3、Calculate row & col coordinates', () => {
    test('1', () => {})
  });

  describe('4、Calculate overlapped data cell info', () => {
    test('1', () => {})
  });
  
});
