import type { BaseDataSet } from '../../data-set';
import type { Hierarchy } from '../../facet/layout/hierarchy';
import type { Node } from '../../facet/layout/node';
import type { SpreadSheet } from '../../sheet-type';
import type { Fields, Meta, S2Style, ViewMeta } from './basic';
import type { S2BasicOptions, S2TableSheetOptions } from './s2Options';

export interface AdjustLeafNodesParams {
  leafNodes: Node[];
  hierarchy: Hierarchy;
}

export interface ScrollChangeParams {
  offset: number;
  updateThumbOffset: boolean;
}

export type GetCellMeta = (
  rowIndex?: number,
  colIndex?: number,
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

export interface SpreadSheetFacetCfg
  extends Fields,
    S2BasicOptions,
    S2TableSheetOptions,
    S2Style {
  // spreadsheet interface
  spreadsheet: SpreadSheet;
  // data set of spreadsheet
  dataSet: BaseDataSet;
  // field's meta info
  meta?: Meta[];
}
