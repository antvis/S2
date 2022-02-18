import { BBox, Group } from '@antv/g-canvas';
import {
  InteractionStateInfo,
  S2CellType,
  SortParam,
  ViewMeta,
} from '../interface';
import { ValueRanges } from './condition';
import { S2DataConfig } from './s2DataConfig';
import { Node } from '@/facet/layout/node';
import { PartDrillDownFieldInLevel } from '@/common/interface';
import { GuiIcon } from '@/common/icons';

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

export interface HiddenColumnsInfo {
  // 当前显示的兄弟节点之前所隐藏的节点
  hideColumnNodes: Node[];
  // 当前隐藏列所对应展示展开按钮的兄弟节点
  displaySiblingNode: {
    prev: Node;
    next: Node;
  };
}

/**
 * All stored keys need type define here
 */
export interface StoreKey {
  // horizontal scroll bar scroll x offset
  scrollX: number;
  // vertical scroll bar scroll y offset
  scrollY: number;
  // row header scroll bar scroll x offset
  hRowScrollX: number;
  // column cell click sort params
  sortParam: SortParam;
  // 下钻节点id和对应生成的 path寻址路径
  drillDownIdPathMap: Map<string, number[][]>;
  // 当前下钻节点
  drillDownNode: Node;
  // 下钻数据的个数控制
  drillItemsNum: number;
  drillDownFieldInLevel: PartDrillDownFieldInLevel[];

  // interaction state
  interactionStateInfo: InteractionStateInfo;

  originalDataCfg: S2DataConfig;

  panelBBox: BBox;
  // resize area group
  activeResizeArea: Group;
  // interval condition
  valueRanges: ValueRanges;
  // 初次渲染时的列头叶子节点
  initColumnLeafNodes: Node[];
  /**
   * 隐藏列详情
   *  | a, b, [c,d 隐藏] [icon e ] , [f 隐藏], [icon g]   |
   */
  hiddenColumnsDetail: HiddenColumnsInfo[];
  // 上一次渲染的列头配置
  lastRenderedColumnFields: string[];
  // 是否手动调整过宽高
  resized: boolean;

  // hover 显示的 icon 缓存
  visibleActionIcons: GuiIcon[];

  // last click cell
  lastClickedCell: S2CellType<ViewMeta>;

  [key: string]: unknown;
}
