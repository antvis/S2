import { Event, ShapeAttrs } from '@antv/g-canvas';
import { S2CellType } from './interaction';
import { DataItem, S2DataConfig } from './s2DataConfig';
import { BaseHeaderConfig } from '@/facet/header/base';
import {
  Condition,
  CustomTreeItem,
  Data,
  ResizeInfo,
} from '@/common/interface';
import { S2BasicOptions } from '@/common/interface/s2Options';
import { BaseDataSet, DataType } from '@/data-set';
import { Frame } from '@/facet/header';
import { CellTypes } from '@/common/constant';
import { FrameConfig } from '@/common/interface/frame';
import { Hierarchy } from '@/facet/layout/hierarchy';
import { Node } from '@/facet/layout/node';
import { SpreadSheet } from '@/sheet-type';
import { S2Options, S2TableSheetOptions } from '@/common/interface/s2Options';

// 第二个参数在以下情况会传入：
// 1. data cell 格式化
// 2. copy/export
// 3. tooltip, 且仅在选择多个单元格时，data 类型为数组
export type Formatter = (v: unknown, data?: Data | Data[]) => string;

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
 * 布局类型：
 * adaptive: 行列等宽，均分整个 canvas 画布宽度
 * colAdaptive：列等宽，行头紧凑布局，列等分画布宽度减去行头宽度的剩余宽度
 * compact：行列紧凑布局，指标维度少的时候无法布满整个画布
 */
export type LayoutWidthType = 'adaptive' | 'colAdaptive' | 'compact';

export interface Meta {
  readonly field?: string; // 字段 id
  readonly name?: string; // 字段名称
  readonly description?: string; // 字段描述
  // 格式化
  // 数值字段：一般用于格式化数字单位
  // 文本字段：一般用于做字段枚举值的别名
  readonly formatter?: Formatter;
}

/**
 * Strategy mode's value type
 * data's key size must be equals fields.length
 * value can be empty
 * FieldC(Last fields is real value field)
 * example:
 * {
 *   fields: [fieldA, fieldB, fieldC],
 *   data: [
 *   {
 *     fieldA: 'valueA',
 *     fieldB: 'valueB',
 *     fieldC: 'valueC',
 *   }
 *   {
 *     fieldA: 'valueA',
 *     fieldB: '',
 *     fieldC: 'valueC',
 *   }
 *   ]
 * }
 */
export interface Extra {
  key: string;
  collapse: boolean;
  remark: string;
}

export interface Fields {
  // row fields
  rows?: string[];
  // custom tree data(only use in row header in pivot mode)
  customTreeItems?: CustomTreeItem[];
  // columns fields
  columns?: string[];
  // value fields
  values?: string[];
  // measure values in cols as new col, only works for PivotSheet
  valueInCols?: boolean;
  // the order of the measure values in rows or cols, only works for PivotSheet
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
  aggregation?: Aggregation; // 聚合方式
  calcFunc?: (query: DataType, arr: DataType[]) => number;
}

export interface Total {
  /** 是否显示总计 */
  showGrandTotals: boolean;
  /** 是否显示小计 */
  showSubTotals: boolean;
  // 前端计算总计
  calcTotals?: CalcTotals;
  // 前端计算小计
  calcSubTotals?: CalcTotals;
  /** 小计的汇总维度 */
  subTotalsDimensions: string[];
  /** 总计布局位置，默认是下或右 */
  reverseLayout: boolean;
  /** 小计布局位置，默认下或者右 */
  reverseSubLayout: boolean;
  // total's display name default = '总计'
  label?: string;
  // sub label's display name, default = '小计'
  subLabel?: string;
}

/**
 * tableau的英文是这个，这里有个绕的概念
 * 如，某行维度需要展示小计，实际上是将对应的一列数据进行聚合，所以文案上显示的应该是“展示列小计”
 * 但是内部配置我倾向于仍然按照字段所属维度区，即配置的row，代表的是行维度而不是行小计
 */
export interface Totals {
  readonly row?: Partial<Readonly<Total>>;
  readonly col?: Partial<Readonly<Total>>;
}

export interface Sort {
  /** 字段id，业务中一般是displayId */
  sortFieldId: string;
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
  data: Array<string | Record<string, any>>;
}

export interface SortParam extends Sort {
  /** 自定义func */
  sortFunc?: (v: SortFuncParam) => Array<string | Record<string, any>>;
}

export interface FilterParam {
  filterKey: string;
  filteredValues?: unknown[];
  customFilter?: (row: DataType) => boolean;
}

export type SortParams = SortParam[];

export interface Style {
  readonly layoutWidthType?: LayoutWidthType;
  // row cell's height in tree mode
  readonly treeRowsWidth?: number;
  // row header in tree mode collapse some nodes
  readonly collapsedRows?: Record<string, boolean>;
  // col header collapse nodes
  readonly collapsedCols?: Record<string, boolean>;
  readonly cellCfg?: CellCfg;
  readonly colCfg?: ColCfg;
  readonly rowCfg?: RowCfg;
  readonly device?: 'pc' | 'mobile'; // 设备，pc || mobile
}

export type Pagination = {
  // 每页数量
  pageSize: number;
  // 当前页
  current: number; // 从 1 开始
  // 数据总条数
  total?: number;
};

