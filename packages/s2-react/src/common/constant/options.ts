import { S2Options, DEFAULT_OPTIONS, SpreadSheet } from '@antv/s2';
import { CustomTooltip } from '../../components/tooltip/custom-tooltip';

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
    renderTooltip: (spreadsheet: SpreadSheet) => new CustomTooltip(spreadsheet),
  },
  showDefaultHeaderActionIcon: true,
};
