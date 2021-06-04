import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import {
  auto,
  EXTRA_FIELD,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { getContainer } from '../helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import {
  data6,
  data7,
  data8,
  data9,
  data10,
} from '../datasets/data-accuracy';

let spreadsheet1: SpreadSheet;
const setSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
  index: number,
) => {
  const ss = new SpreadSheet(dom, dataCfg, options);
  if (index === 1) {
    spreadsheet1 = ss;
  }
  return ss;
};

const getData = (index: number) => {
  let realData = [];
  switch (index) {
    case 1:
      realData = data6;
      break;
    case 2:
      realData = data7;
      break;
    case 3:
      realData = data8;
      break;
    case 4:
      realData = data9;
      break;
    case 5:
      realData = data10;
      break;
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
    freezeRowHeader: false,
    mode: 'pivot',
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
        colWidthType: 'compat',
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
  };
};

const wrapComponent = (text, component) => {
  return (
    <div>
      <div>{text}</div>
      <div style={{ height: '300px' }}>{component}</div>
    </div>
  );
};

function MainLayout(props) {
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
    {/*  {wrapComponent(*/}
    {/*    '只有明细数据',*/}
    {/*    <SheetComponent*/}
    {/*      dataCfg={getDataCfg(2)}*/}
    {/*      adaptive={false}*/}
    {/*      options={getOptions()}*/}
    {/*      spreadsheet={(*/}
    {/*        dom: string | HTMLElement,*/}
    {/*        dataCfg: S2DataConfig,*/}
    {/*        options: S2Options,*/}
    {/*      ) => {*/}
    {/*        return setSpreadSheet(dom, dataCfg, options, 2);*/}
    {/*      }}*/}
    {/*    />,*/}
    {/*  )}*/}
    {/*  {wrapComponent(*/}
    {/*    '只有小计，总计数据',*/}
    {/*    <SheetComponent*/}
    {/*      dataCfg={getDataCfg(3)}*/}
    {/*      adaptive={false}*/}
    {/*      options={getOptions()}*/}
    {/*      spreadsheet={(*/}
    {/*        dom: string | HTMLElement,*/}
    {/*        dataCfg: S2DataConfig,*/}
    {/*        options: S2Options,*/}
    {/*      ) => {*/}
    {/*        return setSpreadSheet(dom, dataCfg, options, 3);*/}
    {/*      }}*/}
    {/*    />,*/}
    {/*  )}*/}
    {/*  {wrapComponent(*/}
    {/*    '总计 + 明细数据',*/}
    {/*    <SheetComponent*/}
    {/*      dataCfg={getDataCfg(4)}*/}
    {/*      adaptive={false}*/}
    {/*      options={getOptions()}*/}
    {/*      spreadsheet={(*/}
    {/*        dom: string | HTMLElement,*/}
    {/*        dataCfg: S2DataConfig,*/}
    {/*        options: S2Options,*/}
    {/*      ) => {*/}
    {/*        return setSpreadSheet(dom, dataCfg, options, 4);*/}
    {/*      }}*/}
    {/*    />,*/}
    {/*  )}*/}
    {/*  {wrapComponent(*/}
    {/*    '小计 + 明细数据',*/}
    {/*    <SheetComponent*/}
    {/*      dataCfg={getDataCfg(5)}*/}
    {/*      adaptive={false}*/}
    {/*      options={getOptions()}*/}
    {/*      spreadsheet={(*/}
    {/*        dom: string | HTMLElement,*/}
    {/*        dataCfg: S2DataConfig,*/}
    {/*        options: S2Options,*/}
    {/*      ) => {*/}
    {/*        return setSpreadSheet(dom, dataCfg, options, 5);*/}
    {/*      }}*/}
    {/*    />,*/}
    {/*  )}*/}
    </div>
  );
}

describe('data accuracy two measures spec', () => {
  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });

  spreadsheet1.setDataCfg(getDataCfg(6));
  test('Totals + Details + Tow Measures', () => {
    expect(data6.length).toBe(16);
    expect(spreadsheet1.dataSet.originData.length).toBe(32);
    expect(spreadsheet1.dataSet.fields.valueInCols).toBe(true);
    expect(spreadsheet1.dataSet.fields.columns.includes(EXTRA_FIELD)).toBe(
      true,
    );
    expect(spreadsheet1.dataSet.fields.columns.length).toBe(3);
  });
});
