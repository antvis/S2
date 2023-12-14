/* eslint-disable no-console */
import { GithubOutlined } from '@ant-design/icons';
import {
  CellType,
  ResizeType,
  type CustomHeaderField,
  type CustomTreeNode,
  type S2DataConfig,
  type S2TableSheetFrozenOptions,
} from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import type { SliderSingleProps } from 'antd';
import React from 'react';
import { PivotSheetMultiLineTextDataCfg } from '@antv/s2/__tests__/data/data-multi-line-text';
import {
  data,
  fields,
  meta,
  totalData,
} from '../__tests__/data/mock-dataset.json';
import type { SheetComponentOptions } from '../src/components';

export const tableSheetSingleColumns: CustomHeaderField[] = [
  'province',
  'city',
  'type',
  'sub_type',
  'number',
];

export const tableSheetMultipleColumns: CustomTreeNode[] = [
  {
    field: 'area',
    title: '地区地区地区地区地区地区地区地区地区',
    children: [
      {
        field: 'province',
        title: '省份省份省份省份省份省份省份省份省份',
        children: [
          {
            field: 'type',
            title: '类型类型类型类型类型类型类型类型类型类型',
          },
        ],
      },
      { field: 'city', title: '城市' },
    ],
  },
  {
    field: 'money',
    title: '金额',
    children: [
      { field: 'price', title: '价格', description: '价格描述' },
      { field: 'number', title: '数量' },
    ],
  },
];

export const tableSheetDataCfg: S2DataConfig = {
  data,
  totalData,
  meta,
  fields: {
    columns: tableSheetSingleColumns,
  },
};

export const pivotSheetDataCfg: S2DataConfig = {
  data,
  totalData,
  meta,
  fields,
};

export const pivotSheetMultiLineTextDataCfg = PivotSheetMultiLineTextDataCfg;

export const s2ConditionsOptions: SheetComponentOptions['conditions'] = {
  text: [
    {
      field: 'province',
      mapping(value) {
        if (value === '浙江省') {
          return {
            fontSize: 30,
            fill: 'pink',
            textAlign: 'center',
            fontWeight: 'bold',
          };
        }
      },
    },
    {
      field: 'city',
      mapping(value) {
        if (value === '成都市') {
          return {
            fontSize: 20,
            fill: 'red',
            textAlign: 'right',
            fontWeight: 'bold',
          };
        }
      },
    },
    {
      field: 'type',
      mapping() {
        return {
          fontSize: 20,
          fill: 'red',
          textAlign: 'right',
        };
      },
    },
    {
      field: 'sub_type',
      mapping() {
        return {
          fontSize: 12,
          opacity: 0.6,
          fill: 'yellow',
          textAlign: 'left',
        };
      },
    },
    {
      field: 'number',
      mapping(value) {
        if (+value <= 3000) {
          return {
            fill: '#065',
            fontWeight: 800,
            fontSize: 20,
          };
        }

        if (+value > 3000) {
          return {
            fill: '#000',
            opacity: 0.4,
          };
        }

        return {
          fontSize: 30,
          fill: '#000',
          textAlign: 'left',
        };
      },
    },
  ],
  icon: [
    {
      field: 'type',
      position: 'left',
      mapping() {
        return {
          icon: 'CellUp',
          fill: '#054',
          size: 26,
        };
      },
    },
    {
      field: 'city',
      position: 'left',
      mapping(value) {
        if (value === '成都市') {
          return {
            icon: 'CellUp',
            fill: '#FF4D4F',
            size: 16,
          };
        }
      },
    },
    {
      field: 'province',
      position: 'left',
      mapping() {
        return {
          icon: 'CellUp',
          fill: '#FF4D4F',
          size: 16,
        };
      },
    },
    {
      field: 'number',
      mapping() {
        return {
          icon: 'CellUp',
          fill: '#FF4D4F',
          size: 16,
        };
      },
    },
  ],
  interval: [
    {
      field: 'number',
      mapping() {
        return {
          fill: '#80BFFF',
          // 自定义柱状图范围
          isCompare: true,
          maxValue: 8000,
          minValue: 300,
        };
      },
    },
  ],
};

