import {
  EXTRA_FIELD,
  PivotSheet,
  SpreadSheet,
  auto,
  type RawData,
  type S2DataConfig,
  type S2MountContainer,
  type S2Options,
} from '@antv/s2';

import React from 'react';
import {
  data1,
  data2,
  data4,
  data5,
  data6,
  totalData1,
  totalData3,
  totalData4,
  totalData5,
  totalData6,
} from '../data/data-accuracy';
import { renderComponent } from '../util/helpers';
import {
  type SheetComponentsProps,
  type SheetComponentOptions,
  SheetComponent,
} from '../../src';

let spreadsheet: SpreadSheet;

const setSpreadSheet = (
  dom: S2MountContainer,
  dataCfg: S2DataConfig,
  options: SheetComponentsProps['options'],
  index: number,
) => {
  const s2 = new PivotSheet(dom, dataCfg, options as S2Options);

  if (index === 1) {
    spreadsheet = s2;
  }

  return s2;
};

const getData = (index: number, isTotal?: boolean) => {
  let realData: RawData[] = [];
  let totalData: RawData[] = [];

  // eslint-disable-next-line default-case
  switch (index) {
    case 1:
      realData = data1;
      totalData = totalData1;
      break;
    case 2:
      realData = data2;
      totalData = [];
      break;
    case 3:
      realData = [];
      totalData = totalData3;
      break;
    case 4:
      realData = data4;
      totalData = totalData4;
      break;
    case 5:
      realData = data5;
      totalData = totalData5;
      break;
    case 6:
      realData = data6;
      totalData = totalData6;
      break;
  }

  if (isTotal) {
    return totalData;
  }

  return realData;
};

const getDataCfg = (index: number) =>
  ({
    fields: {
      rows: ['province', 'city'],
      columns: ['category', 'subCategory'],
      values: ['price'],
      valueInCols: true,
    },

    meta: [
      {
        field: 'price',
        name: '单价',
        formatter: (v: number) => auto(v),
      },
      {
        field: 'account',
        name: '账号',
        formatter: (v: string) => `${v}个`,
      },
    ],

    data: getData(index),
    totalData: getData(index, true),
    sortParams: [],
  }) as SheetComponentsProps['dataCfg'];

const getOptions = (): SheetComponentOptions => {
  return {
    width: 800,
    height: 600,
    hierarchyType: 'grid',
    seriesNumber: {
      enable: false,
    },
    frozen: {
      rowHeader: false,
    },
    totals: {
      row: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseGrandTotalsLayout: true,
        reverseSubTotalsLayout: true,
        subTotalsDimensions: ['province', 'city'],
      },
      col: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseGrandTotalsLayout: true,
        reverseSubTotalsLayout: true,
        subTotalsDimensions: ['subCategory', 'category'],
      },
    },
    style: {
      colCell: {
        widthByField: {},
        heightByField: {},
      },
      dataCell: {
        height: 32,
      },
      rowCell: {
        collapseAll: false,
        width: 100,
      },
    },
    tooltip: {
      enable: true,
    },
  };
};

const wrapComponent = (text: string, component: React.ReactNode) => (
  <div style={{ marginBottom: 30 }}>
    <div>{text}</div>
    <div style={{ height: '300px' }}>{component}</div>
  </div>
);

function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {wrapComponent(
        '小计+总计+明细数据+单个指标',
        <SheetComponent
          dataCfg={getDataCfg(1)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={(
            dom: S2MountContainer,
            dataCfg: S2DataConfig,
            options: SheetComponentsProps['options'],
          ) => setSpreadSheet(dom, dataCfg, options, 1)}
        />,
      )}
      {wrapComponent(
        '只有明细数据',
        <SheetComponent
          dataCfg={getDataCfg(2)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={(
            dom: S2MountContainer,
            dataCfg: S2DataConfig,
            options: SheetComponentsProps['options'],
          ) => setSpreadSheet(dom, dataCfg, options, 2)}
        />,
      )}
      {wrapComponent(
        '只有小计，总计数据',
        <SheetComponent
          dataCfg={getDataCfg(3)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={(
            dom: S2MountContainer,
            dataCfg: S2DataConfig,
            options: SheetComponentsProps['options'],
          ) => setSpreadSheet(dom, dataCfg, options, 3)}
        />,
      )}
      {wrapComponent(
        '总计 + 明细数据',
        <SheetComponent
          dataCfg={getDataCfg(4)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={(
            dom: S2MountContainer,
            dataCfg: S2DataConfig,
            options: SheetComponentsProps['options'],
          ) => setSpreadSheet(dom, dataCfg, options, 4)}
        />,
      )}
      {wrapComponent(
        '小计 + 明细数据',
        <SheetComponent
          dataCfg={getDataCfg(5)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={(
            dom: S2MountContainer,
            dataCfg: S2DataConfig,
            options: SheetComponentsProps['options'],
          ) => setSpreadSheet(dom, dataCfg, options, 5)}
        />,
      )}
    </div>
  );
}

describe('data accuracy one measure spec', () => {
  renderComponent(<MainLayout />);

  spreadsheet.setDataCfg(getDataCfg(1));

  test('Totals + Details + Single Measure', () => {
    expect(data1.length).toBe(4);
    expect(spreadsheet.dataSet.originData.length).toBe(4);
    expect(spreadsheet.dataSet.fields.valueInCols).toBe(true);
    expect(spreadsheet.dataSet.fields.columns!.includes(EXTRA_FIELD)).toBe(
      true,
    );
    expect(spreadsheet.dataSet.fields.rows!.includes(EXTRA_FIELD)).toBe(false);
  });
});
