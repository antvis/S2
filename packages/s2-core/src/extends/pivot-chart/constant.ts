import type { G2Spec } from '@antv/g2';
import type { S2DataConfig, S2Options } from '@antv/s2';
import { ChartDataCell } from './cell/chart-data-cell';
import type { Coordinate } from './interface';

export const FIXED_DATA_CONFIG: Partial<S2DataConfig> = {
  fields: {
    customValueOrder: null,
  },
};

export const DEFAULT_OPTIONS: S2Options = {
  dataCell: (viewMeta, spreadsheet) => new ChartDataCell(viewMeta, spreadsheet),
};

export const FIXED_OPTIONS: S2Options = {
  hierarchyType: 'grid',
  style: {
    colCell: {
      hideValue: false,
      // height: 60,
    },
  },
};

export const DEFAULT_G2_SPEC: G2Spec = {
  autoFit: true,
  animate: false,
};

export enum AxisCellType {
  ROW_AXIS_CELL = 'rowAxisCell',
  COL_AXIS_CELL = 'colAxisCell',
  CORNER_AXIS_CELL = 'cornerAxisCell',
}

export const SUPPORT_CHART: { [key in Coordinate]: string[] } = {
  cartesian: ['interval'],
  polar: [],
};

/**
 * row axis
 */
export const KEY_GROUP_ROW_AXIS_SCROLL = 'rowAxisScrollGroup';
export const KEY_GROUP_ROW_AXIS_FROZEN = 'rowAxisHeaderFrozenGroup';
export const KEY_GROUP_ROW_AXIS_HEADER_FROZEN_TRAILING =
  'rowAxisHeaderFrozenTrailingGroup';

/**
 * column axis
 */
export const KEY_GROUP_COL_AXIS_SCROLL = 'colAxisScrollGroup';
export const KEY_GROUP_COL_AXIS_FROZEN = 'colAxisFrozenGroup';
export const KEY_GROUP_COL_AXIS_FROZEN_TRAILING = 'colAxisFrozenTrailingGroup';
