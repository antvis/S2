/* eslint-disable @typescript-eslint/ban-ts-comment */

import { type G2Spec } from '@antv/g2';
import type { DefaultCellTheme } from '@antv/s2';
import type { AxisCellType } from './constant';

export interface RowAxisHeader {}

export interface ColAxisHeader {}

export interface CornerAxisHeader {}

// @ts-ignore
declare module '@antv/s2' {
  interface S2PivotSheetOptions {
    chartSpec?: G2Spec;
  }

  interface S2Style {}

  type AxisCellThemes = {
    [K in AxisCellType]?: Pick<DefaultCellTheme, 'text' | 'cell'>;
  };

  interface S2Theme extends AxisCellThemes {}
}
