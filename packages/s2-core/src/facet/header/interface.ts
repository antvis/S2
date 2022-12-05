import type { PointLike } from '@antv/g';
import type {
  LayoutResult,
  S2Options,
  SortParam,
  SpreadSheetFacetCfg,
} from '../../common/interface';
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
  data: Node[];
  // spreadsheet entrance instance
  spreadsheet: SpreadSheet;
  // leaf node sort params
  sortParam?: SortParam;
}

export interface ColHeaderConfig extends BaseHeaderConfig {
  // corner width used when scroll {@link ColHeader#onColScroll}
  cornerWidth?: number;
  scrollContainsRowHeader?: boolean;
}

export interface CornerHeaderConfig extends BaseHeaderConfig {
  // header's hierarchy type
  hierarchyType: S2Options['hierarchyType'];
  // the hierarchy collapse or not
  hierarchyCollapse: boolean;
  // rows fields
  rows: SpreadSheetFacetCfg['rows'];
  // column fields
  columns: SpreadSheetFacetCfg['columns'];
  // series number width
  seriesNumberWidth: number;
}

export interface BaseCornerOptions {
  seriesNumberWidth: number;
  facetCfg: SpreadSheetFacetCfg;
  layoutResult: LayoutResult;
  spreadsheet: SpreadSheet;
}

export interface RowHeaderConfig extends BaseHeaderConfig {
  // type of hierarchy
  hierarchyType: S2Options['hierarchyType'];
  // field ids that click to navigate
  linkFields: string[];
}
