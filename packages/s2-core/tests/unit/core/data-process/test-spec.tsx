/**
 * 交叉表核心数据流程（保证基本数据正确）
 * */
 import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';
 import { PivotDataSet } from '@/data-set/pivot-data-set';
 import { SpreadSheet } from '@/sheet-type';
 import { flattenDeep, get, size, uniq } from 'lodash';
 import STANDARD_SPREADSHEET_DATA from '../../../data/standard-spreadsheet-data.json';
 import STANDARD_TOTAL_DATA from '../../../data/standard-total-data.json';
 import { getContainer } from '../../../util/helpers';
 
 describe('Cross Table Core Data Process', () => {
   const options = { 
     width: 1200, height: 800, 
     totals: {
       row: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseLayout: true,
        subTotalsDimensions: ['province'],
        reverseSubLayout: true,
       },
       col: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseLayout: true,
        subTotalsDimensions: ['category'],
        reverseSubLayout: true,
       }
     } };
   const dataCfg = {
     fields: {
       rows: ['province', 'city'],
       columns: ['category', 'subCategory'],
       values: ['price'],
     },
     data: STANDARD_SPREADSHEET_DATA.data,
     totalData: STANDARD_TOTAL_DATA.data,
   };
   const ss = new SpreadSheet(getContainer(), dataCfg, options);
   ss.render();
 });
 