import { S2Options, DEFAULT_OPTIONS } from '@antv/s2';

export const REACT_DEFAULT_OPTIONS: Readonly<S2Options> = {
  ...DEFAULT_OPTIONS,
  tooltip: {
    showTooltip: true,
    autoAdjustBoundary: 'body',
    operation: {
      hiddenColumns: true,
      trend: false,
      sort: true,
    },
  },
  showDefaultHeaderActionIcon: true,
};
