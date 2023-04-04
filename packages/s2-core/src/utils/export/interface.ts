import type { DataItem, CellMeta } from '../../common';

export type MatrixTransformer = (data: DataItem[][]) => CopyableItem;

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

// 使用 类 替代 函数，重构下面的代码

export interface CopyOrExportConfig {
  selectedCells?: CellMeta[];
  formatOptions?: FormatOptions;
  separator?: string;
}

export interface CopyAndExportUnifyConfig {
  separator: string;
  isFormatHeader: boolean;
  isFormatData: boolean;
  selectedCells: CellMeta[];
}
