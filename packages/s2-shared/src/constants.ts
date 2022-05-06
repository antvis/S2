import type { S2Options } from '@antv/s2';

export const SHEET_COMPONENT_DEFAULT_OPTIONS: Readonly<Partial<S2Options>> = {
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
} as const;

export const RESIZE_RENDER_DELAY = 200; // ms
