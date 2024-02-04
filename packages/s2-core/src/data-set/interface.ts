import type { QueryDataType } from '../common';
import type { RawData, SortParam } from '../common/interface';
import type { Node } from '../facet/layout/node';
import type { CellData } from './cell-data';
import type { PivotDataSet } from './pivot-data-set';

export type Query = Record<string, any>;

export type PivotMetaValue = {
  // 当前维度结合父级维度生成的完整 id 信息
  id: string;
  // 当前维度结合父级维度生成的完整 dimensions 信息，主要是预防 field 数据本身出现 [&] 导致维度信息识别不正确
  dimensions: string[];
  // 当前维度
  value: string;
  level: number;
  children: PivotMeta;
  childField?: string;
};

export type PivotMeta = Map<string, PivotMetaValue>;

export type SortedDimensionValues = Record<string, string[]>;

export interface OnFirstCreateParams {
  careRepeated?: boolean;
  // 维度 id，如 city
  dimension: string;
  // 完整维度信息：'四川省[&]成都市'
  dimensionPath: string;
}

export type DataPath = (number | string | undefined)[];

export type DataPathParams = {
  rowDimensionValues: string[];
  colDimensionValues: string[];
  rowPivotMeta: PivotMeta;
  colPivotMeta: PivotMeta;
  rowFields: string[];
  colFields: string[];
  // first create data path
  isFirstCreate?: boolean;
  // callback when pivot map create node
  onFirstCreate?: (params: OnFirstCreateParams) => void;
  prefix?: string;
};

export interface GetCellDataParams {
  /**
   * 查询条件
   */
  query: Query;

  /**
   * 是否是汇总节点
   */
  isTotals?: boolean;

  /**
   * 行头节点，用于下钻场景
   */
  rowNode?: Node;

  /**
   * 是否是行头
   */
  isRow?: boolean;

  /**
   * 汇总信息
   */
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

export interface GetCellMultiDataParams {
  /**
   * 查询条件
   */
  query?: Query;

  /**
   * 查询类型
   */
  queryType?: QueryDataType;

  /**
   * 下钻
   */
  drillDownFields?: string[];
}

export interface SortActionParams {
  dataSet?: PivotDataSet;
  sortParam?: SortParam;
  originValues?: string[];
  measureValues?: string[] | CellData[];
  sortByValues?: string[];
  isSortByMeasure?: boolean;
}

export interface SortPivotMetaParams {
  pivotMeta: PivotMeta;
  dimensions: string[];
  sortedDimensionValues: string[];
  sortFieldId: string;
}

export type FlattingIndexesData = RawData[][] | RawData[] | RawData;
