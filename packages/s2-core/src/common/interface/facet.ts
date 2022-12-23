import type { Hierarchy } from '../../facet/layout/hierarchy';
import type { Node } from '../../facet/layout/node';
import type { SpreadSheet } from '../../sheet-type';
import type { ViewMeta } from './basic';

export interface AdjustLeafNodesParams {
  leafNodes: Node[];
  hierarchy: Hierarchy;
}

export interface ScrollChangeParams {
  offset: number;
  updateThumbOffset: boolean;
}

export type GetCellMeta = (
  rowIndex: number,
  colIndex: number,
) => ViewMeta | null;

export interface LayoutResult {
  colNodes: Node[];
  colsHierarchy: Hierarchy;
  rowNodes: Node[];
  rowsHierarchy: Hierarchy;
  rowLeafNodes: Node[];
  colLeafNodes: Node[];
  getCellMeta: GetCellMeta;
  spreadsheet: SpreadSheet;
}
