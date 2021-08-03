import { Group } from '@antv/g-canvas';
import { Hierarchy, SpreadSheet, Node, CustomTreeItem } from '../../index';
import { BaseDataSet } from 'src/data-set';
import { Frame } from 'src/facet/header';
import { BaseTooltip } from '../tooltip';
import { S2DataConfig, safetyDataConfig, Data, DataItem } from './s2DataConfig';
import { S2Options, safetyOptions } from './s2Options';
import { CustomInteraction } from './interaction';
import { ResizeInfo } from '@/facet/header/interface';
import {
  LayoutArrange,
  LayoutCoordinate,
  LayoutDataPosition,
  LayoutHierarchy,
} from '@/common/interface/hooks';

export { S2DataConfig, safetyDataConfig, S2Options, safetyOptions, Data };

export type Formatter = (v: unknown) => string;

export type Aggregation = 'SUM' | 'AVG' | 'MIN' | 'MAX';
export type SortMethod = 'ASC' | 'DESC';

export interface Meta {
  readonly field: string; // 字段 id
  readonly name?: string; // 字段名称
  // 格式化
  // 数值字段：一般用于格式化数字带戴维
  // 文本字段：一般用于做字段枚举值的别名
  readonly formatter?: Formatter;
  readonly aggregation?: Aggregation;
}

export interface DerivedValue {
  // which value that derived values belong to
  valueField: string;
  // value's derived value fields
  derivedValueField: string[];
}

export interface Fields {
  // row fields
  rows: string[];
  // custom tree data(only use in row header in pivot mode)
  customTreeItems?: CustomTreeItem[];
  // columns fields
  columns?: string[];
  // value fields
  values?: string[];
  // derived values
  derivedValues?: DerivedValue[];
  // measure values in cols as new col, only works in 'pivot' mode
  valueInCols?: boolean;
}

type MappingFunction = (
  fieldValue: number,
  data: Record<string, any>,
) => CellMapping;

export interface CellMapping {
  // only used in icon condition
  icon?: string;
  // interval, background, text fill color
  fill: string;
  // only used in interval condition
  isCompare?: boolean;
  minValue?: number;
  maxValue?: number;
}

/**
 * One field can hold a condition
 */
export interface Condition {
  readonly field: string;
  readonly mapping: MappingFunction;
}

export interface Conditions {
  readonly text?: Condition[];
  readonly background?: Condition[];
  readonly interval?: Condition[];
  readonly icon?: Condition[];
}

