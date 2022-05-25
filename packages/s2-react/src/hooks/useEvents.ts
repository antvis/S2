import {
  getBaseCellData,
  S2Event,
  SpreadSheet,
  TargetCellInfo,
  GEvent,
} from '@antv/s2';
import React from 'react';
import { BaseSheetComponentProps } from '@/components';

export const useCellEvent = (
  eventName: S2Event,
  handler: (data: TargetCellInfo) => void,
  s2: SpreadSheet,
) => {
  React.useEffect(() => {
    const handlerFn = (event: GEvent) => {
      handler?.(getBaseCellData(event));
    };
    s2?.on(eventName, handlerFn);

    return () => {
      s2?.off(eventName, handlerFn);
    };
  }, [s2, handler, eventName]);
};

export const useS2Event = (
  eventName: S2Event,
  handler: (args: unknown) => void,
  s2: SpreadSheet,
) => {
  React.useEffect(() => {
    const handlerFn = (args: unknown) => {
      handler?.(args);
    };
    s2?.on(eventName, handlerFn);

    return () => {
      s2?.off(eventName, handlerFn);
    };
  }, [s2, handler, eventName]);
};

export function useEvents(props: BaseSheetComponentProps, s2: SpreadSheet) {
  // ============== Row Cell ====================
  useCellEvent(S2Event.ROW_CELL_HOVER, props.onRowCellHover, s2);
  useCellEvent(S2Event.ROW_CELL_CLICK, props.onRowCellClick, s2);
  useCellEvent(S2Event.ROW_CELL_DOUBLE_CLICK, props.onRowCellDoubleClick, s2);
  useCellEvent(S2Event.ROW_CELL_MOUSE_DOWN, props.onRowCellMouseDown, s2);
  useCellEvent(S2Event.ROW_CELL_MOUSE_UP, props.onRowCellMouseUp, s2);
  useCellEvent(S2Event.ROW_CELL_MOUSE_MOVE, props.onRowCellMouseMove, s2);
  useS2Event(
    S2Event.ROW_CELL_COLLAPSE_TREE_ROWS,
    props.onRowCellCollapseTreeRows,
    s2,
  );

  // ============== Col Cell ====================
  useCellEvent(S2Event.COL_CELL_HOVER, props.onColCellHover, s2);
  useCellEvent(S2Event.COL_CELL_CLICK, props.onColCellClick, s2);
  useCellEvent(S2Event.COL_CELL_DOUBLE_CLICK, props.onColCellDoubleClick, s2);
  useCellEvent(S2Event.COL_CELL_MOUSE_DOWN, props.onColCellMouseDown, s2);
  useCellEvent(S2Event.COL_CELL_MOUSE_UP, props.onColCellMouseUp, s2);
  useCellEvent(S2Event.COL_CELL_MOUSE_MOVE, props.onColCellMouseMove, s2);

  // ============== Data Cell ====================
  useCellEvent(S2Event.DATA_CELL_HOVER, props.onDataCellHover, s2);
  useCellEvent(S2Event.DATA_CELL_CLICK, props.onDataCellClick, s2);
  useCellEvent(S2Event.DATA_CELL_DOUBLE_CLICK, props.onDataCellDoubleClick, s2);
  useCellEvent(S2Event.DATA_CELL_MOUSE_DOWN, props.onDataCellMouseDown, s2);
  useCellEvent(S2Event.DATA_CELL_MOUSE_UP, props.onDataCellMouseUp, s2);
  useCellEvent(S2Event.DATA_CELL_MOUSE_MOVE, props.onDataCellMouseMove, s2);
  useS2Event(
    S2Event.DATA_CELL_TREND_ICON_CLICK,
    props.onDataCellTrendIconClick,
    s2,
  );
  useS2Event(
    S2Event.DATE_CELL_BRUSH_SELECTION,
    props.onDataCellBrushSelection,
    s2,
  );

  // ============== Corner Cell ====================
  useCellEvent(S2Event.CORNER_CELL_HOVER, props.onCornerCellHover, s2);
  useCellEvent(S2Event.CORNER_CELL_CLICK, props.onCornerCellClick, s2);
  useCellEvent(
    S2Event.CORNER_CELL_DOUBLE_CLICK,
    props.onCornerCellDoubleClick,
    s2,
  );
  useCellEvent(S2Event.CORNER_CELL_MOUSE_DOWN, props.onCornerCellMouseDown, s2);
  useCellEvent(S2Event.CORNER_CELL_MOUSE_UP, props.onCornerCellMouseUp, s2);
  useCellEvent(S2Event.CORNER_CELL_MOUSE_MOVE, props.onCornerCellMouseMove, s2);

  // ============== Merged Cells ====================
  useCellEvent(S2Event.MERGED_CELLS_HOVER, props.onMergedCellsHoverer, s2);
  useCellEvent(S2Event.MERGED_CELLS_CLICK, props.onMergedCellClick, s2);
  useCellEvent(
    S2Event.MERGED_CELLS_DOUBLE_CLICK,
    props.onMergedCellsDoubleClick,
    s2,
  );

  useCellEvent(
    S2Event.MERGED_CELLS_MOUSE_DOWN,
    props.onMergedCellsMouseDown,
    s2,
  );
  useCellEvent(S2Event.MERGED_CELLS_MOUSE_UP, props.onMergedCellsMouseUp, s2);
  useCellEvent(
    S2Event.MERGED_CELLS_MOUSE_MOVE,
    props.onMergedCellsMouseMove,
    s2,
  );

  // ============== Sort ====================
  useS2Event(S2Event.RANGE_SORT, props.onRangeSort, s2);
  useS2Event(S2Event.RANGE_SORTED, props.onRangeSorted, s2);

  // ============== Filter ====================
  useS2Event(S2Event.RANGE_FILTER, props.onRangeFilter, s2);
  useS2Event(S2Event.RANGE_FILTERED, props.onRangeFiltered, s2);

  // ============== Layout ====================
  useS2Event(
    S2Event.LAYOUT_AFTER_HEADER_LAYOUT,
    props.onLayoutAfterHeaderLayout,
    s2,
  );
  useS2Event(S2Event.LAYOUT_PAGINATION, props.onLayoutPagination, s2);
  useS2Event(S2Event.LAYOUT_CELL_SCROLL, props.onLayoutCellScroll, s2);
  useS2Event(
    S2Event.LAYOUT_AFTER_COLLAPSE_ROWS,
    props.onLayoutAfterCollapseRows,
    s2,
  );
  useS2Event(
    S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL,
    props.onCollapseRowsAll,
    s2,
  );
  useS2Event(S2Event.LAYOUT_COLS_EXPANDED, props.onLayoutColsExpanded, s2);
  useS2Event(S2Event.LAYOUT_COLS_HIDDEN, props.onLayoutColsHidden, s2);

  useS2Event(S2Event.LAYOUT_BEFORE_RENDER, props.onBeforeRender, s2);
  useS2Event(S2Event.LAYOUT_AFTER_RENDER, props.onAfterRender, s2);
  useS2Event(S2Event.LAYOUT_DESTROY, props.onDestroy, s2);

  // ============== Resize ====================
  useS2Event(S2Event.LAYOUT_RESIZE, props.onLayoutResize, s2);
  useS2Event(
    S2Event.LAYOUT_RESIZE_SERIES_WIDTH,
    props.onLayoutResizeSeriesWidth,
    s2,
  );
  useS2Event(S2Event.LAYOUT_RESIZE_ROW_WIDTH, props.onLayoutResizeRowWidth, s2);
  useS2Event(
    S2Event.LAYOUT_RESIZE_ROW_HEIGHT,
    props.onLayoutResizeRowHeight,
    s2,
  );
  useS2Event(S2Event.LAYOUT_RESIZE_COL_WIDTH, props.onLayoutResizeColWidth, s2);
  useS2Event(
    S2Event.LAYOUT_RESIZE_COL_HEIGHT,
    props.onLayoutResizeColHeight,
    s2,
  );
  useS2Event(
    S2Event.LAYOUT_RESIZE_TREE_WIDTH,
    props.onLayoutResizeTreeWidth,
    s2,
  );
  useS2Event(
    S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
    props.onLayoutResizeMouseDown,
    s2,
  );
  useS2Event(S2Event.LAYOUT_RESIZE_MOUSE_UP, props.onLayoutResizeMouseUp, s2);
  useS2Event(
    S2Event.LAYOUT_RESIZE_MOUSE_MOVE,
    props.onLayoutResizeMouseMove,
    s2,
  );

  // ============== Global ====================
  useS2Event(S2Event.GLOBAL_KEYBOARD_DOWN, props.onKeyBoardDown, s2);
  useS2Event(S2Event.GLOBAL_KEYBOARD_UP, props.onKeyBoardUp, s2);
  useS2Event(S2Event.GLOBAL_COPIED, props.onCopied, s2);
  useS2Event(S2Event.GLOBAL_ACTION_ICON_HOVER, props.onActionIconHover, s2);
  useS2Event(S2Event.GLOBAL_ACTION_ICON_CLICK, props.onActionIconClick, s2);
  useS2Event(S2Event.GLOBAL_CONTEXT_MENU, props.onContextMenu, s2);
  useS2Event(S2Event.GLOBAL_HOVER, props.onMouseHover, s2);
  useS2Event(S2Event.GLOBAL_SELECTED, props.onSelected, s2);
  useS2Event(S2Event.GLOBAL_MOUSE_UP, props.onMouseUp, s2);
  useS2Event(S2Event.GLOBAL_RESET, props.onReset, s2);
  useS2Event(S2Event.GLOBAL_LINK_FIELD_JUMP, props.onLinkFieldJump, s2);
}
