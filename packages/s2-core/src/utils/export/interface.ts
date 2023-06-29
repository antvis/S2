import type { SpreadSheet } from '../../sheet-type';
import type { DataItem, CellMeta } from '../../common';
import { EXTRA_FIELD } from '../../common';

export type MatrixPlainTransformer = (
  data: DataItem[][],
  separator?: string,
) => CopyablePlain;

export type MatrixHTMLTransformer = (data: DataItem[][]) => CopyableHTML;

export enum CopyMIMEType {
  PLAIN = 'text/plain',
  HTML = 'text/html',
}

export type CopyableItem = {
  type: CopyMIMEType;
  content: string;
};

export type CopyablePlain = {
  type: CopyMIMEType.PLAIN;
  content: string;
};

export type CopyableHTML = {
  type: CopyMIMEType.HTML;
  content: string;
};

export type CopyableList = [CopyablePlain, CopyableHTML];

export type Copyable = CopyableItem | CopyableItem[];

export type FormatOptions =
  | boolean
  | {
      isFormatHeader?: boolean;
      isFormatData?: boolean;
    };

export interface Transformer {
  [CopyMIMEType.PLAIN]: MatrixPlainTransformer;
  [CopyMIMEType.HTML]: MatrixHTMLTransformer;
}

export interface CopyOrExportConfig {
  selectedCells?: CellMeta[];
  formatOptions?: FormatOptions;
  separator?: string;
  customTransformer?: (transformer: Transformer) => Partial<Transformer>;
  isAsyncExport?: boolean;
}

export interface CopyAndExportUnifyConfig {
  separator: string;
  isFormatHeader: boolean;
  isFormatData: boolean;
  selectedCells: CellMeta[];
  transformers: Transformer;
  isAsyncExport: boolean;
}

export interface CopyAllDataParams {
  sheetInstance: SpreadSheet;
  split?: string;
  formatOptions?: FormatOptions;
  customTransformer?: (transformer: Transformer) => Partial<Transformer>;
  /** 是否开启异步导出 */
  isAsyncExport?: boolean;
}

export interface SheetCopyConstructorParams {
  spreadsheet: SpreadSheet;
  config: CopyOrExportConfig;
  isExport?: boolean;
}

export type MeasureQuery =
  | { [EXTRA_FIELD]: string | undefined }
  // eslint-disable-next-line @typescript-eslint/ban-types
  | {};
