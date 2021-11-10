import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer } from 'tests/util/helpers';
import { originData, totalData, meta, fields } from 'tests/data/data-sort.json';
import {
  DEFAULT_OPTIONS,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SortParams,
} from '@/index';
import 'antd/dist/antd.min.css';
import './less/sort-sheet-spec.less';

function MainLayout() {
  const options: S2Options = {
    ...DEFAULT_OPTIONS,
    width: 880,
    height: 600,
    totals: {
      row: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseLayout: true,
        reverseSubLayout: true,
        subTotalsDimensions: ['province'],
      },
      col: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseLayout: true,
        reverseSubLayout: true,
        subTotalsDimensions: ['type'],
      },
    },
  };

  const sortParams: SortParams = [
    { sortFieldId: 'province', sortMethod: 'DESC' },
    { sortFieldId: 'type', sortBy: ['家具产品', '办公用品'] },
    {
      sortFieldId: 'city',
      sortByMeasure: 'cost',
      sortMethod: 'DESC',
    },
  ];

  const [dataCfg, setDataCfg] = useState<S2DataConfig>({
    fields: {
      ...fields,
      valueInCols: true,
    },
    meta,
    data: originData,
    totalData,
    sortParams,
  });

  return (
    <>
      <SheetComponent
        dataCfg={dataCfg}
        options={options}
        adaptive={false}
        header={{
          advancedSortCfg: {
            open: true,
            sortParams,
            onSortConfirm: (ruleValues, sortParams) => {
              setDataCfg({ ...dataCfg, sortParams });
            },
          },
        }}
      />
    </>
  );
}

describe('spreadsheet normal spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
});
