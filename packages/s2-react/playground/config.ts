import {
  CellTypes,
  ResizeType,
  type S2TableSheetFrozenOptions,
  type CustomHeaderField,
  type S2DataConfig,
  type CustomTreeNode,
} from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import type { SliderSingleProps } from 'antd';
import type { SheetComponentOptions } from '../src/components';
import {
  data,
  fields,
  meta,
  totalData,
} from '../__tests__/data/mock-dataset.json';

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
    title: '地区',
    children: [
      {
        field: 'province',
        title: '省份',
        children: [
          {
            field: 'type',
            title: '类型',
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

export const s2ConditionsOptions: SheetComponentOptions['conditions'] = {
  text: [],
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

export const s2Options: SheetComponentOptions = {
  debug: true,
  width: 800,
  height: 600,
  hierarchyType: 'grid',
  // showSeriesNumber: false,
  frozen: {
    rowHeader: true,
    // rowCount: 1,
    // trailingRowCount: 1,
    // colCount: 1,
    // trailingColCount: 1,
  },
  cornerText: '测试',
  interaction: {
    enableCopy: true,
    // 防止 mac 触摸板横向滚动触发浏览器返回, 和移动端下拉刷新
    overscrollBehavior: 'none',
    brushSelection: {
      data: true,
      col: true,
      row: true,
    },
    resize: {
      rowResizeType: ResizeType.CURRENT,
      colResizeType: ResizeType.CURRENT,
    },
  },
  tooltip: {
    operation: {
      hiddenColumns: true,
      menus: [
        {
          key: 'trend',
          text: '趋势',
          icon: 'Trend',
          visible: (cell) => cell.cellType === CellTypes.DATA_CELL,
          onClick: (cell) => {
            // eslint-disable-next-line no-console
            console.log('趋势图 icon 点击: ', cell);
          },
        },
      ],
    },
  },

  conditions: s2ConditionsOptions,
  style: {
    rowCell: {
      height: 50,
    },
    colCell: {
      hideValue: false,
    },
    dataCell: {
      height: 50,
    },
  },
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
