import type { QueryDataType } from '../common';
import type { SortParam } from '../common/interface';
import type { Node } from '../facet/layout/node';
import type { CellData } from './cell-data';
import type { PivotDataSet } from './pivot-data-set';

export type Query = Record<string, any>;

export type TotalSelection = {
  grandTotalOnly?: boolean;
  subTotalOnly?: boolean;
  totalDimensions?: boolean | string[];
};

export type TotalSelectionsOfMultiData = {
  row?: TotalSelection;
  column?: TotalSelection;
};

// TODO add object data value
export type DataType = Record<string, any>;


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
  shouldCreateOrUpdate?: boolean;
  // callback when pivot map create node
  onCreate?: (params: {
    // 维度 id，如 city
    dimension: string;
    // 完整维度信息：'四川省[&]成都市'
    dimensionPath: string;
  }) => void;
  prefix?: string;
};

export interface CellDataParams {
  // search query
  query: Query;
  isTotals?: boolean;

  /**
   * 行头节点, 用于下钻场景
   */
  rowNode?: Node;

  /**
   * 是否是行头
   */
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

export interface GetCellMultiDataParams {
  /**
   * 查询条件
   */
  query: Query;

  /**
   * 汇总
   */
  totals?: TotalSelectionsOfMultiData;

  /**
   * 下钻
   */
  drillDownFields?: string[];

  /**
   * 查询类型
   */
  queryType?: QueryDataType;
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

export interface MultiDataParams {
  drillDownFields?: string[];
  queryType?: QueryDataType;
}

export type FlattingIndexesData = DataType[][] | DataType[] | DataType;
