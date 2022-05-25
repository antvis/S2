import type { S2Options } from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import { RENDER_TOOLTIP_OPTION } from '../common/constant';

export const getSheetComponentOptions = (
  ...options: Partial<S2Options>[]
): S2Options => getBaseSheetComponentOptions(RENDER_TOOLTIP_OPTION, ...options);
