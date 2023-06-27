import type { S2Options, SpreadSheet } from '@antv/s2';
import { CustomTooltip } from '../../components/tooltip/custom-tooltip';

export const RENDER_TOOLTIP_OPTION: Partial<S2Options> = {
  tooltip: {
    render: (spreadsheet: SpreadSheet) => new CustomTooltip(spreadsheet),
  },
};
