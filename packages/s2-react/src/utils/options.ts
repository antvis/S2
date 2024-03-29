import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import { RENDER_TOOLTIP_OPTION } from '../common';
import type { SheetComponentOptions } from '../components';

export const getSheetComponentOptions = (
  ...options: Partial<SheetComponentOptions>[]
) =>
  getBaseSheetComponentOptions<SheetComponentOptions>(
    RENDER_TOOLTIP_OPTION,
    ...options,
  );
