import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { S2DataConfig, S2Options, PivotSheet } from '@antv/s2';
import { mockTabularDataCfg, mockTabularOptions } from '../data/tabular-data';
import { getContainer } from '../util/helpers';
import { SheetComponent } from '@/components/index';

const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new PivotSheet(dom, dataCfg, options);
};

const options = mockTabularOptions;

describe('spreadsheet tabular spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(
      <SheetComponent
        sheetType="tabular"
        dataCfg={mockTabularDataCfg}
        adaptive={false}
        options={options}
        spreadsheet={getSpreadSheet}
        header={{ exportCfg: { open: true } }}
      />,
      getContainer(),
    );
  });
});
