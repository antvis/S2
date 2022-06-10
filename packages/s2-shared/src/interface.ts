import type {
  S2DataConfig,
  S2Options,
  CellScrollPosition,
  TargetCellInfo,
  ResizeParams,
  Node,
  SpreadSheet,
  ThemeCfg,
  ViewMeta,
  LayoutResult,
  SortParams,
  DataCell,
  Data,
  GEvent,
  HiddenColumnsInfo,
  CollapsedRowsType,
  DataType,
  ResizeInfo,
  S2CellType,
  TooltipOperatorOptions,
  S2RenderOptions,
  S2MountContainer,
} from '@antv/s2';

// 是否开启自适应宽高，并指定容器
export type Adaptive =
  | boolean
  | {
      width?: boolean;
      height?: boolean;
      getContainer?: () => HTMLElement;
    };

export type SheetType = 'pivot' | 'table' | 'gridAnalysis' | 'strategy';

/** render callback */
export type SheetUpdateCallback = (params: S2RenderOptions) => S2RenderOptions;

export interface BaseSheetComponentProps<
  PartialDrillDown = unknown,
  Header = unknown,
> {
  sheetType?: SheetType;
  spreadsheet?: (
    container: S2MountContainer,
    dataCfg: S2DataConfig,
    options: S2Options,
  ) => SpreadSheet;
  dataCfg: S2DataConfig;
  options?: S2Options;
  loading?: boolean;
  partDrillDown?: PartialDrillDown;
  adaptive?: Adaptive;
  showPagination?:
    | boolean
    | {
        onShowSizeChange?: (pageSize: number) => void;
        onChange?: (current: number) => void;
      };
  themeCfg?: ThemeCfg;
  header?: Header;
  getSpreadSheet?: (spreadsheet: SpreadSheet) => void;
  /** 底表 render callback */
  onSheetUpdate?: SheetUpdateCallback;

  // ============== Row Cell ====================
  onRowCellHover?: (data: TargetCellInfo) => void;
  onRowCellClick?: (data: TargetCellInfo) => void;
  onRowCellDoubleClick?: (data: TargetCellInfo) => void;
  onRowCellContextMenu?: (data: TargetCellInfo) => void;
  onRowCellMouseDown?: (data: TargetCellInfo) => void;
  onRowCellMouseUp?: (data: TargetCellInfo) => void;
  onRowCellMouseMove?: (data: TargetCellInfo) => void;
  onRowCellCollapseTreeRows?: (params: {
    id: number;
    isCollapsed: boolean;
    node: Node;
  }) => void;

  // ============== Col Cell ====================
  onColCellHover?: (data: TargetCellInfo) => void;
  onColCellClick?: (data: TargetCellInfo) => void;
  onColCellDoubleClick?: (data: TargetCellInfo) => void;
  onColCellContextMenu?: (data: TargetCellInfo) => void;
  onColCellMouseDown?: (data: TargetCellInfo) => void;
  onColCellMouseUp?: (data: TargetCellInfo) => void;
  onColCellMouseMove?: (data: TargetCellInfo) => void;

  // ============== Data Cell ====================
  onDataCellHover?: (data: TargetCellInfo) => void;
  onDataCellClick?: (data: TargetCellInfo) => void;
  onDataCellDoubleClick?: (data: TargetCellInfo) => void;
  onDataCellContextMenu?: (data: TargetCellInfo) => void;
  onDataCellMouseDown?: (data: TargetCellInfo) => void;
  onDataCellMouseUp?: (data: TargetCellInfo) => void;
  onDataCellMouseMove?: (data: TargetCellInfo) => void;
  onDataCellTrendIconClick?: (meta: ViewMeta) => void;
  onDataCellBrushSelection?: (brushRangeDataCells: DataCell[]) => void;

  // ============== Corner Cell ====================
  onCornerCellHover?: (data: TargetCellInfo) => void;
  onCornerCellClick?: (data: TargetCellInfo) => void;
  onCornerCellDoubleClick?: (data: TargetCellInfo) => void;
  onCornerCellContextMenu?: (data: TargetCellInfo) => void;
  onCornerCellMouseDown?: (data: TargetCellInfo) => void;
  onCornerCellMouseUp?: (data: TargetCellInfo) => void;
  onCornerCellMouseMove?: (data: TargetCellInfo) => void;

  // ============== Merged Cells ====================
  onMergedCellsHover?: (data: TargetCellInfo) => void;
  onMergedCellsClick?: (data: TargetCellInfo) => void;
  onMergedCellsDoubleClick?: (data: TargetCellInfo) => void;
  onMergedCellsContextMenu?: (data: TargetCellInfo) => void;
  onMergedCellsMouseDown?: (data: TargetCellInfo) => void;
  onMergedCellsMouseUp?: (data: TargetCellInfo) => void;
  onMergedCellsMouseMove?: (data: TargetCellInfo) => void;

  // ============== Sort ====================
  onRangeSort?: (params: SortParams) => void;
  onRangeSorted?: (event: GEvent) => void;

  // ============== Filter ====================
  onRangeFilter?: (data: {
    filterKey: string;
    filteredValues: string[];
  }) => void;
  onRangeFiltered?: (data: DataType[]) => void;

  // ============== Layout ====================
  onLayoutAfterHeaderLayout?: (layoutResult: LayoutResult) => void;
  onLayoutPagination?: (data: {
    pageSize: number;
    pageCount: number;
    total: number;
    current: number;
  }) => void;
  onLayoutCellScroll?: (position: CellScrollPosition) => void;
  onLayoutAfterCollapseRows?: (data: CollapsedRowsType) => void;
  onCollapseRowsAll?: (hierarchyCollapse: boolean) => void;
  onLayoutColsExpanded?: (node: Node) => void;
  onLayoutColsHidden?: (data: {
    currentHiddenColumnsInfo: HiddenColumnsInfo;
    hiddenColumnsDetail: HiddenColumnsInfo[];
  }) => void;
  onBeforeRender?: () => void;
  onAfterRender?: () => void;
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
  onCopied?: (copyData: string) => void;
  onActionIconHover?: (event: GEvent) => void;
  onActionIconClick?: (event: GEvent) => void;
  onContextMenu?: (event: GEvent) => void;
  onClick?: (event: GEvent) => void;
  onDoubleClick?: (event: GEvent) => void;
  onMouseHover?: (event: GEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onSelected?: (cells: DataCell[]) => void;
  onReset?: (event: KeyboardEvent) => void;
  onLinkFieldJump?: (data: { key: string; record: Data }) => void;
}

// useResize 参数
export interface ResizeEffectParams {
  s2: SpreadSheet;
  container: HTMLDivElement; // 只包含了 sheet 容器
  wrapper: HTMLDivElement; // 包含了 sheet + foot(page) + header
  adaptive: Adaptive | undefined;
}

// Tooltip 操作项
export interface TooltipOperatorProps
  extends Omit<TooltipOperatorOptions, 'onClick'> {
  onlyMenu: boolean;
  cell: S2CellType;
}
