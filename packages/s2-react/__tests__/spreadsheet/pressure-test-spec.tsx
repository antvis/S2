import {
  auto,
  PivotSheet,
  type RawData,
  type S2DataConfig,
  type S2MountContainer,
  type S2Options,
} from '@antv/s2';
import React from 'react';
import { renderComponent } from '../util/helpers';
import { type SheetComponentsProps, SheetComponent } from '../../src';

const data: RawData[] = [];

// 100W 条数据
for (let i = 0; i < 1000; i++) {
  for (let j = 0; j < 1000; j++) {
    data.push({
      price: i,
      province: '四川省',
      city: `成都市 ${i}`,
      category: `家具 ${j}`,
    });
  }
}
const onMounted = (
  dom: S2MountContainer,
  dataCfg: S2DataConfig,
  options: SheetComponentsProps['options'],
) => new PivotSheet(dom, dataCfg, options as S2Options);

const getDataCfg = (): S2DataConfig => {
  return {
    fields: {
      rows: ['province', 'city'],
      columns: ['category'],
      values: ['price'],
      valueInCols: true,
    },
    meta: [
      {
        field: 'price',
        name: '单价',
        formatter: (v: unknown) => auto(v as number),
      },
    ],
    data,
    sortParams: [],
  };
};

const getOptions = (): SheetComponentsProps['options'] => {
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
        width: 100,
      },
    },
    tooltip: {
      enable: true,
    },
  };
};

function MainLayout(props: SheetComponentsProps) {
  return (
    <SheetComponent
      dataCfg={props.dataCfg}
      adaptive={false}
      options={props.options}
      spreadsheet={onMounted}
    />
  );
}

describe('spreadsheet normal spec', () => {
  test('performance tests', () => {
    renderComponent(
      <MainLayout dataCfg={getDataCfg()} options={getOptions()} />,
    );

    expect(1).toBe(1);
  });
});
