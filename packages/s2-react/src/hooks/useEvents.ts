import {
  EmitterType,
  getBaseCellData,
  S2Event,
  SpreadSheet,
  TargetCellInfo,
} from '@antv/s2';
import { useEffect } from 'react';
import { Event as GEvent } from '@antv/g-canvas';
import { BaseSheetComponentProps } from '@/components';

const useCellEvent = (
  eventName: keyof EmitterType,
  handler: (data: TargetCellInfo) => void,
  s2: SpreadSheet,
) => {
  useEffect(() => {
    const handlerFn = (event: GEvent) => {
      handler?.(getBaseCellData(event));
    };
    s2?.on(eventName, handlerFn);
    return () => {
      s2?.off(eventName, handlerFn);
    };
  }, [s2, handler]);
};

const useS2Event = (
  eventName: keyof EmitterType,
  handler: (args: any) => void,
  s2: SpreadSheet,
) => {
  useEffect(() => {
    const handlerFn = (args: any) => {
      handler?.(args);
    };
    s2?.on(eventName, handlerFn);
    return () => {
      s2?.off(eventName, handlerFn);
    };
  }, [s2, handler]);
};

export function useEvents(props: BaseSheetComponentProps, s2: SpreadSheet) {
  // ============== merged cell ====================
  useCellEvent(S2Event.MERGED_CELLS_CLICK, props.onMergedCellClick, s2);
  useCellEvent(
    S2Event.MERGED_CELLS_DOUBLE_CLICK,
    props.onMergedCellsDoubleClick,
    s2,
  );
  useCellEvent(S2Event.MERGED_CELLS_HOVER, props.onMergedCellHover, s2);

  // ============== row cell ====================
  useCellEvent(S2Event.ROW_CELL_CLICK, props.onRowCellClick, s2);
  useCellEvent(S2Event.ROW_CELL_DOUBLE_CLICK, props.onRowCellDoubleClick, s2);
  useCellEvent(S2Event.ROW_CELL_HOVER, props.onRowCellHover, s2);

  // ============== col cell ====================
  useCellEvent(S2Event.COL_CELL_CLICK, props.onColCellClick, s2);
  useCellEvent(S2Event.COL_CELL_DOUBLE_CLICK, props.onColCellDoubleClick, s2);
  useCellEvent(S2Event.COL_CELL_HOVER, props.onColCellHover, s2);

  // ============== data cell ====================
  useCellEvent(S2Event.DATA_CELL_CLICK, props.onDataCellClick, s2);
  useCellEvent(S2Event.DATA_CELL_DOUBLE_CLICK, props.onDataCellDoubleClick, s2);
  useCellEvent(S2Event.DATA_CELL_HOVER, props.onDataCellHover, s2);
  useCellEvent(S2Event.DATA_CELL_MOUSE_UP, props.onDataCellMouseUp, s2);
  useS2Event(
    S2Event.DATA_CELL_TREND_ICON_CLICK,
    props.onDataCellTrendIconClick,
    s2,
  );

  // ============== corner cell ====================
  useCellEvent(S2Event.CORNER_CELL_CLICK, props.onCornerCellClick, s2);
  useCellEvent(
    S2Event.CORNER_CELL_DOUBLE_CLICK,
    props.onCornerCellDoubleClick,
    s2,
  );
  useCellEvent(S2Event.CORNER_CELL_HOVER, props.onCornerCellHover, s2);

  // ============== layout ====================
  useS2Event(S2Event.LAYOUT_AFTER_HEADER_LAYOUT, props.onAfterHeaderLayout, s2);
  useS2Event(S2Event.LAYOUT_COLLAPSE_ROWS, props.onCollapseRows, s2);
  useS2Event(
    S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL,
    props.onCollapseRowsAll,
    s2,
  );
  useS2Event(S2Event.LAYOUT_CELL_SCROLL, props.onCellScroll, s2);
  useS2Event(S2Event.LAYOUT_AFTER_RENDER, props.onLoad, s2);
  useS2Event(S2Event.LAYOUT_DESTROY, props.onDestroy, s2);

  // ============== sort ====================
  useS2Event(S2Event.RANGE_SORT, props.onSortChange, s2);
}
