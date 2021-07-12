// 这里存放 emit 事件 透出的信息

import { Node } from 'src/facet/layout/node';
import { Event } from '@antv/g-canvas';

export interface CellScrollPosition {
  scrollX: number;
  scrollY: number;
  thumbOffset?: number;
}

export type TargetLayoutNode = Node;

export interface ListSortParams {
  sortFieldId: string;
  sortMethod: string;
}

export type LayoutRow = [number, string, string];

export type LayoutCol = [number, string, string];

export interface TargetCellInfo {
  target: any;
  event: Event;
  viewMeta: Node;
}