export const TableSheetFrozenOptions: S2TableSheetFrozenOptions = {
  colCount: 1,
  trailingColCount: 1,
};

export const S2TooltipOptions: SheetComponentOptions['tooltip'] = {
  enable: true,
  operation: {
    hiddenColumns: true,
    menu: {
      mode: 'horizontal',
      onClick(info, cell) {
        console.log('菜单点击: ', info, cell);
      },
      items: [
        {
          key: 'a-1',
          label: '操作-1',
          icon: 'Plus',
          onClick: (info, cell) => {
            console.log('操作-1', info, cell);
          },
          children: [
            {
              key: 'a-1-1',
              label: '操作-1-1',
              icon: 'Minus',
              visible: (cell) => cell.cellType === CellType.COL_CELL,
              onClick: (info, cell) => {
                console.log('操作-1-1', info, cell);
              },
            },
          ],
        },
        {
          key: 'a-2',
          label: '操作-2',
          icon: <GithubOutlined />,
          onClick: (info, cell) => {
            console.log('操作-2', info, cell);
          },
        },
        {
          key: 'trend',
          label: '趋势',
          icon: 'Trend',
          visible: (cell) => cell.cellType === CellType.DATA_CELL,
          onClick: (info, cell) => {
            console.log('趋势图 icon 点击: ', info, cell);
          },
        },
      ],
    },
  },
};

export const s2Options: SheetComponentOptions = {
  debug: true,
  width: 800,
  height: 600,
  hierarchyType: 'grid',
  transformCanvasConfig() {
    return {
      supportsCSSTransform: true,
      // devicePixelRatio: 3,
      // cursor: 'crosshair',
    };
  },
  // showSeriesNumber: false,
  frozen: {
    rowHeader: true,
    // rowCount: 1,
    // trailingRowCount: 1,
    // colCount: 1,
    // trailingColCount: 1,
  },
  cornerText: '测试测试测试测试测试测试测试测试测试测试',
  interaction: {
    enableCopy: true,
    copyWithFormat: true,
    // 防止 mac 触摸板横向滚动触发浏览器返回, 和移动端下拉刷新
    overscrollBehavior: 'none',
    brushSelection: {
      dataCell: true,
      colCell: true,
      rowCell: true,
    },
    resize: {
      rowResizeType: ResizeType.CURRENT,
      colResizeType: ResizeType.CURRENT,
    },
  },
  // totals: {
  //   col: {
  //     showGrandTotals: true,
  //     showSubTotals: false,
  //     reverseGrandTotalsLayout: true,
  //     reverseSubTotalsLayout: true,
  //     subTotalsDimensions: ['type'],
  //   },
  //   row: {
  //     showGrandTotals: true,
  //     showSubTotals: true,
  //     reverseGrandTotalsLayout: true,
  //     reverseSubTotalsLayout: true,
  //     subTotalsDimensions: ['province'],
  //   },
  // },
  // mergedCellsInfo: [
  //   [
  //     { colIndex: 1, rowIndex: 1, showText: true },
  //     { colIndex: 1, rowIndex: 2 },
  //   ],
  //   [
  //     { colIndex: 2, rowIndex: 1 },
  //     { colIndex: 2, rowIndex: 2, showText: true },
  //   ],
  // ],
  tooltip: S2TooltipOptions,
  style: {},
};

export const sliderOptions: SliderSingleProps = {
  min: 0,
  max: 10,
  step: 0.1,
  marks: {
    0.2: '0.2',
    1: '1 (默认)',
    2: '2',
    10: '10',
  },
};

export const defaultOptions =
  getBaseSheetComponentOptions<SheetComponentOptions>(s2Options);
