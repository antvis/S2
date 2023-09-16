import type {
  CustomTreeItem,
  SpreadSheetFacetCfg,
} from '../../common/interface';
import type { PivotMeta } from '../../data-set/interface';
import type { SpreadSheet } from '../../sheet-type';
import type { Hierarchy } from '../layout/hierarchy';
import type { Node } from '../layout/node';
import type { TotalClass } from '../layout/total-class';
import type { TotalMeasure } from '../layout/total-measure';

export type FieldValue = string | TotalClass | TotalMeasure;

export interface BuildHeaderParams {
  isRowHeader: boolean;
  facetCfg: SpreadSheetFacetCfg;
  isTreeHierarchy?: boolean;
}

export interface GridHeaderParams {
  addTotalMeasureInTotal: boolean;
  addMeasureInTotalQuery: boolean;
  parentNode: Node;
  currentField: string;
  fields: string[];
  facetCfg: SpreadSheetFacetCfg;
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

export interface HeaderNodesParams extends GridHeaderParams {
  fieldValues: FieldValue[];
  level: number;
  query: Record<string, any>;
}

export interface TreeHeaderParams {
  parentNode: Node;
  facetCfg: SpreadSheetFacetCfg;
  hierarchy: Hierarchy;
  currentField: string;
  level: number;
  pivotMeta: PivotMeta;
}

export interface TableHeaderParams {
  parentNode: Node;
  facetCfg: SpreadSheetFacetCfg;
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
  facetCfg: SpreadSheetFacetCfg;
  parentNode: Node;
  level: number;
  hierarchy: Hierarchy;
  customTreeItems: CustomTreeItem[];
}

export interface WhetherLeafParams {
  facetCfg: SpreadSheetFacetCfg;
  fields: string[];
  level: number;
}
