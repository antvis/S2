/* eslint-disable @typescript-eslint/ban-ts-comment */

import { type G2Spec } from '@antv/g2';
import type {
  CellCallback,
  ColHeaderConfig,
  CornerHeaderConfig,
  DefaultCellTheme,
  Hierarchy,
  RowHeaderConfig,
} from '@antv/s2';
import type { AxisColCell } from './cell/axis-col-cell';
import type { AxisCornerCell } from './cell/axis-cornor-cell';
import type { AxisRowCell } from './cell/axis-row-cell';
import type { AxisCellType } from './constant';

export type Coordinate = 'cartesian' | 'polar';

// @ts-ignore
declare module '@antv/s2' {
  interface LayoutResult {
    axisRowsHierarchy?: Hierarchy;
    axisColsHierarchy?: Hierarchy;
  }

  interface S2PivotSheetOptions {
    chartSpec?: G2Spec;
    axisRowCell?: CellCallback<RowHeaderConfig, AxisRowCell>;
    axisColCell?: CellCallback<ColHeaderConfig, AxisColCell>;
    axisCornerCell?: CellCallback<CornerHeaderConfig, AxisCornerCell>;
  }

  interface S2Style {}

  type AxisCellThemes = {
    [K in AxisCellType]?: Pick<DefaultCellTheme, 'text' | 'cell' | 'icon'>;
  };

  interface S2Theme extends AxisCellThemes {}

  interface ViewMeta {
    xField?: string;
    yField?: string;
  }
}
