import type { SortParam } from '../common/interface';
import type { Node } from '../facet/layout/node';
import type { BaseDataSet } from './base-data-set';
// TODO add object data value
export type DataType = Record<string, any>;

export type PivotMetaValue = {
  // field level index
  level: number;
  children: PivotMeta;
  // field name
  childField?: string;
};

export type PivotMeta = Map<string, PivotMetaValue>;

export type SortedDimensionValues = Record<string, string[]>;

export type DataPathParams = {
  rowDimensionValues: string[];
  colDimensionValues: string[];
  // first create data path
  isFirstCreate?: boolean;
  // use for multiple data queries（path contains undefined）
  careUndefined?: boolean;
  // use in row tree mode to append fields information
  rowFields?: string[];
  colFields?: string[];
  rowPivotMeta?: PivotMeta;
  colPivotMeta?: PivotMeta;
};

export interface CellDataParams {
  // search query
  query: DataType;
  isTotals?: boolean;
  // use in part drill-down
  rowNode?: Node;
  // mark row's cell
  isRow?: boolean;
}

export interface SortActionParams {
  dataSet?: BaseDataSet;
  sortParam?: SortParam;
  originValues?: string[];
  measureValues?: string[] | DataType[];
  sortByValues?: string[];
  isSortByMeasure?: boolean;
}
