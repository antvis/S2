import type { Group } from '@antv/g';
import type { BBox } from '../../engine';
import type {
  InteractionOptions,
  InteractionStateInfo,
  S2CellType,
  SortMethod,
  SortParam,
  ViewMeta,
} from '../interface';
import type { Node } from '../../facet/layout/node';
import type { PartDrillDownFieldInLevel } from '../../common/interface';
import type { GuiIcon } from '../../common/icons';
import type { DataPath } from './../../data-set/interface';
import type { S2DataConfig } from './s2DataConfig';
import type { ValueRanges } from './condition';

export interface HiddenColumnsInfo {
  /**
   * 当前显示的兄弟节点之前所隐藏的节点
   */
  hideColumnNodes: Node[];

  /**
   * 当前隐藏列所对应展示展开按钮的兄弟节点
   */
  displaySiblingNode: {
    prev: Node | null;
    next: Node | null;
  };
}

export interface StoreKey {
  /**
   * 水平滚动偏移
   */
  scrollX: number;

  /**
   * 垂直滚动偏移
   */
  scrollY: number;

  /**
   * 行头水平滚动偏移
   */
  rowHeaderScrollX: number;

  /**
   * 列头点击排序配置
   */
  sortParam: SortParam;

  /**
   * 下钻节点id和对应生成的 path 寻址路径
   */
  drillDownIdPathMap: Map<string, DataPath[]>;

  /**
   * 当前下钻节点
   */
  drillDownNode: Node;

  /**
   * 下钻数据的个数控制
   */
  drillItemsNum: number;

  /**
   * 下钻节点层级信息
   */
  drillDownFieldInLevel: PartDrillDownFieldInLevel[];

  /**
   * 当前交互状态信息
   */
  interactionStateInfo: InteractionStateInfo;

  /**
   * 原始数据配置
   */
  originalDataCfg: Partial<S2DataConfig> | undefined | null;

  /**
   * 可视区域包裹盒模型
   */
  panelBBox: BBox;

  /**
   * 当前调整大小区域 group
   */
  activeResizeArea: Group;

  /**
   * 条件格式值区间
   */
  valueRanges: ValueRanges;

  /**
   * 初次渲染时的列头叶子节点
   */
  initColLeafNodes: Node[] | undefined;

  /**
   * 隐藏列详情
   *  | a, b, [c,d 隐藏] [icon e ] , [f 隐藏], [icon g]   |
   */
  hiddenColumnsDetail: HiddenColumnsInfo[];

  /**
   * 上一次渲染的列头
   */
  lastRenderedColumnFields: string[];

  /**
   * 是否手动调整过宽高
   */
  resized: boolean;

  /**
   * hover 显示的 icon 缓存
   */
  visibleActionIcons: GuiIcon[];

  /**
   * 上一次点击的单元格
   */
  lastClickedCell: S2CellType<ViewMeta> | null;

  /**
   * 初始化时的边界滚动配置
   */
  initOverscrollBehavior: InteractionOptions['overscrollBehavior'];

  /**
   * 排序方式
   */
  sortMethodMap: Record<string, SortMethod> | null;

  [key: string]: unknown;
}
