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
import type { ChartDataCell } from './cell/chart-data-cell';
import type { AxisCellType } from './constant';

export type ChartCoordinate = 'cartesian' | 'polar';

// @ts-ignore
declare module '@antv/s2' {
  interface LayoutResult {
    axisRowsHierarchy?: Hierarchy;
    axisColsHierarchy?: Hierarchy;
  }

  interface S2PivotSheetOptions {
    chartCoordinate?: ChartCoordinate;
    chartSpec?: G2Spec | ((cell: ChartDataCell) => G2Spec);
    axisRowCell?: CellCallback<RowHeaderConfig, AxisRowCell>;
    axisColCell?: CellCallback<ColHeaderConfig, AxisColCell>;
    axisCornerCell?: CellCallback<CornerHeaderConfig, AxisCornerCell>;
  }

  interface S2Style {}

  type AxisCellThemes = {
    [K in AxisCellType]?: K extends AxisCellType.AXIS_CORNER_CELL
      ? Pick<DefaultCellTheme, 'cell' | 'text' | 'icon'>
      : Pick<DefaultCellTheme, 'cell'>;
  };

  interface S2Theme extends AxisCellThemes {}

  interface ViewMeta {
    xField?: string;
    yField?: string;
  }
}
