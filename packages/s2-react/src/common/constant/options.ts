import type { SpreadSheet } from '@antv/s2';
import type { SheetComponentOptions } from '../../components';
import { CustomTooltip } from '../../components/tooltip/custom-tooltip';

export const MOBILE_DRAWER_WIDTH = 300;

export const RENDER_TOOLTIP_OPTIONS: SheetComponentOptions = {
  tooltip: {
    render: (spreadsheet: SpreadSheet) => new CustomTooltip(spreadsheet),
  },
};
