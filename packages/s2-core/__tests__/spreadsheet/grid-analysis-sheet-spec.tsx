import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React from 'react';
import {
  mockGridAnalysisDataCfg,
  mockGridAnalysisOptions,
} from 'tests/data/grid-analysis-data';
import { getContainer } from '../util/helpers';
import { SheetComponent } from '@/index';

const options = mockGridAnalysisOptions;

describe('spreadsheet gridAnalysis spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(
      <SheetComponent
        sheetType="gridAnalysis"
        dataCfg={mockGridAnalysisDataCfg}
        adaptive={false}
        options={options}
        header={{ exportCfg: { open: true } }}
      />,
      getContainer(),
    );
  });
});
