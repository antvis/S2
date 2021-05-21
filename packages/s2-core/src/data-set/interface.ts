import { SpreadSheet } from "src/sheet-type";

// TODO add object data value
export type DataType = Record<string, any>;

export interface BaseDataSetParams {
  spreadsheet: SpreadSheet;
}

export interface PivotDataSetParams extends BaseDataSetParams{
  valueInCols: boolean;
}

export type PivotMetaValue = {
  level: number;
  children: PivotMeta;
};

export type PivotMeta = Map<string, PivotMetaValue>;
