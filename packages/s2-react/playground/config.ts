import { isUpDataValue } from '@antv/s2';
import type { S2DataConfig, S2Options, S2Theme } from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import type { SliderSingleProps } from 'antd';
import { isNil } from 'lodash';
import {
  data,
  totalData,
  meta,
  fields,
} from '../__tests__/data/mock-dataset.json';

const BASIC_BACKGROUND_COLOR = '#FFFFFF';
const INTERACTIVE_BACKGROUND_COLOR = '#E1EAFE';

export const strategyTheme: S2Theme = {
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
      padding: {
        left: 4,
        right: 4,
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
  fields,
};

export const s2Options: S2Options = {
  debug: true,
  width: 600,
  height: 400,
  interaction: {
    enableCopy: true,
  },
  tooltip: {
    operation: {
      trend: true,
    },
  },
  style: {
    cellCfg: {
      height: 50,
    },
    hierarchyCollapse: false,
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

export const strategyOptions: S2Options = {
  width: 800,
  height: 400,
  cornerText: '指标',
  placeholder: (v) => {
    const placeholder = v?.fieldValue ? '-' : '';
    return placeholder;
  },
  headerActionIcons: [
    {
      iconNames: ['Trend'],
      belongsCell: 'rowCell',
      defaultHide: true,
      action: () => {},
    },
  ],
  style: {
    cellCfg: {
      valuesCfg: {
        originalValueField: 'originalValues',
        conditions: {
          text: {
            field: 'number',
            mapping: (value, cellInfo) => {
              const { meta } = cellInfo;
              const isNormalValue = isNil(value);

              if (meta.fieldValue.values[0][0] === value || isNormalValue) {
                return {
                  fill: '#000',
                };
              }
              return {
                fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
              };
            },
          },
        },
      },
    },
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
        conditions: {
          text: {
            field: 'number',
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
        },
      },
    },
  },
};

export const defaultOptions: S2Options =
  getBaseSheetComponentOptions(s2Options);
