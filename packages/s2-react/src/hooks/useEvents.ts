/* eslint-disable max-lines-per-function */
import {
  GEvent,
  S2Event,
  SpreadSheet,
  getBaseCellData,
  type EmitterType,
  type TargetCellInfo,
} from '@antv/s2';
import React from 'react';
import type { SheetComponentsProps } from '../components';

export const useCellEvent = (
  eventName: S2Event,
  handler: ((data: TargetCellInfo) => void) | undefined,
  s2: SpreadSheet,
) => {
  React.useLayoutEffect(() => {
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
  handler: ((...args: any[]) => void) | undefined,
  s2: SpreadSheet,
  emitBeforeOff = false,
) => {
  React.useLayoutEffect(() => {
    const handlerFn: EmitterType[S2Event] = (...args: any[]) => {
      handler?.(...args);
    };

    s2?.on(eventName, handlerFn);

    return () => {
      if (emitBeforeOff) {
        s2?.emit(eventName);
      }

      s2?.off(eventName, handlerFn);
    };
  }, [s2, handler, eventName]);
};

export function useEvents(props: SheetComponentsProps, s2: SpreadSheet) {
  // ============== Row Cell ====================
  useCellEvent(S2Event.ROW_CELL_HOVER, props.onRowCellHover, s2);
  useCellEvent(S2Event.ROW_CELL_CLICK, props.onRowCellClick, s2);
  useCellEvent(S2Event.ROW_CELL_DOUBLE_CLICK, props.onRowCellDoubleClick, s2);
  useCellEvent(S2Event.ROW_CELL_CONTEXT_MENU, props.onRowCellContextMenu, s2);
  useCellEvent(S2Event.ROW_CELL_MOUSE_DOWN, props.onRowCellMouseDown, s2);
  useCellEvent(S2Event.ROW_CELL_MOUSE_UP, props.onRowCellMouseUp, s2);
  useCellEvent(S2Event.ROW_CELL_MOUSE_MOVE, props.onRowCellMouseMove, s2);
  useS2Event(S2Event.ROW_CELL_SCROLL, props.onRowCellScroll, s2);
  useS2Event(S2Event.ROW_CELL_COLLAPSED, props.onRowCellCollapsed, s2);
  useS2Event(S2Event.ROW_CELL_ALL_COLLAPSED, props.onRowCellAllCollapsed, s2);
  useS2Event(S2Event.ROW_CELL_RENDER, props.onRowCellRender, s2);

  // ============== Col Cell ====================
  useCellEvent(S2Event.COL_CELL_HOVER, props.onColCellHover, s2);
  useCellEvent(S2Event.COL_CELL_CLICK, props.onColCellClick, s2);
  useCellEvent(S2Event.COL_CELL_DOUBLE_CLICK, props.onColCellDoubleClick, s2);
  useCellEvent(S2Event.COL_CELL_CONTEXT_MENU, props.onColCellContextMenu, s2);
  useCellEvent(S2Event.COL_CELL_MOUSE_DOWN, props.onColCellMouseDown, s2);
  useCellEvent(S2Event.COL_CELL_MOUSE_UP, props.onColCellMouseUp, s2);
  useCellEvent(S2Event.COL_CELL_MOUSE_MOVE, props.onColCellMouseMove, s2);
  useS2Event(S2Event.COL_CELL_EXPANDED, props.onColCellExpanded, s2);
  useS2Event(S2Event.COL_CELL_HIDDEN, props.onColCellHidden, s2);
  useS2Event(S2Event.COL_CELL_RENDER, props.onColCellRender, s2);

  // ============== Data Cell ====================
  useCellEvent(S2Event.DATA_CELL_HOVER, props.onDataCellHover, s2);
  useCellEvent(S2Event.DATA_CELL_CLICK, props.onDataCellClick, s2);
  useCellEvent(S2Event.DATA_CELL_DOUBLE_CLICK, props.onDataCellDoubleClick, s2);
  useCellEvent(S2Event.DATA_CELL_CONTEXT_MENU, props.onDataCellContextMenu, s2);
  useCellEvent(S2Event.DATA_CELL_MOUSE_DOWN, props.onDataCellMouseDown, s2);
  useCellEvent(S2Event.DATA_CELL_MOUSE_UP, props.onDataCellMouseUp, s2);
  useCellEvent(S2Event.DATA_CELL_MOUSE_MOVE, props.onDataCellMouseMove, s2);
  useS2Event(
    S2Event.DATA_CELL_BRUSH_SELECTION,
    props.onDataCellBrushSelection,
    s2,
  );
  useS2Event(S2Event.DATA_CELL_SELECT_MOVE, props.onDataCellSelectMove, s2);
  useS2Event(S2Event.DATA_CELL_RENDER, props.onDataCellRender, s2);

  // ============== Corner Cell ====================
  useCellEvent(S2Event.CORNER_CELL_HOVER, props.onCornerCellHover, s2);
  useCellEvent(S2Event.CORNER_CELL_CLICK, props.onCornerCellClick, s2);
  useCellEvent(
    S2Event.CORNER_CELL_DOUBLE_CLICK,
    props.onCornerCellDoubleClick,
    s2,
  );
  useCellEvent(
    S2Event.CORNER_CELL_CONTEXT_MENU,
    props.onCornerCellContextMenu,
    s2,
  );
  useCellEvent(S2Event.CORNER_CELL_MOUSE_DOWN, props.onCornerCellMouseDown, s2);
  useCellEvent(S2Event.CORNER_CELL_MOUSE_UP, props.onCornerCellMouseUp, s2);
  useCellEvent(S2Event.CORNER_CELL_MOUSE_MOVE, props.onCornerCellMouseMove, s2);
  useS2Event(S2Event.CORNER_CELL_RENDER, props.onCornerCellRender, s2);

  // ============== Merged Cells ====================
  useCellEvent(S2Event.MERGED_CELLS_HOVER, props.onMergedCellsHover, s2);
  useCellEvent(S2Event.MERGED_CELLS_CLICK, props.onMergedCellsClick, s2);
  useCellEvent(
    S2Event.MERGED_CELLS_DOUBLE_CLICK,
    props.onMergedCellsDoubleClick,
    s2,
  );
  useCellEvent(
    S2Event.MERGED_CELLS_CONTEXT_MENU,
    props.onMergedCellsContextMenu,
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
  useS2Event(S2Event.MERGED_CELLS_RENDER, props.onMergedCellsRender, s2);

  /** ================ SeriesNumber Cell ================  */
  useS2Event(
    S2Event.SERIES_NUMBER_CELL_RENDER,
    props.onSeriesNumberCellRender,
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
  useS2Event(S2Event.LAYOUT_CELL_RENDER, props.onLayoutCellRender, s2);
  useS2Event(S2Event.LAYOUT_BEFORE_RENDER, props.onBeforeRender, s2);
  useS2Event(S2Event.LAYOUT_AFTER_RENDER, props.onAfterRender, s2);
  useS2Event(S2Event.LAYOUT_DESTROY, props.onDestroy, s2, true);

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
  useS2Event(S2Event.GLOBAL_CLICK, props.onClick, s2);
  useS2Event(S2Event.GLOBAL_DOUBLE_CLICK, props.onDoubleClick, s2);
  useS2Event(S2Event.GLOBAL_SELECTED, props.onSelected, s2);
  useS2Event(S2Event.GLOBAL_MOUSE_UP, props.onMouseUp, s2);
  useS2Event(S2Event.GLOBAL_RESET, props.onReset, s2);
  useS2Event(S2Event.GLOBAL_LINK_FIELD_JUMP, props.onLinkFieldJump, s2);
  useS2Event(S2Event.GLOBAL_SCROLL, props.onScroll, s2);
  // ============== Auto 自动生成的 ================
  useS2Event(
    S2Event.LAYOUT_AFTER_REAL_DATA_CELL_RENDER,
    props.onLayoutAfterRealDataCellRender,
    s2,
  );
  useS2Event(
    S2Event.ROW_CELL_BRUSH_SELECTION,
    props.onRowCellBrushSelection,
    s2,
  );
  useS2Event(
    S2Event.COL_CELL_BRUSH_SELECTION,
    props.onColCellBrushSelection,
    s2,
  );
}
