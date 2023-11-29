import { isUpDataValue, type Columns, customMerge } from '@antv/s2';
import type { S2DataConfig, ThemeCfg } from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import type { SliderSingleProps } from 'antd';
import {
  data,
  totalData,
  meta,
  fields,
} from '../__tests__/data/mock-dataset.json';
import type { SheetComponentOptions } from '../src/components';

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

export const pivotSheetDataCfgForCompactMode = customMerge(pivotSheetDataCfg, {
  data: [
    ...pivotSheetDataCfg.data,
    {
      province: '浙江',
      city: '杭州',
      type: '笔',
      price: '11111111',
    },
    {
      province: '浙江',
      city: '杭州',
      type: '纸张',
      price: '2',
    },
    {
      province: '浙江',
      city: '舟山',
      type: '笔',
      price: '2',
    },
    {
      province: '浙江',
      city: '舟山',
      type: '纸张',
      price: '133.333',
    },
  ],
});

export const s2Options: SheetComponentOptions = {
  debug: true,
  width: 600,
  height: 400,
  showSeriesNumber: false,
  interaction: {
    enableCopy: true,
    copyWithHeader: true,
    copyWithFormat: true,
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
  headerActionIcons: [
    {
      iconNames: ['SortDown'],
      belongsCell: 'colCell',
      defaultHide: true,
    },
    {
      iconNames: ['SortDown'],
      belongsCell: 'rowCell',
      defaultHide: true,
    },
    {
      iconNames: ['SortDown'],
      belongsCell: 'cornerCell',
      defaultHide: true,
    },
  ],
  hierarchyType: 'grid',
  style: {
    colCfg: {
      hideMeasureColumn: false,
    },
    rowCfg: {
      width: 100,
    },
    cellCfg: {
      height: 50,
      width: 200,
    },
  },
};

export const s2ThemeConfig: ThemeCfg = {
  name: 'default',
  theme: {},
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

export const testDataCfg = {
  meta: [
    {
      field: '2d7feabd-76a2-4c11-8f24-79764af936b4',
      name: '一级维度',
    },
    {
      field: '30b4b32d-d69a-4772-b7f9-84cd54cf0cec',
      name: '二级维度',
    },
    {
      field: 'c5ce4e54-795a-42b3-9cc8-e8b685da44ee',
      name: '数值',
    },
  ],
  fields: {
    rows: [
      '2d7feabd-76a2-4c11-8f24-79764af936b4',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec',
    ],
    columns: [],
    values: ['c5ce4e54-795a-42b3-9cc8-e8b685da44ee'],
    valueInCols: true,
  },
  data: [
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '总计',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 1732771,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '维值-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '维值-2',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 172245,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '维值-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '维值-2',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 12222,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '维值-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '维值-3',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 11111,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '维值-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '维值-3',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 11111,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '维值-1',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 456,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-2',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 12,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-2',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 4444567,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-3',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 111233,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-3',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 785222,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-4',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 6455644,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-4',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 289898,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-5',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 2222,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-5',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 1111,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 125555,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '分享裂变',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 409090,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '分享裂变',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 111111,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-7',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 5555,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-7',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 67878,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-8',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 53445.464,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-8',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 456.464,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 123.416,
    },
  ],
};

export const mockGridAnalysisOptions: SheetComponentOptions = {
  width: 1600,
  height: 600,
  style: {
    layoutWidthType: 'colAdaptive',
    cellCfg: {
      width: 400,
      height: 100,
      valuesCfg: {
        widthPercent: [40, 0.2, 0.2, 0.2],
      },
    },
  },
  tooltip: { showTooltip: false },
  interaction: {
    selectedCellsSpotlight: true,
  },
  conditions: {
    text: [
      {
        mapping: (value, cellInfo) => {
          const { colIndex } = cellInfo;
          if (colIndex <= 1) {
            return {
              fill: '#000',
            };
          }
          return {
            fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
          };
        },
      },
    ],
  },
};

export const defaultOptions =
  getBaseSheetComponentOptions<SheetComponentOptions>(s2Options);
