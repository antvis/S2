import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import {
  auto,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { getContainer } from '../helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import { data1, data2, data3, data4, data5 } from "../datasets/data-accuracy";

const spreadsheet1 = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const spreadsheet2 = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const spreadsheet3 = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const spreadsheet4 = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const spreadsheet5 = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const getData = (index: number) => {
  let realData = [];
  switch (index) {
    case 1:
      realData = data1;
      break;
    case 2:
      realData = data2;
      break;
    case 3:
      realData = data3;
      break;
    case 4:
      realData = data4;
      break;
    case 5:
      realData = data5;
      break;
  }
  return realData;
}

const getDataCfg = (index: number) => {
  return {
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
        colWidthType: 'adaptive',
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
      <div style={{ height: "300px" }}>
        {component}
      </div>
    </div>
  );
}

function MainLayout(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {wrapComponent('小计+总计+明细数据',
        <SheetComponent
          dataCfg={getDataCfg(1)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={spreadsheet1}
        />
      )}
      {wrapComponent('只有明细数据',
        <SheetComponent
          dataCfg={getDataCfg(2)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={spreadsheet2}
        />
      )}
      {wrapComponent('只有小计，总计数据',
        <SheetComponent
          dataCfg={getDataCfg(3)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={spreadsheet3}
        />
      )}
      {wrapComponent('总计 + 明细数据',
        <SheetComponent
          dataCfg={getDataCfg(4)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={spreadsheet4}
        />
      )}
      {wrapComponent('小计 + 明细数据',
        <SheetComponent
          dataCfg={getDataCfg(5)}
          adaptive={false}
          options={getOptions()}
          spreadsheet={spreadsheet5}
        />
      )}
    </div>
  );
}

describe('data accuracy spec', () => {
  test('demo', () => {
    // TODO 断言每个数据流是否符合预期
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(
      <MainLayout />,
      getContainer(),
    );
  });
});
