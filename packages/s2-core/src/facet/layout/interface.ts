import type { CustomTreeNode } from '../../common/interface';
import type { PivotMeta } from '../../data-set/interface';
import type { SpreadSheet } from '../../sheet-type';
import type { Hierarchy } from '../layout/hierarchy';
import type { Node } from '../layout/node';
import type { TotalClass } from '../layout/total-class';
import type { TotalMeasure } from '../layout/total-measure';

export type FieldValue = string | TotalClass | TotalMeasure;

export interface BuildHeaderParams {
  isRowHeader: boolean;
  isTreeHierarchy?: boolean;
  spreadsheet: SpreadSheet;
}

export interface GridHeaderParams {
  spreadsheet: SpreadSheet;
  addTotalMeasureInTotal: boolean;
  addMeasureInTotalQuery: boolean;
  parentNode: Node;
  currentField: string;
  fields: string[];
  hierarchy: Hierarchy;
}

export interface BuildHeaderResult {
  // all leaf nodes
  leafNodes: Node[];
  // header's hierarchy
  hierarchy: Hierarchy;
}

export interface TotalParams {
  isFirstField: boolean;
  currentField: string;
  lastField: string;
  fieldValues: FieldValue[];
  spreadsheet: SpreadSheet;
}

export interface HeaderNodesParams {
  spreadsheet: SpreadSheet;
  currentField: string;
  fields: string[];
  fieldValues: FieldValue[];
  addTotalMeasureInTotal: boolean;
  addMeasureInTotalQuery: boolean;
  hierarchy: Hierarchy;
  parentNode: Node;
  level: number;
  query: Record<string, any>;
}

export interface TreeHeaderParams {
  spreadsheet: SpreadSheet;
  parentNode: Node;
  hierarchy: Hierarchy;
  currentField: string | undefined;
  level: number;
  pivotMeta: PivotMeta;
}

export interface TableHeaderParams {
  spreadsheet: SpreadSheet;
  parentNode: Node;
  hierarchy: Hierarchy;
}

export interface ViewCellHeights {
  getCellOffsetY: (index: number) => number;

  getTotalHeight: () => number;

  getTotalLength: () => number;

  getIndexRange: (
    minHeight: number,
    maxHeight: number,
  ) => {
    start: number;
    end: number;
  };
}

export interface CustomTreeHeaderParams {
  spreadsheet: SpreadSheet;
  parentNode: Node;
  level: number;
  hierarchy: Hierarchy;
  tree: CustomTreeNode[];
}
