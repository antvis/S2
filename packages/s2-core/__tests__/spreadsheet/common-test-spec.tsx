import { merge, clone, omit } from 'lodash';
import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import {
  auto,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { getContainer, getMockData } from './helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import { Switch, Checkbox } from 'antd';
import { CustomTooltip } from './custom/custom-tooltip';

// const data = [
//   {
//     "price": 7091.89
//   },
//   {
//     "province": "辽宁省",
//     "price": 3482.28,
//     "city": "达州市",
//     "category": "桌子",
//     "subCategory": "家具"
//   },
//   {
//     "province": "辽宁省",
//     "price": 931.89,
//     "city": "芜湖市",
//     "category": "桌子",
//     "subCategory": "家具"
//   },
//   {
//     "province": "辽宁省",
//     "price": 1606.58,
//     "city": "达州市",
//     "category": "椅子",
//     "subCategory": "家具"
//   },
//   {
//     "province": "辽宁省",
//     "price": 1071.14,
//     "city": "芜湖市",
//     "category": "椅子",
//     "subCategory": "家具"
//   },
//   {
//     "price": 4414.17,
//     "category": "桌子",
//     "subCategory": "家具"
//   },
//   {
//     "price": 2677.72,
//     "category": "椅子",
//     "subCategory": "家具"
//   },
//   {
//     "price": 7091.89,
//     "subCategory": "家具"
//   },
//   {
//     "price": 7091.889999999999
//   },
//   {
//     "price": 7091.889999999999,
//     "subCategory": "家具"
//   },
//   {
//     "price": 2677.72,
//     "category": "椅子",
//     "subCategory": "家具"
//   },
//   {
//     "price": 4414.17,
//     "category": "桌子",
//     "subCategory": "家具"
//   },
//   {
//     "price": 7091.889999999999
//   },
//   {
//     "price": 4414.17,
//     "category": "桌子",
//     "subCategory": "家具"
//   },
//   {
//     "price": 2677.72,
//     "category": "椅子",
//     "subCategory": "家具"
//   },
//   {
//     "price": 7091.889999999999,
//     "subCategory": "家具"
//   },
//   {
//     "province": "辽宁省",
//     "price": 4414.17,
//     "category": "桌子",
//     "subCategory": "家具"
//   },
//   {
//     "province": "辽宁省",
//     "price": 2677.72,
//     "category": "椅子",
//     "subCategory": "家具"
//   }
// ];
// province, city, category, subCategory, price(EXTRA_VALUE)
const data = [
  {
    price: 1,
  },
  {
    province: '辽宁省',
    price: 2,
  },
  {
    province: '辽宁省',
    price: 3,
    city: '达州市',
  },
  {
    province: '辽宁省',
    price: 4,
    city: '芜湖市',
  },
  {
    price: 5,
    category: '家具',
  },
  {
    province: '辽宁省',
    price: 6,
    category: '家具',
  },
  {
    price: 7,
    province: '辽宁省',
    city: '达州市',
    category: '家具',
  },
  {
    price: 8,
    province: '辽宁省',
    city: '芜湖市',
    category: '家具',
  },
  {
    price: 9,
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 10,
    province: '辽宁省',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 11,
    province: '辽宁省',
    city: '达州市',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 12,
    province: '辽宁省',
    city: '芜湖市',
    category: '家具',
    subCategory: '桌子',
  },

  {
    price: 13,
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 14,
    province: '辽宁省',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 15,
    province: '辽宁省',
    city: '达州市',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 16,
    province: '辽宁省',
    city: '芜湖市',
    category: '家具',
    subCategory: '椅子',
  },
];
const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const getDataCfg = () => {
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

const getTheme = () => {
  return {};
};

function MainLayout(props) {
  return (
    <div>
      <SheetComponent
        dataCfg={props.dataCfg}
        adaptive={false}
        options={props.options}
        theme={props.theme}
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
      <MainLayout
        dataCfg={getDataCfg()}
        options={getOptions()}
        theme={getTheme()}
      />,
      getContainer(),
    );
  });
});
