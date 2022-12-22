import {
  isMobile,
  ResizeType,
  type CustomHeaderField,
  type S2DataConfig,
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
import { EXTRA_FIELD } from './../../s2-core/src/common/constant/basic';

export const tableSheetSingleColumns: CustomHeaderField[] = [
  'province',
  'city',
  'type',
  'sub_type',
  'number',
];

export const tableSheetMultipleColumns: CustomHeaderField[] = [
  {
    field: 'area',
    children: [{ field: 'province' }, { field: 'city' }],
  },
  'type',
  {
    field: 'money',
    children: [{ field: 'price' }, { field: 'number' }],
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
    resize: {
      rowResizeType: ResizeType.ALL,
      colResizeType: ResizeType.ALL,
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
      width: isMobile() ? 60 : 160,
      height: 50,
    },
    colCfg: {
      widthByField: {
        [EXTRA_FIELD]: 80,
        'root[&]家具[&]沙发[&]number': 120,
      },
      heightByField: {
        [EXTRA_FIELD]: 60,
      },
    },
    cellCfg: {
      width: 100,
      height: isMobile() ? undefined : 40,
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
