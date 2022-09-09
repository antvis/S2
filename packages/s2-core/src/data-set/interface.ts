import type { BaseFields, SortParam } from '../common/interface';
import type { Node } from '../facet/layout/node';
import type { BaseDataSet } from './base-data-set';
// TODO add object data value
export type DataType = Record<string, any>;

export type Query = Record<string, any>;

export type TotalSelection = {
  totalOnly?: boolean;
  includeDimensions?: boolean | string[];
};

export type TotalSelectionsOfMultiData = {
  row?: TotalSelection;
  column?: TotalSelection;
};

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
  // callback when pivot map create node
  createIfNotExist?: boolean;
  onCreate?: (params: {
    // 维度 id，如 city
    dimension: string;
    // 维度数组 ['四川省', '成都市']
    dimensionPath: string[];
  }) => void;
  rowPivotMeta?: PivotMeta;
  colPivotMeta?: PivotMeta;
} & BaseFields;

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
