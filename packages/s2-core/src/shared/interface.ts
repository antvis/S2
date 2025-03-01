import { FederatedPointerEvent as GEvent } from '@antv/g';
import type {
  ColCell,
  CornerCell,
  DataCell,
  MergedCell,
  RowCell,
  SeriesNumberCell,
  TableDataCell,
} from '../cell';
import type {
  BaseTooltipOperatorMenuOptions,
  CellScrollPosition,
  CellSelectedHandler,
  CopyableList,
  HeaderActionIcon,
  HiddenColumnsInfo,
  LayoutResult,
  Pagination,
  RawData,
  ResizeInfo,
  ResizeParams,
  RowCellCollapsedParams,
  S2CellType,
  S2DataConfig,
  S2MountContainer,
  S2Options,
  S2RenderOptions,
  SortParams,
  TargetCellInfo,
  ThemeCfg,
  TooltipContentType,
  TooltipOperatorOptions,
  ViewMeta,
  ViewMetaData,
} from '../common';
import type { Node } from '../facet/layout/node';
import type { SpreadSheet } from '../sheet-type';

// 是否开启自适应宽高，并指定容器
export type Adaptive =
  | boolean
  | {
      width?: boolean;
      height?: boolean;
      getContainer?: () => HTMLElement;
    };

export type SheetType =
  | 'pivot'
  | 'table'
  | 'chart'
  | 'pivotChart'
  | 'gridAnalysis'
  | 'strategy'
  | 'editable';

/** render callback */
export type SheetUpdateCallback = (params: S2RenderOptions) => S2RenderOptions;

export type LayoutPaginationParams = {
  pageSize: number;
  pageCount: number;
  total: number;
  current: number;
};

export interface BaseSheetComponentProps<
  PartialDrillDown = PartDrillDown,
  Options = S2Options<TooltipContentType, Pagination>,
