import type { FederatedPointerEvent as Event, Group } from '@antv/g';
import type { CellType } from '../../common/constant';
import type {
  CustomTreeNode,
  Data,
  IconPosition,
  RawData,
  ResizeInfo,
} from '../../common/interface';
import type { FrameConfig } from '../../common/interface/frame';
import type { Query } from '../../data-set';
import type { CellData } from '../../data-set/cell-data';
import type { BaseHeaderConfig, Frame } from '../../facet/header';
import type { Node } from '../../facet/layout/node';
import type { SpreadSheet } from '../../sheet-type';
import type { MergedCell } from '../../cell';
import type { S2CellType } from './interaction';
import type { DataItem } from './s2DataConfig';

export type { GetCellMeta, LayoutResult } from './facet';

/**
 * 第二个参数在以下情况会传入：
 * 1. data cell 格式化
 * 2. copy/export
 * 3. tooltip, 且仅在选择多个单元格时，data 类型为数组
 */
export type Formatter = (
  v: unknown,
  data?: ViewMetaData | ViewMetaData[],
  meta?: Node | ViewMeta,
) => string;

export interface FormatResult {
  formattedValue: string;
  value: DataItem;
}

export type SortMethod = 'ASC' | 'DESC' | 'asc' | 'desc';

export enum CellBorderPosition {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

/**
 * 类似 background-clip 属性: https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip
 * 分为三种类型：
 * borderBox: 整个 cell 的范围
 * paddingBox: cell 去除 border 的范围
 * contentBox: cell 去除 (border + padding) 的范围
 * -------------------------------
 * |b|           padding         |
 * |o|  |---------------------|  |
 * |r|  |                     |  |
 * |d|  |                     |  |
 * |e|  |---------------------|  |
 * |r|           padding         |
 * -------------------------------
 * -------border-bottom-----------
 * -------------------------------
 */
export enum CellClipBox {
  BORDER_BOX = 'borderBox',
  PADDING_BOX = 'paddingBox',
  CONTENT_BOX = 'contentBox',
}

/**
 * 布局类型：
 * adaptive: 行列等宽，均分整个 canvas 画布宽度
 * colAdaptive：列等宽，行头紧凑布局，列等分画布宽度减去行头宽度的剩余宽度
 * compact：行列紧凑布局，指标维度少的时候无法布满整个画布
 */
export type LayoutWidthType = 'adaptive' | 'colAdaptive' | 'compact';

export interface Meta {
  /**
   * 字段 id
   */
  field?: string;

  /**
   * 字段名称
   */
  name?: string;

  /**
   * 字段描述
   */
  description?: string;

  /**
   * 格式化
   * 数值字段：一般用于格式化数字单位
   * 文本字段：一般用于做字段枚举值的别名
   */
  formatter?: Formatter;
}

export type CustomHeaderField = CustomTreeNode | string;

export type CustomHeaderFields = CustomHeaderField[];

export interface BaseFields {
  /** 行头字段 */
  rows?: CustomHeaderFields;
  /** 列头字段 */
  columns?: CustomHeaderFields;
  /** 数值字段 */
  values?: string[];
  /** 数值是否置于列头 (透视表有效) */
  valueInCols?: boolean;
}

export interface Fields extends BaseFields {
  /**
   * 自定义指标维度在行列头中的层级顺序 （即 `values` 的 顺序，从 `0` 开始
   */
  customValueOrder?: number;
}

export interface TotalsStatus {
  isRowTotal: boolean;
  isRowSubTotal: boolean;
  isColTotal: boolean;
  isColSubTotal: boolean;
}

export enum Aggregation {
  SUM = 'SUM',
  MIN = 'MIN',
  MAX = 'MAX',
  AVG = 'AVG',
}

export interface CalcTotals {
  /** 聚合方式 */
  aggregation?: Aggregation;
  /** 自定义计算 */
  calcFunc?: (query: Query, arr: CellData[]) => number;
}

export interface Total {
  /** 是否显示总计 */
  showGrandTotals: boolean;

  /** 是否显示小计 */
  showSubTotals:
    | boolean
    | {
        /** 当子维度个数 <=1 时，仍然展示小计：默认 true */
        always: boolean;
      };
  /** 自定义总计 */
  calcTotals?: CalcTotals;
  /** 自定义小计 */
  calcSubTotals?: CalcTotals;

  /** 小计的汇总维度 */
  subTotalsDimensions: string[];

  /** 总计布局位置，默认是下或右 */
  reverseLayout: boolean;

  /** 小计布局位置，默认下或者右 */
  reverseSubLayout: boolean;

  /**
   * 自定义总计展示名
   * @default '总计'
   */
  label?: string;

  /**
   * 自定义小计展示名
   * @default '小计'
   */
  subLabel?: string;
}

export interface Totals {
  row?: Partial<Total>;
  col?: Partial<Total>;
}

export interface Sort {
  /** 字段id */
  sortFieldId: string;

  /** 排序方式 */
  sortMethod?: SortMethod;

  /** 自定义排序 */
  sortBy?: string[];

  /** 按照数值字段排序 */
  sortByMeasure?: string;

  /** 筛选条件，缩小排序范围 */
  query?: Record<string, any>;

  /** 组内排序用来显示icon */
  type?: string;
}

export interface SortFuncParam extends Sort {
  data: Array<string | Record<string, any>> | undefined;
}

export interface SortParam extends Sort {
  /** 自定义排序 */
  sortFunc?: (param: SortFuncParam) => Array<string | Record<string, any>>;
}

export interface FilterParam {
  filterKey: string;
  filteredValues?: unknown[];
  customFilter?: (row: Query) => boolean;
}

export type SortParams = SortParam[];

export interface Pagination {
  /** 每页数量 */
  pageSize: number;
  /** 当前页 (从 1 开始) */
  current: number;
  /** 数据总条数 */
  total?: number;
}

export interface CustomSVGIcon {
  /** icon 名称 */
  name: string;