export interface CustomSVGIcon {
  // icon 类型名
  name: string;
  // 1、base 64
  // 2、svg本地文件（兼容老方式，可以改颜色）
  // 3、线上支持的图片地址 TODO  🤔 是否存在安全问题
  svg: string;
}

export interface HeaderActionIconProps {
  iconName: string;
  meta: Node;
  event?: Event;
}

export interface HeaderActionIcon {
  // 已注册的 icon 类型或自定义的 icon 类型名
  iconNames: string[];

  // 所属的 cell 类型
  belongsCell: Omit<CellTypes, 'dataCell'>;
  // 是否默认隐藏， true 为 hover后显示, false 为一直显示
  defaultHide?: boolean;

  // 需要展示的层级(行头/列头) 如果没有改配置则默认全部打开
  displayCondition?: (mete: Node) => boolean;

  // 点击后的执行函数
  action: (headerActionIconProps: HeaderActionIconProps) => void;
}

// Hook 渲染和布局相关的函数类型定义
export type LayoutArrangeCallback = (
  spreadsheet: SpreadSheet,
  parent: Node,
  field: string,
  fieldValues: string[],
) => string[];

export type LayoutCallback = (
  spreadsheet: SpreadSheet,
  rowNode: Node,
  colNode: Node,
) => void;

export type CellCallback<T extends BaseHeaderConfig> = (
  node: Node,
  spreadsheet: SpreadSheet,
  headerConfig: T,
) => S2CellType;

export type DataCellCallback = (viewMeta: ViewMeta) => S2CellType;

export type FrameCallback = (cfg: FrameConfig) => Frame;

export type CornerHeaderCallback = (
  parent: S2CellType,
  spreadsheet: SpreadSheet,
  ...restOptions: unknown[]
) => void;

// 行列结构的自定义
export type HierarchyResult = { nodes: Node[]; push: boolean };

export type HierarchyCallback = (
  spreadsheet: SpreadSheet,
  node: Node,
) => HierarchyResult;

export interface CellCfg {
  width?: number;
  height?: number;
  // valueCfg of MultiData
  valuesCfg?: {
    // 原始值字段
    originalValueField?: string;
    // 每一列数值占单元格宽度百分比 Map
    widthPercentCfg?: number[];
    // 条件格式
    conditions?: { text: Condition };
  };
}

export interface RowCfg {
  // row's cell width
  width?: number;
  // specific some row field's width
  widthByField?: Record<string, number>;
  heightByField?: Record<string, number>;
  // tree row width(拖拽产生的，无需主动设置)
  treeRowsWidth?: number;
}

export interface ColCfg {
  // columns height(for normal state)
  height?: number;
  // specific some col field's width
  widthByFieldValue?: Record<string, number>;
  // specific some col field's height
  heightByField?: Record<string, number>;
  // hide last column(measure values), only work when has one value
  hideMeasureColumn?: boolean;
}

/**
 * the label names of rows or columns.
 * Using the ID_SEPARATOR('[&]') to join two labels
 * when there are hierarchical relations between them.
 */
export interface CustomHeaderCells {
  cellLabels: string[];
  mode?: 'pick' | 'omit';
}

/**
 * the index of rows or columns.
 */
export interface MergedCellInfo {
  colIndex?: number;
  rowIndex?: number;
  showText?: boolean;
}

/**
 * the data cell and meta that make up the mergedCell, temporary use
 */
export type TempMergedCell = {
  cells: S2CellType[];
  viewMeta: ViewMeta;
  isPartiallyVisible?: boolean;
};

export type FilterDataItemCallback = (
  valueField: string,
  data: DataItem,
) => DataItem;

export type MappingDataItemCallback = (
  valueField: string,
  data: DataItem,
) => Record<string, string | number> | DataItem;
/**
 * Spreadsheet facet config
 */
export interface SpreadSheetFacetCfg
  extends Fields,
    S2BasicOptions,
    S2TableSheetOptions,
    Style {
  // spreadsheet interface
  spreadsheet: SpreadSheet;
  // data set of spreadsheet
  dataSet: BaseDataSet;
  // field's meta info
  meta?: Meta[];
}

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
  data: Record<string, any>;
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
  rowQuery?: Record<string, any>;
  // cell's col query condition
  colQuery?: Record<string, any>;
  // rowId of cell
  rowId?: string;
  colId?: string;
  field?: string;
  [key: string]: any;
}

export type ViewMetaIndexType = keyof Pick<ViewMeta, 'colIndex' | 'rowIndex'>;

export type GetCellMeta = (rowIndex?: number, colIndex?: number) => ViewMeta;

export interface LayoutResult {
  colNodes: Node[];
  colsHierarchy: Hierarchy;
  rowNodes: Node[];
  rowsHierarchy: Hierarchy;
  rowLeafNodes: Node[];
  colLeafNodes: Node[];
  getCellMeta: GetCellMeta;
  spreadsheet: SpreadSheet;
}

export interface OffsetConfig {
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
  isRowHeaderText?: boolean;
  cellData?: T;
}

export interface CellAttrs<T extends Record<string, unknown> = Node>
  extends ShapeAttrs {
  text?: string;
  appendInfo?: CellAppendInfo<T>;
}

export type S2MountContainer = string | Element;

export type S2Constructor<T = Element | string> = [
  S2MountContainer,
  S2DataConfig,
  S2Options<T>,
];

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
  // 下钻的维度
  drillField: string;
  // 下钻的数据
  drillData: Record<string, string | number>[];
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