> {
  sheetType?: SheetType;
  spreadsheet?: (
    container: S2MountContainer,
    dataCfg: S2DataConfig,
    options: Options,
  ) => SpreadSheet;
  dataCfg: S2DataConfig;
  options?: Options;
  loading?: boolean;
  partDrillDown?: PartialDrillDown;
  adaptive?: Adaptive;
  themeCfg?: ThemeCfg;

  // ============== Row Cell ====================
  onRowCellHover?: (data: TargetCellInfo) => void;
  onRowCellClick?: (data: TargetCellInfo) => void;
  onRowCellDoubleClick?: (data: TargetCellInfo) => void;
  onRowCellContextMenu?: (data: TargetCellInfo) => void;
  onRowCellMouseDown?: (data: TargetCellInfo) => void;
  onRowCellMouseUp?: (data: TargetCellInfo) => void;
  onRowCellMouseMove?: (data: TargetCellInfo) => void;
  onRowCellCollapsed?: (params: RowCellCollapsedParams) => void;
  onRowCellAllCollapsed?: (isCollapsed: boolean) => void;
  onRowCellScroll?: (position: CellScrollPosition) => void;
  onRowCellRender?: (cell: RowCell) => void;
  onRowCellSelected?: CellSelectedHandler;

  // ============== Col Cell ====================
  onColCellHover?: (data: TargetCellInfo) => void;
  onColCellClick?: (data: TargetCellInfo) => void;
  onColCellDoubleClick?: (data: TargetCellInfo) => void;
  onColCellContextMenu?: (data: TargetCellInfo) => void;
  onColCellMouseDown?: (data: TargetCellInfo) => void;
  onColCellMouseUp?: (data: TargetCellInfo) => void;
  onColCellMouseMove?: (data: TargetCellInfo) => void;
  onColCellExpanded?: (node: Node) => void;
  onColCellExpandIconHover?: (data: {
    event: GEvent;
    meta: Node;
    hiddenNodes: Node[];
  }) => void;
  onColCellHidden?: (data: {
    currentHiddenColumnsInfo: HiddenColumnsInfo;
    hiddenColumnsDetail: HiddenColumnsInfo[];
  }) => void;
  onColCellRender?: (cell: ColCell) => void;
  onColCellSelected?: CellSelectedHandler;

  // ============== Data Cell ====================
  onDataCellHover?: (data: TargetCellInfo) => void;
  onDataCellClick?: (data: TargetCellInfo) => void;
  onDataCellDoubleClick?: (data: TargetCellInfo) => void;
  onDataCellContextMenu?: (data: TargetCellInfo) => void;
  onDataCellMouseDown?: (data: TargetCellInfo) => void;
  onDataCellMouseUp?: (data: TargetCellInfo) => void;
  onDataCellMouseMove?: (data: TargetCellInfo) => void;
  onDataCellBrushSelection?: (brushRangeDataCells: DataCell[]) => void;
  onDataCellSelectMove?: (metaList: ViewMetaData[]) => void;
  onDataCellRender?: (cell: DataCell) => void;
  onDataCellEditStart?: (meta: ViewMeta, cell: TableDataCell) => void;
  onDataCellEditEnd?: (meta: ViewMeta, cell: TableDataCell) => void;
  onDataCellSelected?: CellSelectedHandler;

  // ============== Corner Cell ====================
  onCornerCellHover?: (data: TargetCellInfo) => void;
  onCornerCellClick?: (data: TargetCellInfo) => void;
  onCornerCellDoubleClick?: (data: TargetCellInfo) => void;
  onCornerCellContextMenu?: (data: TargetCellInfo) => void;
  onCornerCellMouseDown?: (data: TargetCellInfo) => void;
  onCornerCellMouseUp?: (data: TargetCellInfo) => void;
  onCornerCellMouseMove?: (data: TargetCellInfo) => void;
  onCornerCellRender?: (cell: CornerCell) => void;
  onCornerCellSelected?: CellSelectedHandler;

  // ============== Merged Cells ====================
  onMergedCellsHover?: (data: TargetCellInfo) => void;
  onMergedCellsClick?: (data: TargetCellInfo) => void;
  onMergedCellsDoubleClick?: (data: TargetCellInfo) => void;
  onMergedCellsContextMenu?: (data: TargetCellInfo) => void;
  onMergedCellsMouseDown?: (data: TargetCellInfo) => void;
  onMergedCellsMouseUp?: (data: TargetCellInfo) => void;
  onMergedCellsMouseMove?: (data: TargetCellInfo) => void;
  onMergedCellsRender?: (cell: MergedCell) => void;

  /** ================ SeriesNumber Cell ================  */
  onSeriesNumberCellRender?: (cell: SeriesNumberCell) => void;

  // ============== Sort ====================
  onRangeSort?: (params: SortParams) => void;
  onRangeSorted?: (event: GEvent) => void;

  // ============== Filter ====================
  onRangeFilter?: (data: {
    filterKey: string;
    filteredValues: string[];
  }) => void;
  onRangeFiltered?: (data: ViewMetaData[]) => void;

  // ============== Layout ====================
  onLayoutAfterHeaderLayout?: (layoutResult: LayoutResult) => void;
  onLayoutPagination?: (data: LayoutPaginationParams) => void;
  onLayoutCellRender?: <T extends S2CellType = S2CellType>(cell: T) => void;
  onBeforeRender?: () => void;
  onAfterRender?: () => void;
  onMounted?: (spreadsheet: SpreadSheet) => void;
  onUpdate?: (renderOptions: S2RenderOptions) => S2RenderOptions | void;
  onUpdateAfterRender?: (renderOptions: S2RenderOptions) => void;
  onLoading?: (loading: boolean) => void;
  onDestroy?: () => void;

  // ============== Resize ====================
  onLayoutResize?: (params: ResizeParams) => void;
  onLayoutResizeSeriesWidth?: (params: ResizeParams) => void;
  onLayoutResizeRowWidth?: (params: ResizeParams) => void;
  onLayoutResizeRowHeight?: (params: ResizeParams) => void;
  onLayoutResizeColWidth?: (params: ResizeParams) => void;
  onLayoutResizeColHeight?: (params: ResizeParams) => void;
  onLayoutResizeTreeWidth?: (params: ResizeParams) => void;
  onLayoutResizeMouseDown?: (data: {
    event: Partial<MouseEvent>;
    resizeInfo?: ResizeInfo;
  }) => void;
  onLayoutResizeMouseUp?: (data: {
    event: Partial<MouseEvent>;
    resizeInfo?: ResizeInfo;
  }) => void;
  onLayoutResizeMouseMove?: (data: {
    event: Partial<MouseEvent>;
    resizeInfo?: ResizeInfo;
  }) => void;

  // ============== Global ====================
  onKeyBoardDown?: (event: KeyboardEvent) => void;
  onKeyBoardUp?: (event: KeyboardEvent) => void;
  onCopied?: (data: CopyableList) => void;
  onActionIconHover?: (event: GEvent) => void;
  onActionIconHoverOff?: (event: GEvent) => void;
  onActionIconClick?: (event: GEvent) => void;
  onContextMenu?: (event: GEvent) => void;
  onClick?: (event: GEvent) => void;
  onHover?: (event: GEvent) => void;
  onDoubleClick?: (event: GEvent) => void;
  onMouseHover?: (event: GEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onSelected?: CellSelectedHandler;
  onReset?: (event: KeyboardEvent) => void;
  onLinkFieldJump?: (data: { field: string; record: RawData }) => void;
  onScroll?: (position: CellScrollPosition) => void;

  // ============== Auto 自动生成的 ================
  onLayoutAfterRealDataCellRender?: (options: {
    add: [number, number][];
    remove: [number, number][];
    spreadsheet: SpreadSheet;
  }) => void;
  onRowCellBrushSelection?: (event: GEvent) => void;
  onColCellBrushSelection?: (event: GEvent) => void;
}

// useResize 参数
export interface ResizeEffectParams {
  s2: SpreadSheet;
  // 只包含了 sheet 容器
  container: HTMLDivElement;
  // 包含了 sheet + foot(page) + header
  wrapper: HTMLDivElement;
  adaptive: Adaptive | undefined;
}

// Tooltip 操作项
export interface TooltipOperatorProps<Menu = BaseTooltipOperatorMenuOptions>
  extends TooltipOperatorOptions<Menu> {
  onlyShowOperator?: boolean;
  cell: S2CellType;
}

// 下钻相关类型
export interface BaseDrillDownDataSet {
  name: string;
  value: string;
  type?: 'text' | 'location' | 'date';
  disabled?: boolean;
}

export interface BaseDrillDownComponentProps<
  DataSet = BaseDrillDownDataSet,
  Text = string,
> {
  className?: string;
  title?: Text;
  searchText?: string;
  clearText?: Text;
  dataSet?: DataSet[] | undefined;
  drillFields?: string[];
  disabledFields?: string[];
  getDrillFields?: (drillFields: string[]) => void;
  setDrillFields?: (drillFields: string[]) => void;
  drillVisible?: boolean;
}

export interface PartDrillDownInfo {
  // The data of drill down
  drillData: RawData[];
  // The field of drill down
  drillField: string;
}

export interface PartDrillDown<T = BaseDrillDownComponentProps>
  extends Pick<HeaderActionIcon, 'displayCondition'> {
  // The configuration of drill down
  drillConfig: T;
  // The numbers of drill down result
  drillItemsNum?: number;
  fetchData: (meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>;
  // Clear the info of drill down
  clearDrillDown?: {
    rowId: string;
  };
}
