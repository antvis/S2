import 'antd/dist/antd.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { auto, S2DataConfig, S2Options, PivotSheet } from '@antv/s2';
import { getContainer } from '../util/helpers';
import { SheetComponent } from '@/components';

const data = [];

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
const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new PivotSheet(dom, dataCfg, options);
};

const getDataCfg = () => {
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
        formatter: (v) => auto(v),
      },
    ],
    data,
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
  };
};

function MainLayout(props) {
  return (
    <div>
      <SheetComponent
        dataCfg={props.dataCfg}
        adaptive={false}
        options={props.options}
        spreadsheet={getSpreadSheet}
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
