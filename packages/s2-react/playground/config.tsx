/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
import { PlusCircleFilled } from '@ant-design/icons';
import {
  EMPTY_PLACEHOLDER,
  customMerge,
  getBaseSheetComponentOptions,
  type CustomHeaderField,
  type CustomTreeNode,
  type S2BaseFrozenOptions,
  type S2DataConfig,
  type ThemeCfg,
} from '@antv/s2';
import { PivotSheetMultiLineTextDataCfg } from '@antv/s2/__tests__/data/data-multi-line-text';
import { Menu, type SliderSingleProps } from 'antd';
import React from 'react';
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
  {
    field: 'money1',
    title: '金额1',
    children: [
      { field: 'price1', title: '价格1', description: '价格描述' },
      { field: 'number1', title: '数量1' },
    ],
  },
];

export const tableSheetDataCfg: S2DataConfig = {
  data,
  totalData,
  meta: [
    { field: 'number', name: '数值', formatter: (v) => `${v}-@` },
    ...meta,
  ],
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

export const pivotSheetDataCfgForCompactMode = customMerge<S2DataConfig>(
  pivotSheetDataCfg,
  {
    data: [
      ...pivotSheetDataCfg.data,
      {
        province: '浙江省',
        city: '杭州市',
        sub_type: '笔',
        type: '家具',
        number: 11111111,
      },
      {
        province: '浙江省',
        city: '杭州市',
        sub_type: '纸张',
        type: '办公用品',
        number: 2,
      },
      {
        province: '浙江省',
        city: '舟山市',
        sub_type: '笔',
        type: '办公用品',
        number: 2,
      },
      {
        province: '浙江省',
        city: '舟山市',
        sub_type: '纸张',
        type: '办公用品',
        number: 133.333,
      },
    ],
  },
);

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
        };
      },
    },
    {
      field: 'number',
      mapping() {
        return {
          icon: 'CellUp',
          fill: '#FF4D4F',
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

export const TableSheetFrozenOptions: S2BaseFrozenOptions = {
  colCount: 1,
  trailingColCount: 1,
};

export const PivotSheetFrozenOptions: S2BaseFrozenOptions = {
  rowCount: 1,
  trailingRowCount: 1,
};

export const S2TooltipOptions: SheetComponentOptions['tooltip'] = {
  operation: {
    menu: {
      // 声明菜单组件, 如: Ant Design <Menu/> API: https://ant-design.antgroup.com/components/menu-cn#api
      render: (props) => {
        return <Menu {...props} />;
      },
      onClick(info, cell) {
        console.log('菜单项点击: ', info, cell);
      },
      items: [
        {
          key: 'custom-a',
          label: '操作1',
          icon: 'Trend',
          onClick: (info, cell) => {
            console.log('操作1点击:', info, cell);
          },
          children: [
            {
              key: 'custom-a-a',
              label: '操作 1-1',
              icon: <PlusCircleFilled />,
              onClick: (info, cell) => {
                console.log('操作1-1点击:', info, cell);
              },
            },
          ],
        },
        {
          key: 'custom-b',
          label: '操作2',
          icon: 'EyeOutlined',
          onClick: (info, cell) => {
            console.log('操作2点击:', info, cell);
          },
        },
        {
          key: 'custom-c',
          label: '操作3',
          icon: 'EyeOutlined',
          visible: false,
          onClick: (info, cell) => {
            console.log('操作3点击:', info, cell);
          },
        },
        {
          key: 'custom-d',
          label: '操作4',
          icon: 'EyeOutlined',
          visible: (cell) => {
            // 叶子节点才显示
            const meta = cell.getMeta();

            return meta.isLeaf;
          },
          onClick: (info, cell) => {
            console.log('操作4点击:', info, cell);
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
  placeholder: {
    cell: EMPTY_PLACEHOLDER,
    empty: {
      icon: 'Empty',
      description: '暂无数据',
    },
  },
  seriesNumber: {
    enable: false,
  },
  transformCanvasConfig() {
    return {
      supportsCSSTransform: false,
      supportsPointerEvents: false,
      // dblClickSpeed: 500,
      // devicePixelRatio: 3,
      // cursor: 'crosshair',
    };
  },
  frozen: {
    rowHeader: true,
    // rowCount: 1,
    // trailingRowCount: 1,
    // colCount: 1,
    // trailingColCount: 1,
  },
  cornerText: '测试测试测试测试测试测试测试测试测试测试',
  interaction: {
    linkFields: [],
    copy: {
      enable: true,
      withFormat: true,
      withHeader: true,
    },
    hoverAfterScroll: true,
    hoverHighlight: true,
    selectedCellHighlight: false,
    selectedCellMove: true,
    rangeSelection: true,
    autoResetSheetStyle: (event) => {
      // 点击配置面板时不自动重置交互
      if (event?.target instanceof HTMLElement) {
        return !document
          .querySelector('.ant-collapse')
          ?.contains(event?.target);
      }

      return true;
    },
    // 防止 mac 触控板横向滚动触发浏览器返回, 和移动端下拉刷新
    overscrollBehavior: 'none',
    brushSelection: {
      dataCell: true,
      colCell: true,
      rowCell: true,
    },
    resize: {
      rowResizeType: 'current',
      colResizeType: 'current',
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

export const s2ThemeConfig: ThemeCfg = {
  name: 'default',
  theme: {},
};

export const defaultOptions =
  getBaseSheetComponentOptions<SheetComponentOptions>(s2Options);
