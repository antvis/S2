import type { S2DataConfig, S2Options } from '@antv/s2';
import type { SliderSingleProps } from 'antd';
import React from 'react';
import { data, totalData, meta } from '../__tests__/data/mock-dataset.json';

const BASIC_BACKGROUND_COLOR = '#FFFFFF';
const INTERACTIVE_BACKGROUND_COLOR = '#E1EAFE';

export const defaultTheme = {
  cornerCell: {
    icon: {
      size: 12,
    },
  },
  rowCell: {
    cell: {
      backgroundColor: BASIC_BACKGROUND_COLOR,

      interactionState: {
        hover: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
        selected: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
      },
    },
    icon: {
      size: 12,
    },
  },
  colCell: {
    cell: {
      interactionState: {
        hover: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
        selected: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
      },
    },
  },
  dataCell: {
    cell: {
      crossBackgroundColor: BASIC_BACKGROUND_COLOR,
      interactionState: {
        hover: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
        hoverFocus: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
        selected: {
          backgroundColor: INTERACTIVE_BACKGROUND_COLOR,
        },
        unselected: {},
        prepareSelect: {
          borderColor: INTERACTIVE_BACKGROUND_COLOR,
        },
      },
    },
  },
};

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
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
    valueInCols: true,
  },
};

export const s2Options: S2Options<React.ReactNode> = {
  debug: true,
  width: 600,
  height: 600,
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
