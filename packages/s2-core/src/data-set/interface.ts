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
  firstCreate?: boolean;
  // use in multi query data
  careUndefined?: boolean;
  // use in row tree mode to append extra info
  rowFields?: string[];
};
