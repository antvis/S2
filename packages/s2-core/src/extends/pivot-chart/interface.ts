/* eslint-disable @typescript-eslint/ban-ts-comment */

import { type G2Spec } from '@antv/g2';
import type {
  BaseHeaderConfig,
  CellCallback,
  DefaultCellTheme,
  Hierarchy,
  Node,
} from '@antv/s2';
import type { ColAxisCell } from './cell/col-axis-cell';
import type { RowAxisCell } from './cell/row-axis-cell';
import type { AxisCellType } from './constant';

export type Coordinate = 'cartesian' | 'polar';

export interface RowAxisHeaderConfig extends BaseHeaderConfig {}

export interface ColAxisHeaderConfig extends BaseHeaderConfig {}

// @ts-ignore
declare module '@antv/s2' {
  interface LayoutResult {
    rowAxisHierarchy?: Hierarchy;
    colAxisHierarchy?: Hierarchy;
    cornerAxisNodes?: Node[];
  }
  interface S2PivotSheetOptions {
    chartSpec?: G2Spec;
    rowAxisCell?: CellCallback<RowAxisHeaderConfig, RowAxisCell>;
    colAxisCell?: CellCallback<ColAxisHeaderConfig, ColAxisCell>;
  }

  interface S2Style {}

  type AxisCellThemes = {
    [K in AxisCellType]?: Pick<DefaultCellTheme, 'text' | 'cell'>;
  };

  interface S2Theme extends AxisCellThemes {}
}
