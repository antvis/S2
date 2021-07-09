import { Node } from '@/facet/layout/node';
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

export type DataPathParams = {
  rowDimensionValues: string[];
  colDimensionValues: string[];
  // first create data path
  isFirstCreate?: boolean;
  // use for multiple data queries
  careUndefined?: boolean;
  // use in row tree mode to append fields information
  rowFields?: string[];
  colFields?: string[];
};


export interface CellDataParams {
  query: DataType;
  isTotals?: boolean;
  rowNode?: Node;
}