  /**
   * 1、base 64
   * 2、svg本地文件（兼容老方式，可以改颜色）
   * 3、线上支持的图片地址
   */
  svg: string;
}

export interface HeaderIconClickParams {
  iconName: string;
  meta: Node;
  event?: Event;
}

export type HeaderActionIconProps = HeaderIconClickParams;

export interface HeaderIconHoverParams extends HeaderIconClickParams {
  hovering: boolean;
}

export interface HeaderActionIconOptions {
  iconName: string;
  x: number;
  y: number;
  onClick?: (headerIconClickParams: HeaderIconClickParams) => void;
  onHover?: (headerIconHoverParams: HeaderIconHoverParams) => void;
  isSortIcon?: boolean;
  defaultHide?: boolean;
}

export type FullyIconName = {
  name: string;
  position: IconPosition;
  fill?: string;
  isConditionIcon?: boolean;
};
export type ActionIconName = string | FullyIconName;

export interface HeaderActionIcon {
  /**
   * 已注册的 icon 类型或自定义的 icon 类型名
   * 如果是 string[], 则默认 icon 位置为右侧
   */
  icons: ActionIconName[];
  // 所属的 cell 类型
  belongsCell: Omit<CellType, 'dataCell'>;
  /** 是否默认隐藏， true 为 hover后显示, false 为一直显示 */
  defaultHide?: boolean | ((meta: Node, iconName: string) => boolean);
  /** 是否展示当前 iconNames 配置的 icon */
  displayCondition?: (mete: Node, iconName: string) => boolean;
  /** 点击回调函数 */
  onClick?: (headerIconClickParams: HeaderIconClickParams) => void;
  /** 悬停回调函数 */
  onHover?: (headerIconHoverParams: HeaderIconHoverParams) => void;
}

export interface InternalFullyHeaderActionIcon extends HeaderActionIcon {
  icons: FullyIconName[];
  isSortIcon?: boolean;
}

export type CellCallback<T extends BaseHeaderConfig> = (
  node: Node,
  spreadsheet: SpreadSheet,
  headerConfig: T,
) => S2CellType;

export type DataCellCallback = (viewMeta: ViewMeta) => S2CellType;

export type MergedCellCallback = (
  spreadsheet: SpreadSheet,
  cells: S2CellType[],
  meta?: ViewMeta,
) => MergedCell;

export type FrameCallback = (cfg: FrameConfig) => Frame;

export type CornerHeaderCallback = (
  parent: S2CellType,
  spreadsheet: SpreadSheet,
  ...restOptions: unknown[]
) => void;

export interface MergedCellInfo {
  colIndex?: number;
  rowIndex?: number;
  showText?: boolean;
}

export type TempMergedCell = {
  cells: S2CellType[];
  viewMeta: ViewMeta;
};

export type ViewMetaData = Data | CellData;

export interface ViewMeta {
  spreadsheet: SpreadSheet;
  // cell's unique id
  id: string;
  // cell's coordination-x
  x: number;
  // cell's coordination-y
  y: number;
  // cell's width
  width: number;
  // cell's height
  height: number;
  // cell origin data raws(multiple data)
  data: ViewMetaData;
  // cell' row index (in rowLeafNodes)
  rowIndex: number;
  // cell' col index (in colLeafNodes)
  colIndex: number;
  // value field(unique field id) for conditions setting
  valueField: string;
  // field's real display label value
  fieldValue: DataItem;
  // subTotals or grandTotals
  isTotals?: boolean;
  // cell's row query condition
  rowQuery?: Query;
  // cell's col query condition
  colQuery?: Query;
  // rowId of cell
  rowId?: string;
  colId?: string;
  field?: string;
  isFrozenCorner?: boolean;
  label?: string;
  value?: string | number;
  query?: Query;
  isLeaf?: boolean;

  [key: string]: unknown;
}

export type ViewMetaIndexType = keyof Pick<ViewMeta, 'colIndex' | 'rowIndex'>;

export interface OffsetConfig {
  rowHeaderOffsetX?: {
    value: number | undefined;
    animate?: boolean;
  };
  offsetX?: {
    value: number | undefined;
    animate?: boolean;
  };
  offsetY?: {
    value: number | undefined;
    animate?: boolean;
  };
}

export interface CellAppendInfo<T = Node> extends Partial<ResizeInfo> {
  isLinkFieldText?: boolean;
  cellData?: T;
}

export type S2MountContainer = string | Element;

export interface OriginalEvent extends Event {
  layerX: number;
  layerY: number;
}

// 用于和下钻组件进行交互联动
export interface PartDrillDownDataCache {
  // 执行下钻的行头id
  rowId: string;
  // 下钻的行头level
  drillLevel: number;
  drillField: string;
  // 下钻的数据
  drillData: RawData[];
}

export interface PartDrillDownFieldInLevel {
  // 下钻的维度
  drillField: string;
  // 下钻的层级
  drillLevel: number;
}

export interface TableSortParam extends SortParam {
  sortKey: string;
}

export interface GridInfo {
  cols: number[];
  rows: number[];
}

export type RenderHandler = (
  options: Record<string, unknown>,
  context: {
    group: Group;
  },
) => void;

export interface Point {
  x: number;
  y: number;
}

export type RowData = Data | CellData[];
