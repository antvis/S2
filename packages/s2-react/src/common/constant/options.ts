import { S2Options, SpreadSheet } from '@antv/s2';
import { CustomTooltip } from '@/components/tooltip/custom-tooltip';

export const SHEET_COMPONENT_DEFAULT_OPTIONS: Readonly<Partial<S2Options>> = {
  tooltip: {
    showTooltip: true,
    autoAdjustBoundary: 'body',
    operation: {
      hiddenColumns: true,
      trend: false,
      sort: true,
    },
    renderTooltip: (spreadsheet: SpreadSheet) => new CustomTooltip(spreadsheet),
  },
  showDefaultHeaderActionIcon: true,
} as const;
