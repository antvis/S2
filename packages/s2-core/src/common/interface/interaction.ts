import type {
  BaseCell,
  BaseRowCell,
  ColCell,
  CornerCell,
  DataCell,
  MergedCell,
  RowCell,
  TableCornerCell,
  TableSeriesNumberCell
} from '../../cell';
import type { HeaderCell } from '../../cell/header-cell';
import type { SeriesNumberCell } from '../../cell/series-number-cell';
import type { SimpleBBox } from '../../engine';
import type { Node } from '../../facet/layout/node';
import type { RootInteraction } from '../../interaction';
import type { BaseEvent } from '../../interaction/base-event';
import type { SpreadSheet } from '../../sheet-type';
import type { Transformer } from '../../utils/export/interface';
import type {
  CellType,
  InteractionStateName,
  InterceptType,
  ScrollbarPositionType,
} from '../constant';
import type { ViewMeta } from './basic';
import type { ResizeInteractionOptions } from './resize';

export type S2CellType<T extends SimpleBBox = ViewMeta> =
  | DataCell
  | HeaderCell
  | ColCell
  | CornerCell
  | RowCell
  | SeriesNumberCell
  | BaseRowCell
  | MergedCell
  | TableCornerCell
  | TableSeriesNumberCell
  | BaseCell<T>;

export interface CellMeta {
  id: string;
  colIndex: number;
  rowIndex: number;
  type: CellType;
  rowQuery?: Record<string, any>;
  [key: string]: unknown;
}

export type OnUpdateCells = (
  root: RootInteraction,
  defaultOnUpdateCells: () => void,
) => void;

export interface InteractionStateInfo {
  /**
   * 交互状态名
   */
  stateName?: InteractionStateName;
  /**
   * 单元格元数据 (包含不在可视范围内的)
   */
  cells?: CellMeta[];
  /**
   * 交互状态发生改变的单元格实例
   */
  interactedCells?: S2CellType[];
  /**
   * 选中的单元格节点
   */
  nodes?: Node[];
  /**
   * 如果单元格为空, 是否强制更新 (适用于反选等场景)
   */
  force?: boolean;

  /**
   * 交互行为改变后，会被更新和重绘的单元格回调
   */
  onUpdateCells?: OnUpdateCells;
}

export interface SelectHeaderCellInfo {
  cell: S2CellType<ViewMeta>;
  isMultiSelection?: boolean;
}

export type InteractionConstructor = new (
  spreadsheet: SpreadSheet,
) => BaseEvent;

export interface CustomInteraction {
  key: string;
  interaction: InteractionConstructor;
}

export interface BrushPoint {
  rowIndex: number;
  colIndex: number;
  x: number;
  y: number;
  scrollX?: number;
  scrollY?: number;

  /** 用于标记 row cell 和 col cell 点的 x, y 坐标 */
  headerX?: number;
  headerY?: number;
}

export interface BrushRange {
  start: BrushPoint;
  end: BrushPoint;
  width: number;
  height: number;
}

export type StateShapeLayer = 'interactiveBgShape' | 'interactiveBorderShape';

export type Intercept = InterceptType[keyof InterceptType];

export interface BrushAutoScrollConfigItem {
  value: number;
  scroll: boolean;
}

export interface BrushAutoScrollConfig {
  x: BrushAutoScrollConfigItem;
  y: BrushAutoScrollConfigItem;
}

export interface ScrollSpeedRatio {
  horizontal?: number;
  vertical?: number;
}

export interface HoverFocusOptions {
  duration?: number;
}

export interface BrushSelection {
  dataCell?: boolean;
  rowCell?: boolean;
  colCell?: boolean;
}

export interface BrushSelectionInfo {
  dataCellBrushSelection: boolean;
  rowCellBrushSelection: boolean;
  colCellBrushSelection: boolean;
}

export interface InteractionOptions {
  /**
   * 链接跳转
   * @see https://s2.antv.antgroup.com/manual/advanced/interaction/link-jump
   */
  linkFields?: string[] | ((meta: Node | ViewMeta) => boolean);

  /**
   * 选中单元格高亮聚焦
   */
  selectedCellsSpotlight?: boolean;

  /**
   * 十字器高亮效果
   */
  hoverHighlight?: boolean;

  /**
   * 悬停聚焦, 800ms 后会显示其对应 tooltip, 可以自定义 duration
   */
  hoverFocus?: HoverFocusOptions | boolean;

  /**
   * 开启复制 Command/Ctrl + C
   */
  enableCopy?: boolean;

  /**
   * 复制带格式的数据
   */
  copyWithFormat?: boolean;

  /**
   * 复制包含其对应行列头的数据
   */
  copyWithHeader?: boolean;

  /**
   * 复制时支持自定义(transformer)数据导出格式化方法
   */
  customTransformer?: (transformer: Transformer) => Partial<Transformer>;
  /**
   * 自动重置表格样式 (按下 ESC 键, 点击空白区域时, 关闭 tooltip/交互状态)
   */
  autoResetSheetStyle?: boolean;

  /**
   * 隐藏列头配置, 支持维度 (S2DataConfig.fields) 和具体维值 (id)
   * @example hiddenColumnFields: ['type', 'subType'];
   * @example hiddenColumnFields: ['root[&]家具[&]桌子[&]number']
   */
  hiddenColumnFields?: string[];

  /**
   * 自定义滚动速率, 默认 1
   * @see https://s2.antv.antgroup.com/manual/advanced/interaction/scroll
   */
  scrollSpeedRatio?: ScrollSpeedRatio;

  /**
   * 宽高调整
   */
  resize?: ResizeInteractionOptions | boolean;

  /**
   * 刷选
   */
  brushSelection?: BrushSelection | boolean;

  /**
   * 多选 Command/Ctrl + click
   */
  multiSelection?: boolean;

  /**
   * 区间快捷多选 Shift + click
   */
  rangeSelection?: boolean;

  /**
   * 键盘方向键移动选中单元格
   */
  selectedCellMove?: boolean;

  /**
   * 滚动条位置 (可用于表格内容未撑满 Canvas 的场景)
   */
  scrollbarPosition?: ScrollbarPositionType;

  /**
   * 透传 listener 属性的可选参数对象
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
   */
  eventListenerOptions?: boolean | AddEventListenerOptions;

  /**
   * 选中单元格高亮联动 (高亮所对应行头/列头, 高亮当前行/当前列)
   */
  selectedCellHighlight?: boolean | InteractionCellSelectedHighlightOptions;

  /**
   * 滚动到边界的行为
   * @see https://s2.antv.antgroup.com/manual/advanced/interaction/scroll
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
   */
  overscrollBehavior?: 'auto' | 'none' | 'contain' | null;

  /**
   * 自定义交互
   * @see https://s2.antv.antgroup.com/manual/advanced/interaction/custom
   */
  customInteractions?: CustomInteraction[];
}

export interface InteractionCellSelectedHighlightOptions {
  /** 高亮行头 */
  rowHeader?: boolean;
  /** 高亮列头 */
  colHeader?: boolean;
  /** 高亮选中单元格所在行 */
  currentRow?: boolean;
  /** 高亮选中单元格所在列 */
  currentCol?: boolean;
}
