import type { S2Options } from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import type React from 'react';
import { RENDER_TOOLTIP_OPTION } from '../common';
import type { SheetComponentsProps } from '../components';

export const getSheetComponentOptions = (
  ...options: Partial<S2Options<React.ReactNode>>[]
): SheetComponentsProps['options'] =>
  getBaseSheetComponentOptions(RENDER_TOOLTIP_OPTION, ...options);
