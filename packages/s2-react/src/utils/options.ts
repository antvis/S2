import { S2Options } from '@antv/s2';
import { getBaseBaseSheetComponentOptions } from '@antv/s2-shared';
import React from 'react';
import { RENDER_TOOLTIP_OPTION } from '@/common';

export const getSheetComponentOptions = (
  ...options: Partial<S2Options<React.ReactNode>>[]
): S2Options =>
  getBaseBaseSheetComponentOptions(RENDER_TOOLTIP_OPTION, ...options);
