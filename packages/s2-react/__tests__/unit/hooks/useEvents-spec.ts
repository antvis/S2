import { renderHook, act } from '@testing-library/react-hooks';
import { PivotSheet, S2Event, S2Options, SpreadSheet, GEvent } from '@antv/s2';
import { createMockCellInfo, getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { BaseSheetComponentProps } from '../../../src/components';
import { useCellEvent, useEvents, useS2Event } from '@/hooks';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hdAdapter: false,
};

const S2EventCases = [
  {
    event: S2Event.ROW_CELL_COLLAPSE_TREE_ROWS,
    name: 'onRowCellCollapseTreeRows',
  },
  {
    event: S2Event.DATA_CELL_TREND_ICON_CLICK,
    name: 'onDataCellTrendIconClick',
  },
  {
    event: S2Event.DATE_CELL_BRUSH_SELECTION,
    name: 'onDataCellBrushSelection',
  },
  {
    event: S2Event.RANGE_SORT,
    name: 'onRangeSort',
  },
  {
    event: S2Event.RANGE_SORTED,
    name: 'onRangeSorted',
  },
  {
    event: S2Event.RANGE_FILTER,
    name: 'onRangeFilter',
  },
  {
    event: S2Event.RANGE_FILTERED,
    name: 'onRangeFiltered',
  },
  {
    event: S2Event.LAYOUT_AFTER_HEADER_LAYOUT,
    name: 'onLayoutAfterHeaderLayout',
  },

  {
    event: S2Event.LAYOUT_PAGINATION,
    name: 'onLayoutPagination',
  },
  {
    event: S2Event.LAYOUT_AFTER_COLLAPSE_ROWS,
    name: 'onLayoutAfterCollapseRows',
  },
  {
    event: S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL,
    name: 'onCollapseRowsAll',
  },
  {
    event: S2Event.LAYOUT_COLS_EXPANDED,
    name: 'onLayoutColsExpanded',
  },
  {
    event: S2Event.LAYOUT_COLS_HIDDEN,
    name: 'onLayoutColsHidden',
  },
  {
    event: S2Event.LAYOUT_BEFORE_RENDER,
    name: 'onBeforeRender',
  },
  {
    event: S2Event.LAYOUT_AFTER_RENDER,
    name: 'onAfterRender',
  },
  {
    event: S2Event.LAYOUT_DESTROY,
    name: 'onDestroy',
  },
  {
    event: S2Event.LAYOUT_RESIZE,
    name: 'onLayoutResize',
  },
  {
    event: S2Event.LAYOUT_RESIZE_SERIES_WIDTH,
    name: 'onLayoutResizeSeriesWidth',
  },
  {
    event: S2Event.LAYOUT_RESIZE_ROW_WIDTH,
    name: 'onLayoutResizeRowWidth',
  },
  {
    event: S2Event.LAYOUT_RESIZE_ROW_HEIGHT,
    name: 'onLayoutResizeRowHeight',
  },
  {
    event: S2Event.LAYOUT_RESIZE_COL_WIDTH,
    name: 'onLayoutResizeColWidth',
  },
  {
    event: S2Event.LAYOUT_RESIZE_COL_HEIGHT,
    name: 'onLayoutResizeColHeight',
  },
  {
    event: S2Event.LAYOUT_RESIZE_TREE_WIDTH,
    name: 'onLayoutResizeTreeWidth',
  },
  {
    event: S2Event.LAYOUT_RESIZE_MOUSE_UP,
    name: 'onLayoutResizeMouseUp',
  },
  {
    event: S2Event.LAYOUT_RESIZE_MOUSE_MOVE,
    name: 'onLayoutResizeMouseMove',
  },
  {
    event: S2Event.GLOBAL_KEYBOARD_DOWN,
    name: 'onKeyBoardDown',
  },
  {
    event: S2Event.GLOBAL_KEYBOARD_UP,
    name: 'onKeyBoardUp',
  },
  {
    event: S2Event.GLOBAL_COPIED,
    name: 'onCopied',
  },
  {
    event: S2Event.GLOBAL_ACTION_ICON_HOVER,
    name: 'onActionIconHover',
  },
  {
    event: S2Event.GLOBAL_ACTION_ICON_CLICK,
    name: 'onActionIconClick',
  },
  {
    event: S2Event.GLOBAL_CONTEXT_MENU,
    name: 'onContextMenu',
  },
  {
    event: S2Event.GLOBAL_HOVER,
    name: 'onMouseHover',
  },
  {
    event: S2Event.GLOBAL_SELECTED,
    name: 'onSelected',
  },
  {
    event: S2Event.GLOBAL_MOUSE_UP,
    name: 'onMouseUp',
  },
  {
    event: S2Event.GLOBAL_RESET,
    name: 'onReset',
  },
  {
    event: S2Event.GLOBAL_LINK_FIELD_JUMP,
    name: 'onLinkFieldJump',
  },
].map((i) => ({
  ...i,
  eventHook: useS2Event,
  // 在测试中，模拟 toString 方法，方便使用 %s 打印出 name
  toString: () => i.name,
}));

