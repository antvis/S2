// 这里存放 emit 事件 透出的信息

import type { Event as GEvent } from '@antv/g-canvas';
import type { Node } from '../../facet/layout/node';
import type { S2CellType } from './interaction';

export interface ListSortParams {
  sortFieldId: string;
  sortMethod: string;
}

export type LayoutRow = [number, string, string];

export type LayoutCol = [number, string, string];

export interface TargetCellInfo {
  target: S2CellType;
  event: GEvent;
  viewMeta: Node;
}
