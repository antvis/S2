import { S2Options, DEFAULT_OPTIONS } from '@antv/s2';
import { getTooltipComponent } from './tooltip';

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
    getTooltipComponent,
  },
  showDefaultHeaderActionIcon: true,
};
