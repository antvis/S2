import { customMerge, isUpDataValue, S2DataConfig, S2Options } from '@antv/s2';
import type { SliderSingleProps } from 'antd';
import { isNil } from 'lodash';
import { getSheetComponentOptions } from '../src/utils';
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
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
    valueInCols: true,
  },
};

export const s2Options: S2Options = {
  debug: true,
  width: 600,
  height: 400,
  hierarchyCollapse: false,
  interaction: {
    enableCopy: true,
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
  width: 1000,
  height: 400,
  cornerText: '指标',
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
        widthPercentCfg: [40, 20, 20, 20],
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

export const defaultOptions: S2Options = customMerge(
  s2Options,
  getSheetComponentOptions({
    tooltip: {
      operation: {
        sort: true,
        tableSort: true,
        trend: true,
        hiddenColumns: true,
      },
    },
  }),
);
