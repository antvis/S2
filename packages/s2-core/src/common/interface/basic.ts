import { CustomTreeItem } from '@/common/interface';
import { S2PartialOptions } from 'src/common/interface/s2Options';
import { ResizeInfo } from '@/facet/header/interface';
import {
  Hierarchy,
  Node,
  S2Options,
  SpreadSheet,
  TextAlign,
  TextBaseline,
} from '@/index';
import { BaseDataSet } from 'src/data-set';
import { Frame } from 'src/facet/header';
import { Padding } from '../interface/theme';
import { BaseTooltip } from '../tooltip';
import { S2CellType } from './interaction';
import { DataItem, S2DataConfig } from './s2DataConfig';
import { IconTheme } from './theme';
import { Event } from '@antv/g-canvas';

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
  rows: string[];
  // custom tree data(only use in row header in pivot mode)
  customTreeItems?: CustomTreeItem[];
  // columns fields
  columns?: string[];
  // value fields
  values?: string[];
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

type IconPosition = 'left' | 'right';
export interface IconCondition extends Condition {
  readonly iconPosition?: IconPosition; // right by default
}

export type IconCfg = Pick<IconTheme, 'size' | 'margin'> &
  Pick<IconCondition, 'iconPosition'>;

export interface Conditions {
  readonly text?: Condition[];
  readonly background?: Condition[];
  readonly interval?: Condition[];
  readonly icon?: IconCondition[];
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
  // custom tooltips
  readonly renderTooltip?: RenderTooltip;
  // replace the whole default tooltip component
  readonly tooltipComponent?: JSX.Element;
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
) => S2CellType;

export type RenderTooltip = (spreadsheet: SpreadSheet) => BaseTooltip;

export type DataCellCallback = (viewMeta: ViewMeta) => S2CellType;
// TODO 类型定义清楚！！
export type FrameCallback = (cfg: any) => Frame;
export type CornerHeaderCallback = (
  parent: S2CellType,
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
  padding?: Padding;
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
export interface SpreadSheetFacetCfg extends Fields, S2PartialOptions, Style {
  // spreadsheet interface
  spreadsheet: SpreadSheet;
  // data set of spreadsheet
  dataSet: BaseDataSet;
  // field's meta info
  meta?: Meta[];
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
  [key: string]: any;
}

export type ViewMetaIndex = keyof Pick<ViewMeta, 'colIndex' | 'rowIndex'>;

export type GetCellMeta = (rowIndex: number, colIndex: number) => ViewMeta;

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
  isCornerHeaderText?: boolean;
  isRowHeaderText?: boolean;
  cellData?: T;
}

/**
 * 单元格属性配置
 */
export interface CellBoxCfg {
  // 起点坐标 x 值
  x: number;
  // 起点坐标 y 值
  y: number;
  // 单元格宽度
  width: number;
  // 单元格高度
  height: number;
  // 对应 g text textAlign 属性 https://g.antv.vision/zh/docs/api/shape/text#textalign
  // 水平对齐方式, 默认 left
  textAlign?: TextAlign;
  // 对应 g text baseline 属性 https://g.antv.vision/zh/docs/api/shape/text#textbaseline
  // 垂直对齐方式，默认 bottom
  textBaseline?: TextBaseline;
  // 单元格 padding 值
  padding?: Padding;
}
export type S2MountContainer = string | HTMLElement;

export type S2Constructor = [S2MountContainer, S2DataConfig, S2Options];

export interface OriginalEvent extends Event {
  layerX: number;
  layerY: number;
}
