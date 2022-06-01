import { S2Options, SpreadSheet } from '@antv/s2';
import { CustomTooltip } from '../../components/tooltip/custom-tooltip';

export const RENDER_TOOLTIP_OPTION: Partial<S2Options> = {
  tooltip: {
    renderTooltip: (spreadsheet: SpreadSheet) => new CustomTooltip(spreadsheet),
  },
};
