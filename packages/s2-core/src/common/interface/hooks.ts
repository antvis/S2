import { Node } from '@/facet/layout/node';
import { SpreadSheet } from '@/sheet-type';
import { GetCellMeta } from '@/common/interface/basic';

/**
 * determine the order of every row/column tree branch
 */
export type LayoutArrange = (
  spreadsheet: SpreadSheet,
  parent: Node,
  field: string,
  fieldValues: string[],
) => string[];

/**
 * determine what does row/column hierarchy look like
 * eg: add/delete some nodes in the specified position
 */
export type LayoutHierarchy = (
  spreadsheet: SpreadSheet,
  node: Node,
) => LayoutHierarchyReturnType;

export interface LayoutHierarchyReturnType {
  push?: Node[];
  unshift?: Node[];
  delete?: boolean;
}

/**
 * determine the location(x,y,width,height eg..) of every node
 */
export type LayoutCoordinate = (
  spreadsheet: SpreadSheet,
  rowNode: Node,
  colNode: Node,
) => void;

/**
 * determine the data of cells in Cartesian coordinates
 */
export type LayoutDataPosition = (
  spreadsheet: SpreadSheet,
  getCellData: GetCellMeta,
) => GetCellMeta;
