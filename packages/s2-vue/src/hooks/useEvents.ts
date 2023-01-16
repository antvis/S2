/* eslint-disable max-lines-per-function */
import { S2Event, type SpreadSheet, getBaseCellData, GEvent } from '@antv/s2';
import { onMounted, type Ref } from 'vue';
import type { BaseSheetInitEmits, EmitFn } from './../interface';

const useCellEvent = (
  s2Ref: Ref<SpreadSheet | undefined>,
  emit: EmitFn<BaseSheetInitEmits>,
  eventName: S2Event,
  emitName: keyof BaseSheetInitEmits,
) => {
  const handler = (event: GEvent) => {
    const param = getBaseCellData(event);

    emit(emitName as any, param);
  };

  s2Ref.value?.on(eventName, handler);
};

const useS2Event = (
  s2Ref: Ref<SpreadSheet | undefined>,
  emit: EmitFn<BaseSheetInitEmits>,
  eventName: S2Event,
  emitName: keyof BaseSheetInitEmits,
) => {
  const handler = (params: any) => {
    emit(emitName as any, params);
  };

  s2Ref.value?.on(eventName, handler);
};

export const useEvents = (
  s2Ref: Ref<SpreadSheet | undefined>,
  emit: EmitFn<BaseSheetInitEmits>,
) => {
  onMounted(() => {
    if (!s2Ref.value) {
      return;
    }

    // ============== Row Cell ====================
    useCellEvent(s2Ref, emit, S2Event.ROW_CELL_HOVER, 'rowCellHover');
    useCellEvent(s2Ref, emit, S2Event.ROW_CELL_CLICK, 'rowCellClick');
    useCellEvent(
      s2Ref,
      emit,
      S2Event.ROW_CELL_DOUBLE_CLICK,
      'rowCellDoubleClick',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.ROW_CELL_CONTEXT_MENU,
      'rowCellContextMenu',
    );
    useCellEvent(s2Ref, emit, S2Event.ROW_CELL_MOUSE_DOWN, 'rowCellMouseDown');
    useCellEvent(s2Ref, emit, S2Event.ROW_CELL_MOUSE_UP, 'rowCellMouseUp');
    useCellEvent(s2Ref, emit, S2Event.ROW_CELL_MOUSE_MOVE, 'rowCellMouseMove');
    useS2Event(s2Ref, emit, S2Event.ROW_CELL_COLLAPSED, 'rowCellCollapsed');
    useS2Event(
      s2Ref,
      emit,
      S2Event.ROW_CELL_ALL_COLLAPSED,
      'rowCellAllCollapsed',
    );
    useS2Event(s2Ref, emit, S2Event.ROW_CELL_SCROLL, 'rowCellScroll');

    // ============== Col Cell ====================
    useCellEvent(s2Ref, emit, S2Event.COL_CELL_HOVER, 'colCellHover');
    useCellEvent(s2Ref, emit, S2Event.COL_CELL_CLICK, 'colCellClick');
    useCellEvent(
      s2Ref,
      emit,
      S2Event.COL_CELL_DOUBLE_CLICK,
      'colCellDoubleClick',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.COL_CELL_CONTEXT_MENU,
      'colCellContextMenu',
    );
    useCellEvent(s2Ref, emit, S2Event.COL_CELL_MOUSE_DOWN, 'colCellMouseDown');
    useCellEvent(s2Ref, emit, S2Event.COL_CELL_MOUSE_UP, 'colCellMouseUp');
    useCellEvent(s2Ref, emit, S2Event.COL_CELL_MOUSE_MOVE, 'colCellMouseMove');
    useS2Event(s2Ref, emit, S2Event.COL_CELL_EXPANDED, 'colCellExpanded');
    useS2Event(s2Ref, emit, S2Event.COL_CELL_HIDDEN, 'colCellHidden');

    // ============== Data Cell ====================
    useCellEvent(s2Ref, emit, S2Event.DATA_CELL_HOVER, 'dataCellHover');
    useCellEvent(s2Ref, emit, S2Event.DATA_CELL_CLICK, 'dataCellClick');
    useCellEvent(
      s2Ref,
      emit,
      S2Event.DATA_CELL_DOUBLE_CLICK,
      'dataCellDoubleClick',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.DATA_CELL_CONTEXT_MENU,
      'dataCellContextMenu',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.DATA_CELL_MOUSE_DOWN,
      'dataCellMouseDown',
    );
    useCellEvent(s2Ref, emit, S2Event.DATA_CELL_MOUSE_UP, 'dataCellMouseUp');
    useCellEvent(
      s2Ref,
      emit,
      S2Event.DATA_CELL_MOUSE_MOVE,
      'dataCellMouseMove',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.DATA_CELL_BRUSH_SELECTION,
      'dataCellBrushSelection',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.DATA_CELL_SELECT_MOVE,
      'dataCellSelectMove',
    );

    // ============== Corner Cell ====================
    useCellEvent(s2Ref, emit, S2Event.CORNER_CELL_HOVER, 'cornerCellHover');
    useCellEvent(s2Ref, emit, S2Event.CORNER_CELL_CLICK, 'cornerCellClick');
    useCellEvent(
      s2Ref,
      emit,
      S2Event.CORNER_CELL_DOUBLE_CLICK,
      'cornerCellDoubleClick',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.CORNER_CELL_CONTEXT_MENU,
      'cornerCellContextMenu',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.CORNER_CELL_MOUSE_DOWN,
      'cornerCellMouseDown',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.CORNER_CELL_MOUSE_UP,
      'cornerCellMouseUp',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.CORNER_CELL_MOUSE_MOVE,
      'cornerCellMouseMove',
    );

    // ============== Merged Cells ====================
    useCellEvent(s2Ref, emit, S2Event.MERGED_CELLS_HOVER, 'mergedCellsHover');
    useCellEvent(s2Ref, emit, S2Event.MERGED_CELLS_CLICK, 'mergedCellsClick');
    useCellEvent(
      s2Ref,
      emit,
      S2Event.MERGED_CELLS_DOUBLE_CLICK,
      'mergedCellsDoubleClick',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.MERGED_CELLS_CONTEXT_MENU,
      'mergedCellsContextMenu',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.MERGED_CELLS_MOUSE_DOWN,
      'mergedCellsMouseDown',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.MERGED_CELLS_MOUSE_UP,
      'mergedCellsMouseUp',
    );
    useCellEvent(
      s2Ref,
      emit,
      S2Event.MERGED_CELLS_MOUSE_MOVE,
      'mergedCellsMouseMove',
    );

    // ============== Sort ====================
    useS2Event(s2Ref, emit, S2Event.RANGE_SORT, 'rangeSort');
    useS2Event(s2Ref, emit, S2Event.RANGE_SORTED, 'rangeSorted');

    // ============== Filter ====================
    useS2Event(s2Ref, emit, S2Event.RANGE_FILTER, 'rangeFilter');
    useS2Event(s2Ref, emit, S2Event.RANGE_FILTERED, 'rangeFiltered');

    // ============== Layout ====================
    useS2Event(
      s2Ref,
      emit,
      S2Event.LAYOUT_AFTER_HEADER_LAYOUT,
      'layoutAfterHeaderLayout',
    );
    useS2Event(s2Ref, emit, S2Event.LAYOUT_PAGINATION, 'layoutPagination');
    useS2Event(s2Ref, emit, S2Event.LAYOUT_BEFORE_RENDER, 'beforeRender');
    useS2Event(s2Ref, emit, S2Event.LAYOUT_AFTER_RENDER, 'afterRender');
    useS2Event(s2Ref, emit, S2Event.LAYOUT_DESTROY, 'destroy');

    // ============== Resize ====================
    useS2Event(s2Ref, emit, S2Event.LAYOUT_RESIZE, 'layoutResize');
    useS2Event(
      s2Ref,
      emit,
      S2Event.LAYOUT_RESIZE_SERIES_WIDTH,
      'layoutResizeSeriesWidth',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.LAYOUT_RESIZE_ROW_WIDTH,
      'layoutResizeRowWidth',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.LAYOUT_RESIZE_ROW_HEIGHT,
      'layoutResizeRowHeight',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.LAYOUT_RESIZE_COL_WIDTH,
      'layoutResizeColWidth',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.LAYOUT_RESIZE_COL_HEIGHT,
      'layoutResizeColHeight',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.LAYOUT_RESIZE_TREE_WIDTH,
      'layoutResizeTreeWidth',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.LAYOUT_RESIZE_MOUSE_DOWN,
      'layoutResizeMouseDown',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.LAYOUT_RESIZE_MOUSE_UP,
      'layoutResizeMouseUp',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.LAYOUT_RESIZE_MOUSE_MOVE,
      'layoutResizeMouseMove',
    );

    // ============== Global ====================
    useS2Event(s2Ref, emit, S2Event.GLOBAL_KEYBOARD_DOWN, 'keyBoardDown');
    useS2Event(s2Ref, emit, S2Event.GLOBAL_KEYBOARD_UP, 'keyBoardUp');
    useS2Event(s2Ref, emit, S2Event.GLOBAL_COPIED, 'copied');
    useS2Event(
      s2Ref,
      emit,
      S2Event.GLOBAL_ACTION_ICON_HOVER,
      'actionIconHover',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.GLOBAL_ACTION_ICON_CLICK,
      'actionIconClick',
    );
    useS2Event(s2Ref, emit, S2Event.GLOBAL_CONTEXT_MENU, 'contextMenu');
    useS2Event(s2Ref, emit, S2Event.GLOBAL_HOVER, 'mouseHover');
    useS2Event(s2Ref, emit, S2Event.GLOBAL_CLICK, 'click');
    useS2Event(s2Ref, emit, S2Event.GLOBAL_DOUBLE_CLICK, 'doubleClick');
    useS2Event(s2Ref, emit, S2Event.GLOBAL_SELECTED, 'selected');
    useS2Event(s2Ref, emit, S2Event.GLOBAL_MOUSE_UP, 'mouseUp');
    useS2Event(s2Ref, emit, S2Event.GLOBAL_RESET, 'reset');
    useS2Event(s2Ref, emit, S2Event.GLOBAL_LINK_FIELD_JUMP, 'linkFieldJump');
    useS2Event(s2Ref, emit, S2Event.GLOBAL_SCROLL, 'scroll');

    // ============== Auto 自动生成的 ================
    useS2Event(
      s2Ref,
      emit,
      S2Event.LAYOUT_AFTER_REAL_DATA_CELL_RENDER,
      'layoutAfterRealDataCellRender',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.ROW_CELL_BRUSH_SELECTION,
      'rowCellBrushSelection',
    );
    useS2Event(
      s2Ref,
      emit,
      S2Event.COL_CELL_BRUSH_SELECTION,
      'colCellBrushSelection',
    );
  });
};
