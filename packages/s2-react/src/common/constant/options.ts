import type { S2Options, SpreadSheet } from '@antv/s2';
import { CustomTooltip } from '../../components/tooltip/custom-tooltip';

export const MOBILE_DRAWER_WIDTH = 300;
export const RENDER_TOOLTIP_OPTION: Partial<S2Options> = {
  tooltip: {
    renderTooltip: (spreadsheet: SpreadSheet) => new CustomTooltip(spreadsheet),
  },
};
