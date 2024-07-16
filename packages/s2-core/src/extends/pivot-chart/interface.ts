/* eslint-disable @typescript-eslint/ban-ts-comment */

import { type AxisComponent, type G2Spec } from '@antv/g2';
import type {
  CellCallback,
  ColHeaderConfig,
  CornerHeaderConfig,
  DefaultCellTheme,
  Hierarchy,
  RowHeaderConfig,
} from '@antv/s2';
import type { AxisColCell } from './cell/axis-col-cell';
import type { AxisCornerCell } from './cell/axis-corner-cell';
import type { AxisRowCell } from './cell/axis-row-cell';
import type { AxisCellType } from './cell/cell-type';
import type { PivotChartDataCell } from './cell/pivot-chart-data-cell';

export type ChartCoordinate = 'cartesian' | 'polar';

export interface Chart {
  /**
   * 当前图表的坐标系类型，chartSheet 通过该类型判断是否需要在行列头区域绘制坐标系
   * 独立配置是因为要从 spec 里面判断是笛卡尔坐标还是极坐标，场景非常多，覆盖完全很困难
   */
  coordinate?: ChartCoordinate;
  dataCellSpec?: G2Spec | ((cell: PivotChartDataCell) => G2Spec);
  axisRowCellSpec?: AxisComponent | ((cell: AxisRowCell) => AxisComponent);
  axisColCellSpec?: AxisComponent | ((cell: AxisColCell) => AxisComponent);
}

// @ts-ignore
declare module '@antv/s2' {
  interface LayoutResult {
    axisRowsHierarchy?: Hierarchy;
    axisColsHierarchy?: Hierarchy;
  }

  interface S2PivotSheetOptions {
    chart?: Chart;
    axisRowCell?: CellCallback<RowHeaderConfig, AxisRowCell>;
    axisColCell?: CellCallback<ColHeaderConfig, AxisColCell>;
    axisCornerCell?: CellCallback<CornerHeaderConfig, AxisCornerCell>;
  }

  type AxisCellThemes = {
    [K in AxisCellType]?: DefaultCellTheme;
  };

  interface S2Theme extends AxisCellThemes {}

  interface ViewMeta {
    xField?: string;
    yField?: string;
  }
}
