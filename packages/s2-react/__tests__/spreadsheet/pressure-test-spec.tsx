import 'antd/dist/antd.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  auto,
  type S2DataConfig,
  type S2Options,
  PivotSheet,
  type RawData,
  DeviceType,
  type S2MountContainer,
} from '@antv/s2';
import { getContainer } from '../util/helpers';
import { SheetComponent, type SheetComponentsProps } from '@/components';

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
) => {
  return new PivotSheet(dom, dataCfg, options as S2Options);
};

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
      colCell: {
        widthByField: {},
        heightByField: {},
      },
      dataCell: {
        height: 32,
      },
      rowCell: {
        // widthByField: {
        //   province: 200
        // }
      },
      device: DeviceType.PC,
    },
    tooltip: {
      showTooltip: true,
    },
  };
};

function MainLayout(props: SheetComponentsProps) {
  return (
    <div>
      <SheetComponent
        dataCfg={props.dataCfg}
        adaptive={false}
        options={props.options}
        spreadsheet={onMounted}
      />
    </div>
  );
}

describe('spreadsheet normal spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(
      <MainLayout dataCfg={getDataCfg()} options={getOptions()} />,
      getContainer(),
    );
  });
});
