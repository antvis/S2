import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import type {
  CornerCell,
  MergedCell,
  RowCell,
  SeriesNumberCell,
} from '../../cell';
import type { ColCell } from '../../cell/col-cell';
import type { DataCell } from '../../cell/data-cell';
import type { S2Event } from '../../common/constant';
import type {
  CellMeta,
  CellScrollPosition,
  Data,
  FilterParam,
  HiddenColumnsInfo,
  LayoutResult,
  RowCellCollapsedParams,
  S2CellType,
  S2Style,
  SortParams,
} from '../../common/interface';
import type { RawData } from '../../common/interface/s2DataConfig';
import type { Node } from '../../facet/layout/node';
import type { SpreadSheet } from '../../sheet-type';
import type { CopyableList } from './export';
import type { ResizeInfo } from './resize';

type CanvasEventHandler = (event: CanvasEvent) => void;
type KeyboardEventHandler = (event: KeyboardEvent) => void;
type MouseEventHandler = (event: MouseEvent) => void;
type PointerEventHandler = (event: PointerEvent) => void;
type EventHandler = (event: Event) => void;
type ResizeHandler = (data: {
  info: ResizeInfo;
  style?: S2Style;
  seriesNumberWidth?: number;
}) => void;
type SelectedHandler = (cells: S2CellType[]) => void;
type SortedHandler = (rangeData: RawData[]) => any;

export interface EmitterType {
  /** ================ Global ================  */
  [S2Event.GLOBAL_ACTION_ICON_CLICK]: CanvasEventHandler;
  [S2Event.GLOBAL_ACTION_ICON_HOVER]: CanvasEventHandler;
  [S2Event.GLOBAL_ACTION_ICON_HOVER_OFF]: CanvasEventHandler;
  [S2Event.GLOBAL_COPIED]: (data: CopyableList | undefined) => void;
  [S2Event.GLOBAL_KEYBOARD_DOWN]: KeyboardEventHandler;
  [S2Event.GLOBAL_KEYBOARD_UP]: KeyboardEventHandler;
  [S2Event.GLOBAL_MOUSE_UP]: MouseEventHandler;
  [S2Event.GLOBAL_MOUSE_MOVE]: MouseEventHandler;
  [S2Event.LAYOUT_RESIZE_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.LAYOUT_RESIZE_MOUSE_UP]: CanvasEventHandler;
  [S2Event.LAYOUT_RESIZE_MOUSE_MOVE]: PointerEventHandler;
  [S2Event.GLOBAL_CONTEXT_MENU]: CanvasEventHandler;
  [S2Event.GLOBAL_CLICK]: CanvasEventHandler;
  [S2Event.GLOBAL_DOUBLE_CLICK]: CanvasEventHandler;
  [S2Event.GLOBAL_RESET]: EventHandler;
  [S2Event.GLOBAL_HOVER]: CanvasEventHandler;
  [S2Event.GLOBAL_SELECTED]: SelectedHandler;
  [S2Event.GLOBAL_SCROLL]: (position: CellScrollPosition) => void;

  /** ================ Sort ================  */
  [S2Event.RANGE_SORT]: (info: SortParams) => void;
  [S2Event.RANGE_SORTED]: SortedHandler | CanvasEventHandler;

  /** ================ Filter ================  */
  [S2Event.RANGE_FILTER]: (info: FilterParam) => void;
  [S2Event.RANGE_FILTERED]: (data: RawData[]) => any;

  /** ================ Cell ================  */
  [S2Event.GLOBAL_LINK_FIELD_JUMP]: (data: {
    cellData: Node;
    field: string;
    record: Data;
  }) => void;

  /** ================ Date Cell ================  */
  [S2Event.DATA_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.DATA_CELL_MOUSE_UP]: CanvasEventHandler;
  [S2Event.DATA_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.DATA_CELL_HOVER]: CanvasEventHandler;
  [S2Event.DATA_CELL_CLICK]: CanvasEventHandler;
  [S2Event.DATA_CELL_DOUBLE_CLICK]: CanvasEventHandler;
  [S2Event.DATA_CELL_CONTEXT_MENU]: CanvasEventHandler;
  [S2Event.DATA_CELL_BRUSH_SELECTION]: (cells: (DataCell | CellMeta)[]) => void;
  [S2Event.DATA_CELL_SELECT_MOVE]: (metas: CellMeta[]) => void;
  [S2Event.DATA_CELL_RENDER]: (cell: DataCell) => void;

