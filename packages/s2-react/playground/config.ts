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
