import { isUpDataValue } from '@antv/s2';
import type { S2DataConfig, S2Options } from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import type { SliderSingleProps } from 'antd';
import {
  data,
  totalData,
  meta,
  fields,
} from '../__tests__/data/mock-dataset.json';

export const tableSheetDataCfg: S2DataConfig = {
  data,
  totalData,
  meta,
  fields: {
    columns: ['province', 'city', 'type', 'sub_type', 'number'],
  },
};

export const pivotSheetDataCfg: S2DataConfig = {
  data,
  totalData,
  meta,
  fields,
};

export const s2Options: S2Options = {
  debug: true,
  width: 600,
  height: 400,
  showSeriesNumber: false,
  interaction: {
    enableCopy: true,
    // 防止 mac 触摸板横向滚动触发浏览器返回, 和移动端下拉刷新
    overscrollBehavior: 'contain',
  },
  tooltip: {
    operation: {
      trend: true,
    },
  },
  hierarchyType: 'grid',
  style: {
    rowCfg: {
      width: 200,
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

export const mockGridAnalysisOptions: S2Options = {
  width: 1600,
  height: 600,
  style: {
    layoutWidthType: 'colAdaptive',
    cellCfg: {
      width: 400,
      height: 100,
      valuesCfg: {
        widthPercent: [40, 20, 20, 20],
      },
    },
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

export const defaultOptions: S2Options =
  getBaseSheetComponentOptions(s2Options);
