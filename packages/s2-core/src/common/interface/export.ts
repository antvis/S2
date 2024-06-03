import type { CellMeta, DataItem } from '..';
import { EXTRA_FIELD } from '..';
import type { SpreadSheet } from '../../sheet-type';

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
      formatHeader?: boolean;
      formatData?: boolean;
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
  async?: boolean;
}

export interface CopyAndExportUnifyConfig {
  separator: string;
  formatHeader: boolean;
  formatData: boolean;
  selectedCells: CellMeta[];
  transformers: Transformer;
  async: boolean;
}

export interface CopyAllDataParams {
  /**
   * 表格实例
   */
  sheetInstance: SpreadSheet;

  /**
   * 数据分割符
   * @example "\t"
   */
  split?: string;

  /**
   * 格式化配置
   * @example { formatHeader: true, formatData: true }
   */
  formatOptions?: FormatOptions;

  /**
   * 导出时支持自定义 (transformer) 数据导出格式化方法
   * @see https://s2.antv.antgroup.com/manual/advanced/interaction/copy
   */
  customTransformer?: (transformer: Transformer) => Partial<Transformer>;

  /**
   * 是否开启异步复制/导出
   */
  async?: boolean;
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
