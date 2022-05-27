import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  auto,
  EXTRA_FIELD,
  PivotSheet,
  S2DataConfig,
  S2Options,
  SpreadSheet,
} from '@antv/s2';
import {
  data10,
  data6,
  data7,
  data9,
  totalData10,
  totalData6,
  totalData8,
  totalData9,
} from '../data/data-accuracy';
import { getContainer } from '../util/helpers';
import { SheetComponent } from '@/components';
import 'antd/dist/antd.min.css';

let spreadsheet1: SpreadSheet;
const setSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
  index: number,
) => {
  const s2 = new PivotSheet(dom, dataCfg, options);
  if (index === 1) {
    spreadsheet1 = s2;
  }
  return s2;
};

const getData = (index: number, isTotal?: boolean) => {
  let realData = [];
  let totalData = [];
  // eslint-disable-next-line default-case
  switch (index) {
    case 1:
      realData = data6;
      totalData = totalData6;
      break;
    case 2:
      realData = data7;
      totalData = [];
      break;
    case 3:
      realData = [];
      totalData = totalData8;
      break;
    case 4:
      realData = data9;
      totalData = totalData9;
      break;
    case 5:
      realData = data10;
      totalData = totalData10;
      break;
  }

  if (isTotal) {
    return totalData;
  }
  return realData;
};

const getDataCfg = (index: number) => {
  return {
    fields: {
      rows: ['province', 'city'],
      columns: ['category', 'subCategory'],
      values: ['price', 'account'],
      valueInCols: true,
    },
    meta: [
      {
        field: 'price',
        name: '单价',
        formatter: (v) => auto(v),
      },
      {
        field: 'account',
        name: '账号',
        formatter: (v) => auto(v),
      },
    ],
    data: getData(index),
    totalData: getData(index, true),
    sortParams: [],
  };
};

const getOptions = () => {
  return {
    debug: true,
    width: 800,
    height: 600,
    hierarchyType: 'grid',
    hierarchyCollapse: false,
    showSeriesNumber: false,
    frozenRowHeader: false,
    totals: {
      row: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseLayout: true,
        reverseSubLayout: true,
        subTotalsDimensions: ['province', 'city'],
      },
      col: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseLayout: true,
        reverseSubLayout: true,
        subTotalsDimensions: ['subCategory', 'category'],
      },
    },
    style: {
      treeRowsWidth: 100,
      collapsedRows: {},
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
      },
      cellCfg: {
        height: 32,
      },
      rowCfg: {
        // widthByField: {
        //   province: 200
        // }
      },
      device: 'pc',
    },
    tooltip: {
      showTooltip: true,
    },
  } as S2Options;
};

const wrapComponent = (text, component) => {
  return (
    <div>
      <div>{text}</div>
      <div style={{ height: '300px' }}>{component}</div>
    </div>
  );
};

function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {wrapComponent(
        '小计+总计+明细数据',
        <SheetComponent
          dataCfg={getDataCfg(1)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={(
            dom: string | HTMLElement,
            dataCfg: S2DataConfig,
            options: S2Options,
          ) => {
            return setSpreadSheet(dom, dataCfg, options, 1);
          }}
        />,
      )}
      {/* {wrapComponent(
        '只有明细数据',
        <SheetComponent
          dataCfg={getDataCfg(2)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={(
            dom: string | HTMLElement,
            dataCfg: S2DataConfig,
            options: S2Options,
          ) => {
            return setSpreadSheet(dom, dataCfg, options, 2);
          }}
        />,
      )} */}
      {/* {wrapComponent(
        '只有小计，总计数据',
        <SheetComponent
          dataCfg={getDataCfg(3)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={(
            dom: string | HTMLElement,
            dataCfg: S2DataConfig,
            options: S2Options,
          ) => {
            return setSpreadSheet(dom, dataCfg, options, 3);
          }}
        />,
      )} */}
      {/* {wrapComponent(
        '总计 + 明细数据',
        <SheetComponent
          dataCfg={getDataCfg(4)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={(
            dom: string | HTMLElement,
            dataCfg: S2DataConfig,
            options: S2Options,
          ) => {
            return setSpreadSheet(dom, dataCfg, options, 4);
          }}
        />,
      )} */}
      {/* {wrapComponent(
        '小计 + 明细数据',
        <SheetComponent
          dataCfg={getDataCfg(5)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={(
            dom: string | HTMLElement,
            dataCfg: S2DataConfig,
            options: S2Options,
          ) => {
            return setSpreadSheet(dom, dataCfg, options, 5);
          }}
        />,
      )} */}
    </div>
  );
}

describe('data accuracy two measures spec', () => {
  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
  spreadsheet1.setDataCfg(getDataCfg(6));
  test('Totals + Details + Tow Measures', () => {
    expect(data6.length).toBe(8);
    // expect(spreadsheet1.dataSet.originData.length).toBe(8);
    expect(spreadsheet1.dataSet.fields.valueInCols).toBe(true);
    expect(spreadsheet1.dataSet.fields.columns.includes(EXTRA_FIELD)).toBe(
      true,
    );
    expect(spreadsheet1.dataSet.fields.columns.length).toBe(3);
  });
});
