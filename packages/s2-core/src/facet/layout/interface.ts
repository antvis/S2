import { TotalClass } from 'src/facet/layout/total-class';
import { TotalMeasure } from 'src/facet/layout/total-measure';
import { Node } from 'src/facet/layout/node';
import { SpreadSheetFacetCfg } from 'src/common/interface';
import { Hierarchy } from 'src/facet/layout/hierarchy';
import { SpreadSheet } from 'src/sheet-type';
import { PivotMeta, PivotMetaValue } from '@/data-set/interface';

export type FileValue = string | TotalClass | TotalMeasure;

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
  fieldValues: FileValue[];
  spreadsheet: SpreadSheet;
}

export interface HeaderNodesParams {
  currentField: string;
  fields: string[];
  fieldValues: FileValue[];
  addTotalMeasureInTotal: boolean;
  addMeasureInTotalQuery: boolean;
  facetCfg: SpreadSheetFacetCfg;
  hierarchy: Hierarchy;
  parentNode: Node;
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
  getCellHeight: (index: number) => number;

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