export interface Total {
  /** 是否显示总计 */
  showGrandTotals: boolean;
  /** 是否显示小计 */
  showSubTotals: boolean;
  /** 聚合方式 */
  aggregation: Aggregation;
  /** 小计聚合方式 */
  aggregationSub: Aggregation;
  /** 小计的汇总维度 */
  subTotalsDimensions: string[];
  /** 布局位置，默认是下或右 */
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

export interface Tooltip {
  readonly showTooltip?: boolean;
  readonly showOperation?: boolean;
  readonly showSummary?: boolean;
  readonly showDetail?: boolean;
  readonly showInfos?: boolean;
  readonly row?: Tooltip;
  readonly col?: Tooltip;
  readonly cell?: Tooltip;
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
}

export interface SortFuncParam extends Sort {
  data: Array<string | Record<string, any>>;
}

export interface SortParam extends Sort {
  /** 自定义func */
  sortFunc?: (v: SortFuncParam) => Array<string>;
}

export type SortParams = SortParam[];

export interface Style {
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
  // 总页数（ant.d 组件不需要，所以不传了）
  pageCount?: number;
};

export interface NodeField {
  // 行头中需要监听滚动吸顶的度量id
  rowField?: string[];
  // 列头中需要监听滚动吸「左」的度量id
  colField?: string[];
}

export interface RowActionIcons {
  iconTypes: string[];
  // 需要展示的层级(行头)
  display: {
    level: number; // 层级
    operator: '>' | '=' | '<' | '>=' | '<='; // 层级关系
  };
  // 根据行头名自定义展示
  customDisplayByRowName?: {
    // Row headers, using the ID_SEPARATOR('[&]') to join two labels when there are hierarchical relations between them.
    rowNames: string[];
    // 指定行头名称是否展示icon
    mode: 'pick' | 'omit';
  };
  // 具体的动作
  action: (iconType: string, meta: Node, event: Event) => void;
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

export type CellCallback = (
  node: Node,
  spreadsheet: SpreadSheet,
  ...restOptions
) => Group;

export type TooltipCallback = (
  spreadsheet: SpreadSheet,
  ...restOptions
) => BaseTooltip;

export type DataCellCallback = (viewMeta: ViewMeta) => Group;
// TODO 类型定义清楚！！
export type FrameCallback = (cfg: any) => Frame;
export type CornerHeaderCallback = (
  parent: Group,
  spreadsheet: SpreadSheet,
  ...restOptions
) => void;
// 透出默认的布局结果，返回新的结果
export type LayoutResultCallback = (layoutResult: LayoutResult) => LayoutResult;
// 行列结构的自定义
export type HierarchyResult = { nodes: Node[]; push: boolean };
export type HierarchyCallback = (
  spreadsheet: SpreadSheet,
  node: Node,
) => HierarchyResult;

export interface CellCfg {
  width?: number;
  height?: number;
  padding?: [number, number, number, number];
  lineHeight?: number;
}

export interface RowCfg {
  // row's cell width
  width?: number;
  // specific some row field's width
  widthByField?: Record<string, number>;
  // tree row width(拖拽产生的，无需主动设置)
  treeRowsWidth?: number;
}

export interface ColCfg {
  // columns height(for normal state)
  height?: number;
  // specific some col field's width
  widthByFieldValue?: Record<string, number>;
  // col width's type
  colWidthType?: 'adaptive' | 'compact';
  // specific some col field's height
  heightByField?: Record<string, number>;
  // hide last column(measure values), only work when has one value
  hideMeasureColumn?: boolean;
  // 列宽计算小计，明细数据采样的个数
  totalSample?: number;
  detailSample?: number;
  // 列显示衍生指标icon
  showDerivedIcon?: boolean;
  // 列宽取计算的第几个最大值
  maxSampleIndex?: number;
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
 * Spreadsheet facet config
 */
export interface SpreadSheetFacetCfg {
  // spreadsheet interface
  spreadsheet: SpreadSheet;
  // data set of spreadsheet
  dataSet: BaseDataSet;
  // columns fields
  columns?: string[];
  // rows fields
  rows?: string[];
  // values fields
  values?: string[];
  // 衍生指标
  derivedValues?: DerivedValue[];
  // cross-tab area's cell config
  cellCfg?: CellCfg;
  // row cell config
  rowCfg?: RowCfg;
  // column cell config
  colCfg?: ColCfg;
  // width/height of plot
  width?: number;
  height?: number;
  // tree mode rows width
  treeRowsWidth?: number;
  // all collapsed rows(node id <=> isCollapse) -- only use in tree mode row header
  collapsedRows?: Record<string, boolean>;
  // use in col header
  collapsedCols?: Record<string, boolean>;
  // hierarchy' type
  hierarchyType?: 'grid' | 'tree';
  // check if hierarchy is collapse
  hierarchyCollapse?: boolean;
  // field's meta info
  meta?: Meta[];
  // paginate config
  pagination?: Pagination;
  // born single cell's draw group
  dataCell: DataCellCallback;
  // 自定义cornerCell
  cornerCell?: CellCallback;
  // 自定义行头cell
  rowCell?: CellCallback;
  // 自定义列头cell
  colCell?: CellCallback;
  // 自定义 frame 边框 TODO 类型定义！！
  frame?: FrameCallback;
  // 角头可能需要全部自定义，而不是用交叉表概念的node来渲染
  cornerHeader?: CornerHeaderCallback;
  // determine what does row/column tree hierarchy look like
  layoutHierarchy?: LayoutHierarchy;
  // determine the order of every row/column tree branch
  layoutArrange?: LayoutArrange;
  // determine the location(x,y,width,height eg..) of every node
  layoutCoordinate?: LayoutCoordinate;
  // determine the data of cells in Cartesian coordinates
  layoutDataPosition?: LayoutDataPosition;
  // custom Interaction
  customInteraction?: CustomInteraction[];
}

export interface ViewMeta {
  spreadsheet: SpreadSheet;
  // cell's coordination-x
  x: number;
  // cell's coordination-y
  y: number;
  // cell's width
  width: number;
  // cell's height
  height: number;
  // cell origin data raws(multiple data)
  data: Record<string, any>[];
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
  [key: string]: any;
}
export type GetCellData = (rowIndex: number, colIndex: number) => ViewMeta;

export interface LayoutResult {
  colNodes: Node[];
  colsHierarchy: Hierarchy;
  rowNodes: Node[];
  rowsHierarchy: Hierarchy;
  rowLeafNodes: Node[];
  colLeafNodes: Node[];
  getCellMeta: GetCellData;
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
  isCornerHeaderText?: boolean;
  isRowHeaderText?: boolean;
  cellData?: T;
}

export type SpreadsheetMountContainer = string | HTMLElement;

export type SpreadsheetConstructor = [
  SpreadsheetMountContainer,
  S2DataConfig,
  S2Options,
];
