import type { QueryDataType } from '../common/constant/query';
import type { SortParam } from '../common/interface';
import type { Node } from '../facet/layout/node';
import type { BaseDataSet } from './base-data-set';
// TODO add object data value
export type DataType = Record<string, any>;

export type Query = Record<string, any>;

export type PivotMetaValue = {
  // 当前维度结合父级维度生成的完整 id 信息
  id: string;
  // 当前维度
  value: string;
  level: number;
  children: PivotMeta;
  childField?: string;
};

export type PivotMeta = Map<string, PivotMetaValue>;

export type SortedDimensionValues = Record<string, string[]>;

export type DataPathParams = {
  rowDimensionValues: string[];
  colDimensionValues: string[];
  rowPivotMeta: PivotMeta;
  colPivotMeta: PivotMeta;
  rowFields: string[];
  colFields: string[];
  valueFields?: string[];
  // first create data path
  isFirstCreate?: boolean;
  // callback when pivot map create node
  onFirstCreate?: (params: {
    careRepeated: boolean;
    // 维度 id，如 city
    dimension: string;
    // 完整维度信息：'四川省[&]成都市'
    dimensionPath: string;
  }) => void;
};

export interface CellDataParams {
  // search query
  query: Query;
  isTotals?: boolean;
  // use in part drill-down
  rowNode?: Node;
  // mark row's cell
  isRow?: boolean;
  // use with isTotals
  totalStatus?: TotalStatus;
}

export interface CheckAccordQueryParams {
  // item of sortedDimensionValues,es: "浙江省[&]杭州市[&]家具[&]桌子"
  dimensionValues: string;
  query: Query;
  // rows or columns
  dimensions: string[];
  field: string;
}

export interface TotalStatus {
  isRowTotal: boolean;
  isRowSubTotal: boolean;
  isColTotal: boolean;
  isColSubTotal: boolean;
}

export interface SortActionParams {
  dataSet?: BaseDataSet;
  sortParam?: SortParam;
  originValues?: string[];
  measureValues?: string[] | DataType[];
  sortByValues?: string[];
  isSortByMeasure?: boolean;
}

export interface SortPivotMetaParams {
  pivotMeta: PivotMeta;
  dimensions: string[];
  sortedDimensionValues: string[];
  sortFieldId: string;
}

export interface MultiDataParams {
  drillDownFields?: string[];
  queryType?: QueryDataType;
}

export type FlattingIndexesData = DataType[][] | DataType[] | DataType;