const cellEventCases = [
  {
    event: S2Event.ROW_CELL_HOVER,
    name: 'onRowCellHover',
  },
  {
    event: S2Event.ROW_CELL_CLICK,
    name: 'onRowCellClick',
  },
  {
    event: S2Event.ROW_CELL_DOUBLE_CLICK,
    name: 'onRowCellDoubleClick',
  },
  {
    event: S2Event.ROW_CELL_MOUSE_DOWN,
    name: 'onRowCellMouseDown',
  },
  {
    event: S2Event.ROW_CELL_MOUSE_UP,
    name: 'onRowCellMouseUp',
  },
  {
    event: S2Event.ROW_CELL_MOUSE_MOVE,
    name: 'onRowCellMouseMove',
  },
  {
    event: S2Event.ROW_CELL_COLLAPSE_TREE_ROWS,
    name: 'onRowCellCollapseTreeRows',
  },
  {
    event: S2Event.COL_CELL_HOVER,
    name: 'onColCellHover',
  },
  {
    event: S2Event.COL_CELL_CLICK,
    name: 'onColCellClick',
  },
  {
    event: S2Event.COL_CELL_DOUBLE_CLICK,
    name: 'onColCellDoubleClick',
  },
  {
    event: S2Event.COL_CELL_MOUSE_DOWN,
    name: 'onColCellMouseDown',
  },
  {
    event: S2Event.COL_CELL_MOUSE_UP,
    name: 'onColCellMouseUp',
  },
  {
    event: S2Event.COL_CELL_MOUSE_MOVE,
    name: 'onColCellMouseMove',
  },
  {
    event: S2Event.DATA_CELL_HOVER,
    name: 'onDataCellHover',
  },
  {
    event: S2Event.DATA_CELL_CLICK,
    name: 'onDataCellClick',
  },
  {
    event: S2Event.DATA_CELL_DOUBLE_CLICK,
    name: 'onDataCellDoubleClick',
  },
  {
    event: S2Event.DATA_CELL_MOUSE_DOWN,
    name: 'onDataCellMouseDown',
  },
  {
    event: S2Event.DATA_CELL_MOUSE_UP,
    name: 'onDataCellMouseUp',
  },
  {
    event: S2Event.DATA_CELL_MOUSE_MOVE,
    name: 'onDataCellMouseMove',
  },
  {
    event: S2Event.CORNER_CELL_HOVER,
    name: 'onCornerCellHover',
  },
  {
    event: S2Event.CORNER_CELL_CLICK,
    name: 'onCornerCellClick',
  },
  {
    event: S2Event.CORNER_CELL_DOUBLE_CLICK,
    name: 'onCornerCellDoubleClick',
  },
  {
    event: S2Event.CORNER_CELL_MOUSE_DOWN,
    name: 'onCornerCellMouseDown',
  },
  {
    event: S2Event.CORNER_CELL_MOUSE_UP,
    name: 'onCornerCellMouseUp',
  },
  {
    event: S2Event.CORNER_CELL_MOUSE_MOVE,
    name: 'onCornerCellMouseMove',
  },
  {
    event: S2Event.MERGED_CELLS_HOVER,
    name: 'onMergedCellsHoverer',
  },
  {
    event: S2Event.MERGED_CELLS_CLICK,
    name: 'onMergedCellClick',
  },
  {
    event: S2Event.MERGED_CELLS_DOUBLE_CLICK,
    name: 'onMergedCellsDoubleClick',
  },
  {
    event: S2Event.MERGED_CELLS_MOUSE_DOWN,
    name: 'onMergedCellsMouseDown',
  },
  {
    event: S2Event.MERGED_CELLS_MOUSE_UP,
    name: 'onMergedCellsMouseUp',
  },
  {
    event: S2Event.MERGED_CELLS_MOUSE_MOVE,
    name: 'onMergedCellsMouseMove',
  },
].map((i) => ({
  ...i,
  eventHook: useCellEvent,
  toString: () => i.name,
}));

describe('useEvents tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    const mockCell = createMockCellInfo('test', { rowIndex: 0, colIndex: 0 });

    s2.getCell = () => mockCell.mockCell;
    s2.render();
  });

  test('useEvents should be defined', () => {
    const mockBaseSheetProps: BaseSheetComponentProps = {
      dataCfg: undefined,
      options: undefined,
      spreadsheet: () => s2,
    };
    const { result } = renderHook(() => useEvents(mockBaseSheetProps, s2));
    expect(result.current).toBeUndefined();
  });

  test.each(
    cellEventCases.concat(S2EventCases as any) as Array<{
      event: S2Event;
      name: keyof BaseSheetComponentProps;
      eventHook: typeof useCellEvent | typeof useS2Event;
    }>,
  )(
    'eventHook should be called with %s',
    async ({ event, name, eventHook }) => {
      const props: BaseSheetComponentProps = {
        dataCfg: mockDataConfig,
        options: s2Options,
        [name]: jest.fn(),
      };

      const { rerender, unmount } = renderHook(
        ({ props }) => eventHook(event, props[name] as any, s2),
        {
          initialProps: { props },
        },
      );

      const MockEmitFn = () => {
        s2.emit(event, {
          target: {
            get: () => {},
          },
          stopPropagation: () => {},
        } as unknown as GEvent);
      };
      // emit
      act(MockEmitFn);
      expect(props[name]).toBeCalledTimes(1);

      // cleanup effects for useEffect hooks
      unmount();
      // emit
      act(MockEmitFn);
      expect(props[name]).toBeCalledTimes(1);

      const newProps = {
        ...props,
        [name]: jest.fn(),
      };
      rerender({ props: newProps });
      expect(newProps[name]).toBeCalledTimes(0);
    },
  );
});
