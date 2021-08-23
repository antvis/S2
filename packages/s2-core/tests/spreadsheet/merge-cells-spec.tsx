import { forEach } from 'lodash';
import { act } from 'react-dom/test-utils';
import { mergeCells } from '../../src/utils/interaction/merge-cells';
import 'antd/dist/antd.min.css';
import {
  auto,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { getContainer, getMockData } from '../util/helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import { Switch, Button } from 'antd';
import { CustomTooltip } from './custom/custom-tooltip';

let data = getMockData('../data/tableau-supermarket.csv');

data = data.map((row) => {
  row['profit-tongbi'] = 0.2233;
  row['profit-huanbi'] = -0.4411;
  row['count-tongbi'] = 0.1234;
  row['count-huanbi'] = -0.4321;
  return row;
});

const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const baseDataCfg: S2DataConfig = {
  fields: {
    // rows has value
    rows: ['area', 'province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['profit', 'count'],
  },
  meta: [
    {
      field: 'profit-tongbi',
      name: '利润同比',
      formatter: (v: number) => (!v ? '' : `${auto(v) + '%'}`),
    },
    {
      field: 'profit-huanbi',
      name: '利润环比',
      formatter: (v: number) => (!v ? '' : `${auto(v) + '%'}`),
    },
    {
      field: 'count-tongbi',
      name: '个数同比',
      formatter: (v: number) => (!v ? '' : `${auto(v) + '%'}`),
    },
    {
      field: 'count-huanbi',
      name: '个数环比',
      formatter: (v: number) => (!v ? '' : `${auto(v) + '%'}`),
    },
    {
      field: 'sale_amt',
      name: '销售额',
      formatter: (v: number) => v,
    },
    {
      field: 'count',
      name: '销售个数',
      formatter: (v) => v,
    },
    {
      field: 'discount',
      name: '折扣',
      formatter: (v) => v,
    },
    {
      field: 'profit',
      name: '利润',
      formatter: (v) => v,
    },
  ],
  data,
  sortParams: [
    {
      sortFieldId: 'area',
      sortMethod: 'ASC',
    },
    {
      sortFieldId: 'province',
      sortMethod: 'DESC',
    },
  ],
} as S2DataConfig;

const baseOptions = {
  debug: true,
  width: 800,
  height: 600,
  hierarchyType: 'grid',
  hierarchyCollapse: false,
  showSeriesNumber: true,
  freezeRowHeader: false,
  mode: 'pivot',
  valueInCols: true,
  conditions: {
    text: [],
    interval: [],
    background: [],
    icon: [],
  },
  style: {
    treeRowsWidth: 100,
    collapsedRows: {},
    colCfg: {
      widthByFieldValue: {},
      heightByField: {},
      colWidthType: 'compact',
    },
    cellCfg: {
      height: 32,
    },
    device: 'pc',
  },
  mergedCellsInfo: [
    [
      { colIndex: 1, rowIndex: 6 },
      { colIndex: 1, rowIndex: 7, showText: true },
      { colIndex: 2, rowIndex: 6 },
      { colIndex: 2, rowIndex: 7 },
      { colIndex: 3, rowIndex: 6 },
      { colIndex: 3, rowIndex: 7 },
    ],
  ],
  tooltip: {
    renderTooltip: (spreadsheet) => {
      return new CustomTooltip(spreadsheet);
    },
  },
} as S2Options;

const tabularDataCfg = {
  fields: {
    rows: ['COLUMNDIMENSION-scene'],
    columns: ['DIMENSION-sex', 'DIMENSION-age'],
    values: ['value'],
  },
  meta: [
    { field: 'DIMENSION-sex', name: 'sex' },
    {
      field: 'DIMENSION-age',
      name: 'age',
    },
    { field: 'COLUMNDIMENSION-scene', name: 'scene' },
    { field: 'value', name: '' },
  ],
  data: [
    {
      'DIMENSION-sex': '男',
      'DIMENSION-age': 16,
      'COLUMNDIMENSION-scene': '账单',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 66666,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.001,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': 1,
      value: {
        label: '账单男16',
        values: [
          ['最近7天登端天数', 1, 3423423, -323],
          ['自然月新登用户数', 1, -3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '男',
      'DIMENSION-age': 17,
      'COLUMNDIMENSION-scene': '账单',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 66666,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.001,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': 1,
      value: {
        label: '账单男17',
        values: [
          ['最近7天登端天数', 1323, -3423423, 323],
          ['自然月新登用户数', 1232, 3423423, -323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '男',
      'DIMENSION-age': 16,
      'COLUMNDIMENSION-scene': '花呗',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 2,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.002,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': -20,
      value: {
        label: '花呗男16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '男',
      'DIMENSION-age': 17,
      'COLUMNDIMENSION-scene': '花呗',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 2,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.002,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': -20,
      value: {
        label: '花呗男17',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '女',
      'DIMENSION-age': 16,
      'COLUMNDIMENSION-scene': '账单',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 1888883,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.0001,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': -50,
      value: {
        label: '账单女16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '女',
      'DIMENSION-age': 16,
      'COLUMNDIMENSION-scene': '花呗',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 1888883,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.0001,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': -50,
      value: {
        label: '花呗女16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '女',
      'DIMENSION-age': 16,
      'COLUMNDIMENSION-scene': '余额',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 1,
      value: {
        label: '余额女16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '女',
      'DIMENSION-age': 17,
      'COLUMNDIMENSION-scene': '花呗',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 1888883,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.0001,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': -50,
      value: {
        label: '花呗女16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '女',
      'DIMENSION-age': 17,
      'COLUMNDIMENSION-scene': '余额',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 1,
      value: {
        label: '余额女16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
  ],
} as S2DataConfig;

const tabularOptions = {
  width: 1000,
  height: 600,
  hierarchyType: 'grid',
  style: {
    cellCfg: {
      lineHeight: 30,
      width: 400,
      height: 300,
      minorMeasureRowIndex: 3,
      firstDerivedMeasureRowIndex: 2,
    },
  },
  mergedCellsInfo: [
    [
      { colIndex: 0, rowIndex: 0 },
      { colIndex: 0, rowIndex: 1, showText: true },
    ],
  ],
} as S2Options;

const getDataCfg = (sheetType: 'base' | 'tabular') => {
  switch (sheetType) {
    case 'tabular':
      return tabularDataCfg;
    case 'base':
    default:
      return baseDataCfg;
  }
};

const getOptions = (sheetType: 'base' | 'tabular') => {
  switch (sheetType) {
    case 'tabular':
      return tabularOptions;
    case 'base':
    default:
      return baseOptions;
  }
};

function MainLayout() {
  const [sheetType, setSheetType] = React.useState<'base' | 'tabular'>('base');
  const [options, setOptions] = React.useState<S2Options>(getOptions('base'));
  const [dataCfg, setDataCfg] = React.useState<S2DataConfig>(
    getDataCfg('base'),
  );

  const onRowCellClick = (value) => {
    console.log(value);
  };
  const onColCellClick = (value) => {
    console.log(value);
  };
  const onDataCellClick = (value) => {
    console.log(value);
  };

  let sheet;
  let mergedCellsInfo = [];

  const dataCellTooltip = (
    <div>
      <Button
        onClick={() => {
          mergeCells(sheet, mergedCellsInfo);
        }}
      >
        合并单元格
      </Button>
    </div>
  );

  const mgergedCellsTooltip = <div>合并后的tooltip</div>;

  const onDataCellMouseUp = (value) => {
    console.log(value);
    sheet = value?.viewMeta?.spreadsheet;
    const cells = sheet.interaction.getActiveCells();
    mergedCellsInfo = [];
    forEach(cells, (cell) => {
      mergedCellsInfo.push({
        colIndex: cell?.meta?.colIndex,
        rowIndex: cell?.meta?.rowIndex,
      });
    });
    sheet.tooltip.show({
      position: { x: value.event.clientX, y: value.event.clientY },
      element: dataCellTooltip,
    });
  };

  const onMergedCellsClick = (value) => {
    console.log(value);
    sheet = value?.target?.cells[0].spreadsheet;
    sheet.tooltip.show({
      position: { x: value.event.clientX, y: value.event.clientY },
      element: mgergedCellsTooltip,
    });
  };

  const onCheckChanged = (checked) => {
    const type = checked ? 'base' : 'tabular';
    setSheetType(type);
    setDataCfg(getDataCfg(type));
    setOptions(getOptions(type));
  };

  return (
    <div>
      <div style={{ display: 'inline-block' }}>
        <Switch
          checkedChildren="base"
          unCheckedChildren="tabular"
          defaultChecked={true}
          onChange={onCheckChanged}
          style={{ marginRight: 10 }}
        />
      </div>
      <SheetComponent
        sheetType={sheetType}
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        spreadsheet={getSpreadSheet}
        onDataCellMouseUp={onDataCellMouseUp}
        onRowCellClick={onRowCellClick}
        onColCellClick={onColCellClick}
        onDataCellClick={onDataCellClick}
        onMergedCellsClick={onMergedCellsClick}
      />
    </div>
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
