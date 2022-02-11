import {
  SpreadSheet,
  S2Event,
  getBaseCellData,
  CellScrollPosition,
  SortParams,
  EmitterType,
  ViewMeta,
  LayoutResult,
} from '@antv/s2';
import React from 'react';
import { Event as GEvent } from '@antv/g-canvas';
import { forIn } from 'lodash';
import { BaseSheetComponentProps } from '../components/sheets/interface';

export function useEvents(props: BaseSheetComponentProps) {
  const registerEvent = React.useCallback(
    (s2: SpreadSheet) => {
      const EVENT_LISTENER_CONFIG: Record<
        string,
        (...args: unknown[]) => void
      > = {
        // ============== merged cell ====================
        [S2Event.MERGED_CELLS_CLICK]: (event: GEvent) => {
          props.onMergedCellClick?.(getBaseCellData(event));
        },
        [S2Event.MERGED_CELLS_HOVER]: (event: GEvent) => {
          props.onMergedCellHover?.(getBaseCellData(event));
        },
        [S2Event.MERGED_CELLS_DOUBLE_CLICK]: (event: GEvent) => {
          props.onMergedCellsDoubleClick?.(getBaseCellData(event));
        },

        // ============== row cell ====================
        [S2Event.ROW_CELL_CLICK]: (event: GEvent) => {
          props.onRowCellClick?.(getBaseCellData(event));
        },
        [S2Event.ROW_CELL_HOVER]: (event: GEvent) => {
          props.onRowCellHover?.(getBaseCellData(event));
        },
        [S2Event.ROW_CELL_DOUBLE_CLICK]: (event: GEvent) => {
          props.onRowCellDoubleClick?.(getBaseCellData(event));
        },

        // ============== col cell ====================
        [S2Event.COL_CELL_CLICK]: (event: GEvent) => {
          props.onColCellClick?.(getBaseCellData(event));
        },
        [S2Event.COL_CELL_HOVER]: (event: GEvent) => {
          props.onColCellHover?.(getBaseCellData(event));
        },
        [S2Event.COL_CELL_DOUBLE_CLICK]: (event: GEvent) => {
          props.onColCellDoubleClick?.(getBaseCellData(event));
        },

        // ============== data cell ====================
        [S2Event.DATA_CELL_DOUBLE_CLICK]: (event: GEvent) => {
          props.onDataCellDoubleClick?.(getBaseCellData(event));
        },
        [S2Event.DATA_CELL_CLICK]: (event: GEvent) => {
          props.onDataCellClick?.(getBaseCellData(event));
        },
        [S2Event.DATA_CELL_HOVER]: (event: GEvent) => {
          props.onDataCellHover?.(getBaseCellData(event));
        },
        [S2Event.DATA_CELL_MOUSE_UP]: (event: GEvent) => {
          props.onDataCellMouseUp?.(getBaseCellData(event));
        },
        [S2Event.DATA_CELL_TREND_ICON_CLICK]: (meta: ViewMeta) => {
          props.onDataCellTrendIconClick?.(meta);
        },

        // ============== corner cell ====================
        [S2Event.CORNER_CELL_DOUBLE_CLICK]: (event: GEvent) => {
          props.onCornerCellDoubleClick?.(getBaseCellData(event));
        },
        [S2Event.CORNER_CELL_HOVER]: (event: GEvent) => {
          props.onCornerCellHover?.(getBaseCellData(event));
        },
        [S2Event.CORNER_CELL_CLICK]: (event: GEvent) => {
          props.onCornerCellClick?.(getBaseCellData(event));
        },

        // ============== layout ====================
        [S2Event.LAYOUT_AFTER_HEADER_LAYOUT]: (layoutResult: LayoutResult) => {
          props.onAfterHeaderLayout?.(layoutResult);
        },
        [S2Event.LAYOUT_COLLAPSE_ROWS]: (
          collapsedRows: Record<string, boolean>,
        ) => {
          props.onCollapseRows?.(collapsedRows);
        },
        [S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL]: (
          hierarchyCollapse: boolean,
        ) => {
          props.onCollapseRowsAll?.(hierarchyCollapse);
        },
        [S2Event.LAYOUT_CELL_SCROLL]: (value: CellScrollPosition) => {
          props.onCellScroll?.(value);
        },
        [S2Event.LAYOUT_AFTER_RENDER]: () => {
          props.onLoad?.();
        },
        [S2Event.LAYOUT_DESTROY]: () => {
          props.onDestroy?.();
        },

        // ============== sort ====================
        [S2Event.RANGE_SORT]: (value: SortParams) => {
          props.onSortChange?.(value);
        },
      };

      forIn(EVENT_LISTENER_CONFIG, (handler, event: keyof EmitterType) => {
        s2?.on(event, handler);
      });
    },
    [props],
  );

  return { registerEvent };
}
