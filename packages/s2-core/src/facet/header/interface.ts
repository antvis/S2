import type { PointLike } from '@antv/g';
import type { LayoutResult, SortParam } from '../../common/interface';
import type { SpreadSheet } from '../../sheet-type';
import type { Node } from '../layout/node';

/**
 * Base header config interface
 */
export interface BaseHeaderConfig {
  // group's scroll x value
  scrollX?: number;
  // group's scroll y value
  scrollY?: number;
  // group's width
  width: number;
  // group's height
  height: number;
  // group's original width without clip
  originalWidth?: number;
  // group's original height without clip
  originalHeight?: number;
  // group's container's width
  viewportWidth: number;
  // group's container's height
  viewportHeight: number;
  // group's top-left point
  position: PointLike;
  // group's all nodes
  nodes: Node[];
  // spreadsheet entrance instance
  spreadsheet: SpreadSheet;
  // leaf node sort params
  sortParam?: SortParam;
  shallowRender?: boolean;
}

export interface ColHeaderConfig extends BaseHeaderConfig {
  // corner width used when scroll {@link ColHeader#onColScroll}
  cornerWidth?: number;
}

export interface CornerHeaderConfig extends BaseHeaderConfig {
  // series number width
  seriesNumberWidth: number;
}

export interface BaseCornerOptions {
  seriesNumberWidth: number;
  layoutResult: LayoutResult;
  spreadsheet: SpreadSheet;
}

export type RowHeaderConfig = BaseHeaderConfig;
