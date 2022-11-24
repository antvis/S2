import type { S2DataConfig } from '@antv/s2';
import { isMobile, type Columns } from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import type { SliderSingleProps } from 'antd';
import type { SheetComponentOptions } from '../src/components';
import {
  data,
  fields,
  meta,
  totalData,
} from '../__tests__/data/mock-dataset.json';

export const tableSheetSingleColumns: Columns = [
  'province',
  'city',
  'type',
  'sub_type',
  'number',
];

export const tableSheetMultipleColumns: Columns = [
  {
    key: 'area',
    children: ['province', 'city'],
  },
  'type',
  {
    key: 'money',
    children: [{ key: 'price' }, 'number'],
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

export const s2Options: SheetComponentOptions = {
  debug: true,
  width: 600,
  height: 400,
  showSeriesNumber: false,
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
  },
  tooltip: {
    operation: {
      trend: true,
    },
  },
  conditions: {
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
  },
  hierarchyType: 'grid',
  style: {
    rowCfg: {
      width: isMobile() ? 60 : 200,
    },
    cellCfg: {
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
