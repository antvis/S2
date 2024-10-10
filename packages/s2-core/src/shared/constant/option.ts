import type { S2Options } from '../../common';

export const SHEET_COMPONENT_DEFAULT_OPTIONS: S2Options = {
  tooltip: {
    enable: true,
    autoAdjustBoundary: 'body',
    operation: {
      hiddenColumns: true,
      sort: true,
    },
  },
  showDefaultHeaderActionIcon: true,
} as const;
