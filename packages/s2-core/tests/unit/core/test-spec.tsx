/** 核心数据流程 */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { EXTRA_FIELD, VALUE_FIELD } from 'src/common/constant';
import { S2DataConfig, S2Options } from 'src/common/interface';
import { SpreadSheet } from 'src/sheet-type';
import { PivotDataSet } from 'src/data-set/pivot-data-set';
import {
  SheetComponent,
} from 'src/index';
import { getContainer } from '../../util/helpers';
import STANDARD_SPREADSHEET_DATA from '../../data/standard-spreadsheet-data';


const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const getDataCfg = () => {
  return {
    fields: {
      rows: ['province', 'city'],
      columns: ['category', 'subCategory'],
      valueInCols: false,
      values: ['price']
    },
    data: STANDARD_SPREADSHEET_DATA,
  } as S2DataConfig;
};


describe('Pivot Dataset Test', () => {
  act(() => {
    ReactDOM.render(
      <SheetComponent
        dataCfg={getDataCfg()}
        options={{ width: 800, height: 600 }}
        spreadsheet={getSpreadSheet}
      />,
      getContainer(),
    );
  });
  // beforeEach(() => {
  //   MockSpreadSheet.mockClear();
  //   dataSet = new PivotDataSet(new MockSpreadSheet());
  // });

  // describe('1、Transform indexes data', () => {
  //   beforeEach(() => {
  //     dataCfg = {
  //       fields: { rows: ['province', 'city'], columns: ['category', 'subCategory'], values: ['price'] },
  //       data: STANDARD_SPREADSHEET_DATA,
  //     };
  //   });
  //   test('should get correct indexes data', () => {
  //     dataSet.setDataCfg(dataCfg);
  //     debugger;
  //   });

  //   // test('should get correct pivot meta', () => {
  //   //   dataSet.setDataCfg(dataCfg);
  //   //   debugger;
  //   // });
  // });
  
});
