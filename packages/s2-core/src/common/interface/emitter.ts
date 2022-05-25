import { Event as CanvasEvent } from '@antv/g-canvas';
import { ResizeInfo } from './resize';
import { Data } from '@/common/interface/s2DataConfig';
import { FilterParam, SortParams, Style } from '@/common/interface/basic';
import {
  HiddenColumnsInfo,
  S2CellType,
  ViewMeta,
  LayoutResult,
  CellScrollPosition,
} from '@/common/interface';

import { S2Event } from '@/common/constant';
import { Node } from '@/facet/layout/node';
import { DataCell } from '@/cell/data-cell';

export type CollapsedRowsType = {
  collapsedRows: Record<string, boolean> & {
    [x: number]: any;
  };
  meta?: Node;
};

export type RowCellCollapseTreeRowsType = {
  id: string;
  isCollapsed: boolean;
  node: Node;
};

type CanvasEventHandler = (event: CanvasEvent) => void;
type KeyboardEventHandler = (event: KeyboardEvent) => void;
type MouseEventHandler = (event: MouseEvent) => void;
type EventHandler = (event: Event) => void;
type ResizeHandler = (data: {
  info: ResizeInfo;
  style?: Style;
  seriesNumberWidth?: number;
}) => void;
type SelectedHandler = (cells: S2CellType[]) => void;
type SortedHandler = (rangeData: Data[]) => any;

export interface EmitterType {
  /** ================ Global ================  */
  [S2Event.GLOBAL_ACTION_ICON_CLICK]: CanvasEventHandler;
  [S2Event.GLOBAL_ACTION_ICON_HOVER]: CanvasEventHandler;
  [S2Event.GLOBAL_COPIED]: (data: string) => void;
  [S2Event.GLOBAL_KEYBOARD_DOWN]: KeyboardEventHandler;
  [S2Event.GLOBAL_KEYBOARD_UP]: KeyboardEventHandler;
  [S2Event.GLOBAL_MOUSE_UP]: MouseEventHandler;
  [S2Event.GLOBAL_MOUSE_MOVE]: MouseEventHandler;
  [S2Event.LAYOUT_RESIZE_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.LAYOUT_RESIZE_MOUSE_UP]: CanvasEventHandler;
  [S2Event.LAYOUT_RESIZE_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.GLOBAL_CONTEXT_MENU]: CanvasEventHandler;
  [S2Event.GLOBAL_RESET]: EventHandler;
  [S2Event.GLOBAL_HOVER]: CanvasEventHandler;
  [S2Event.GLOBAL_SELECTED]: SelectedHandler;

  /** ================ Sort ================  */
  [S2Event.RANGE_SORT]: (info: SortParams) => void;
  [S2Event.RANGE_SORTED]: SortedHandler | CanvasEventHandler;

  /** ================ Filter ================  */
  [S2Event.RANGE_FILTER]: (info: FilterParam) => void;
  [S2Event.RANGE_FILTERED]: (data: Data[]) => any;

  /** ================ Cell ================  */
  [S2Event.GLOBAL_LINK_FIELD_JUMP]: (data: {
    key: string;
    record: Data;
  }) => void;

  /** ================ Date Cell ================  */
  [S2Event.DATA_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.DATA_CELL_MOUSE_UP]: CanvasEventHandler;
  [S2Event.DATA_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.DATA_CELL_HOVER]: CanvasEventHandler;
  [S2Event.DATA_CELL_CLICK]: CanvasEventHandler;
  [S2Event.DATA_CELL_DOUBLE_CLICK]: CanvasEventHandler;
  [S2Event.DATA_CELL_TREND_ICON_CLICK]: (data: ViewMeta) => void;
  [S2Event.DATE_CELL_BRUSH_SELECTION]: (cells: DataCell[]) => void;

  /** ================ Row Cell ================  */
  [S2Event.ROW_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.ROW_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.ROW_CELL_HOVER]: CanvasEventHandler;
  [S2Event.ROW_CELL_CLICK]: CanvasEventHandler;
  [S2Event.ROW_CELL_DOUBLE_CLICK]: CanvasEventHandler;
  [S2Event.ROW_CELL_MOUSE_UP]: CanvasEventHandler;
  [S2Event.ROW_CELL_COLLAPSE_TREE_ROWS]: (
    data: RowCellCollapseTreeRowsType,
  ) => void;

  /** ================ Col Cell ================  */
  [S2Event.COL_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.COL_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.COL_CELL_HOVER]: CanvasEventHandler;
  [S2Event.COL_CELL_CLICK]: CanvasEventHandler;
  [S2Event.COL_CELL_DOUBLE_CLICK]: CanvasEventHandler;
  [S2Event.COL_CELL_MOUSE_UP]: CanvasEventHandler;

  /** ================ Corner Cell ================  */
  [S2Event.CORNER_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.CORNER_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.CORNER_CELL_HOVER]: CanvasEventHandler;
  [S2Event.CORNER_CELL_CLICK]: CanvasEventHandler;
  [S2Event.CORNER_CELL_DOUBLE_CLICK]: CanvasEventHandler;
  [S2Event.CORNER_CELL_MOUSE_UP]: CanvasEventHandler;

  /** ================ Merged Cells ================  */
  [S2Event.MERGED_CELLS_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_HOVER]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_MOUSE_UP]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_CLICK]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_DOUBLE_CLICK]: CanvasEventHandler;

  /** ================ Layout ================  */
  [S2Event.LAYOUT_COLLAPSE_ROWS]: (data: CollapsedRowsType) => void;
  [S2Event.LAYOUT_AFTER_COLLAPSE_ROWS]: (data: CollapsedRowsType) => void;
  [S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL]: (hierarchyCollapse: boolean) => void;
  [S2Event.LAYOUT_PAGINATION]: (data: {
    pageSize: number;
    pageCount: number;
    total: number;
    current: number;
  }) => void;
  [S2Event.LAYOUT_AFTER_HEADER_LAYOUT]: (data: LayoutResult) => void;
  [S2Event.LAYOUT_CELL_SCROLL]: (data: CellScrollPosition) => void;
  [S2Event.LAYOUT_COLS_EXPANDED]: (expandedNode: Node) => void;
  [S2Event.LAYOUT_COLS_HIDDEN]: (
    currentHiddenColumnsInfo: HiddenColumnsInfo,
    hiddenColumnsDetail: HiddenColumnsInfo[],
  ) => void;
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
