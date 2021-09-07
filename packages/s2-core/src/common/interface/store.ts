import { BBox, Group } from '@antv/g-canvas';
import { SortMethodType } from '../constant';
import { InteractionStateInfo, SortParam } from '../interface';
import { ValueRanges } from './condition';
import { S2DataConfig } from './s2DataConfig';
import { Node } from '@/facet/layout/node';
import { PartDrillDownInfo } from '@/components/sheets/interface';

export interface Selected {
  type:
    | 'cell'
    | 'row'
    | 'brush'
    | 'col'
    | 'column'
    | 'row&col'
    | 'column-multiple';
  // [ 10, 5 ], [ [ 2, 5 ], [ 4, 8 ] ];
  indexes: [number | number[], number | number[]];
}

export interface ReachedBorderId {
  rowId?: string;
  colId?: string;
}

/**
 * All stored keys need type define here
 */
export interface StoreKey {
  // horizontal scroll bar scroll x offset
  scrollX: number;
  // horizontal scroll bar scroll y offset
  scrollY: number;
  // row header scroll bar scroll x offset
  hRowScrollX: number;
  // column cell click sort params
  sortParam: SortParam;
  // corner text expand info
  cornerExpand: Record<string, number>;
  // list-sheet's field sort type(up or down)
  currentSortKey: Record<string, SortMethodType>;
  // last reached border node id
  lastReachedBorderId: ReachedBorderId;
  // 行。列选中单元的id
  rowColSelectedId: string[];
  // 下钻节点id和对应生成的 path寻址路径
  drillDownIdPathMap: Map<string, number[][]>;
  // 当前下钻节点
  drillDownNode: Node;
  // 下钻数据的个数控制
  drillItemsNum: number;
  // interaction state
  interactionStateInfo: InteractionStateInfo;
  drillDownFieldInLevel: PartDrillDownInfo[];
  originalDataCfg: S2DataConfig;
  drillDownMeta: any;
  panelBBox: BBox;
  // resize area group
  activeResizeArea: Group;
  // interval condition
  valueRanges: ValueRanges;

  [key: string]: unknown;
}
