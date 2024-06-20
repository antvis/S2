import type { S2DataConfig, S2Options } from '@antv/s2';

export const FIXED_DATA_CONFIG: Partial<S2DataConfig> = {
  fields: {
    customValueOrder: null,
  },
};

export const FIXED_OPTIONS: S2Options = {
  hierarchyType: 'grid',
  style: {
    colCell: {
      hideValue: false,
    },
  },
};

export enum AxisCellType {
  ROW_AXIS_CELL = 'rowAxisCell',
  COL_AXIS_CELL = 'colAxisCell',
  CORNER_AXIS_CELL = 'cornerAxisCell',
}
