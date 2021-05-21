
// TODO add object data value
export type DataType = Record<string, any>;

export type PivotMetaValue = {
  level: number;
  children: PivotMeta;
};

export type PivotMeta = Map<string, PivotMetaValue>;
