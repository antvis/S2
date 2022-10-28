import type { DataItem } from '../../common';

export type MatrixTransformer = (data: DataItem[][]) => CopyableItem;

export enum CopyMIMEType {
  PLAIN = 'text/plain',
  HTML = 'text/html',
}

export type CopyableItem = {
  type: CopyMIMEType;
  content: string;
};

export type Copyable = CopyableItem | CopyableItem[];
