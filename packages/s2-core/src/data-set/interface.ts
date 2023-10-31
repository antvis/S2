import type { BaseFields, SortParam } from '../common/interface';
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
  shouldCreateOrUpdate?: boolean;
  // callback when pivot map create node
  onCreate?: (params: {
    // 维度 id，如 city
    dimension: string;
    // 维度数组 ['四川省', '成都市']
    dimensionPath: string[];
  }) => void;
  rowPivotMeta?: PivotMeta;
  colPivotMeta?: PivotMeta;
} & BaseFields;

export type DataPath = (number | string)[];

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
   * 行头节点, 用于下钻场景
   */
  rowNode?: Node;

  /**
   * 是否是行头
   */
  isRow?: boolean;
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
}

export interface SortActionParams {
  dataSet?: PivotDataSet;
  sortParam?: SortParam;
  originValues?: string[];
  measureValues?: string[] | CellData[];
  sortByValues?: string[];
  isSortByMeasure?: boolean;
}
