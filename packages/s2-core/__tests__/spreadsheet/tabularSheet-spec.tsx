import { act } from 'react-dom/test-utils';
import { mergeCells } from '../../src/utils/interactions/merge-cells';
import 'antd/dist/antd.min.css';
import {
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { Button } from 'antd';
import { getContainer } from './helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import { forEach } from 'lodash';

const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const mockData = {
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

const options = {
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
} as S2Options;

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
  const curSelectedState = sheet.getCurrentState();
  const { cells } = curSelectedState;
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

const onRowCellClick = (value) => {
  console.log(value);
  sheet = value?.viewMeta?.spreadsheet;
  sheet.tooltip.show({
    position: { x: value.event.clientX, y: value.event.clientY },
    element: dataCellTooltip,
  });
};

const onColCellClick = (value) => {
  console.log(value);
  sheet = value?.viewMeta?.spreadsheet;
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

describe('spreadsheet tabular spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(
      <SheetComponent
        sheetType="tabular"
        dataCfg={mockData}
        adaptive={false}
        options={options}
        spreadsheet={getSpreadSheet}
        onDataCellMouseUp={onDataCellMouseUp}
        onRowCellClick={onRowCellClick}
        onColCellClick={onColCellClick}
        onMergedCellsClick={onMergedCellsClick}
      />,
      getContainer(),
    );
  });
});