  /** ================ Row Cell ================  */
  [S2Event.ROW_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.ROW_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.ROW_CELL_HOVER]: CanvasEventHandler;
  [S2Event.ROW_CELL_CLICK]: CanvasEventHandler;
  [S2Event.ROW_CELL_DOUBLE_CLICK]: CanvasEventHandler;
  [S2Event.ROW_CELL_CONTEXT_MENU]: CanvasEventHandler;
  [S2Event.ROW_CELL_MOUSE_UP]: CanvasEventHandler;
  [S2Event.ROW_CELL_SCROLL]: (position: CellScrollPosition) => void;
  [S2Event.ROW_CELL_BRUSH_SELECTION]: (cells: RowCell[]) => void;
  [S2Event.ROW_CELL_COLLAPSED]: (data: RowCellCollapsedParams) => void;
  [S2Event.ROW_CELL_COLLAPSED__PRIVATE]: (data: RowCellCollapsedParams) => void;
  [S2Event.ROW_CELL_ALL_COLLAPSED]: (isCollapsed: boolean) => void;
  [S2Event.ROW_CELL_ALL_COLLAPSED__PRIVATE]: (isCollapsed: boolean) => void;
  [S2Event.ROW_CELL_RENDER]: (cell: RowCell) => void;

  /** ================ Col Cell ================  */
  [S2Event.COL_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.COL_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.COL_CELL_HOVER]: CanvasEventHandler;
  [S2Event.COL_CELL_CLICK]: CanvasEventHandler;
  [S2Event.COL_CELL_DOUBLE_CLICK]: CanvasEventHandler;
  [S2Event.COL_CELL_CONTEXT_MENU]: CanvasEventHandler;
  [S2Event.COL_CELL_MOUSE_UP]: CanvasEventHandler;
  [S2Event.COL_CELL_BRUSH_SELECTION]: (cells: ColCell[]) => void;
  [S2Event.COL_CELL_EXPANDED]: (expandedNode: Node) => void;
  [S2Event.COL_CELL_HIDDEN]: (
    currentHiddenColumnsInfo: HiddenColumnsInfo,
    hiddenColumnsDetail: HiddenColumnsInfo[],
  ) => void;
  [S2Event.COL_CELL_RENDER]: (cell: ColCell) => void;

  /** ================ Corner Cell ================  */
  [S2Event.CORNER_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.CORNER_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.CORNER_CELL_HOVER]: CanvasEventHandler;
  [S2Event.CORNER_CELL_CLICK]: CanvasEventHandler;
  [S2Event.CORNER_CELL_DOUBLE_CLICK]: CanvasEventHandler;
  [S2Event.CORNER_CELL_CONTEXT_MENU]: CanvasEventHandler;
  [S2Event.CORNER_CELL_MOUSE_UP]: CanvasEventHandler;
  [S2Event.CORNER_CELL_RENDER]: (cell: CornerCell) => void;

  /** ================ Merged Cells ================  */
  [S2Event.MERGED_CELLS_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_HOVER]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_MOUSE_UP]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_CLICK]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_CONTEXT_MENU]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_DOUBLE_CLICK]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_RENDER]: (cell: MergedCell) => void;

  /** ================ SeriesNumber Cell ================  */
  [S2Event.SERIES_NUMBER_CELL_RENDER]: (cell: SeriesNumberCell) => void;

  /** ================ Layout ================  */
  [S2Event.LAYOUT_PAGINATION]: (data: {
    pageSize: number;
    pageCount: number;
    total: number;
    current: number;
  }) => void;
  [S2Event.LAYOUT_AFTER_HEADER_LAYOUT]: (layoutResult: LayoutResult) => void;
  [S2Event.LAYOUT_AFTER_REAL_DATA_CELL_RENDER]: (options: {
    add: [number, number][];
    remove: [number, number][];
    spreadsheet: SpreadSheet;
  }) => void;
  [S2Event.LAYOUT_CELL_RENDER]: <T extends S2CellType>(cell: T) => void;
  [S2Event.LAYOUT_BEFORE_RENDER]: () => void;
  [S2Event.LAYOUT_AFTER_RENDER]: () => void;
  [S2Event.LAYOUT_DESTROY]: () => void;

  /** ================ Layout Resize ================  */
  [S2Event.LAYOUT_RESIZE]: ResizeHandler;
  [S2Event.LAYOUT_RESIZE_SERIES_WIDTH]: ResizeHandler;
  [S2Event.LAYOUT_RESIZE_ROW_WIDTH]: ResizeHandler;
  [S2Event.LAYOUT_RESIZE_ROW_HEIGHT]: ResizeHandler;
  [S2Event.LAYOUT_RESIZE_COL_WIDTH]: ResizeHandler;
  [S2Event.LAYOUT_RESIZE_COL_HEIGHT]: ResizeHandler;
  [S2Event.LAYOUT_RESIZE_TREE_WIDTH]: ResizeHandler;
}
