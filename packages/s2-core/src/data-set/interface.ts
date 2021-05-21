// TODO add object data value
import BaseSpreadSheet from "../sheet-type/base-spread-sheet";

export type DataType = Record<string, any>;

export interface BaseDataSetParams {
  spreadsheet: BaseSpreadSheet;
}

export interface PivotDataSetParams extends BaseDataSetParams{
  valueInCols: boolean;
}

export type PivotMetaValue = {
  level: number;
  children: PivotMeta;
};

export type PivotMeta = Map<string, PivotMetaValue>;
