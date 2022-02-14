import { renderHook, act } from '@testing-library/react-hooks';
import { PivotSheet, S2Event, S2Options, SpreadSheet } from '@antv/s2';
import { createMockCellInfo, getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { Event as GEvent } from '@antv/g-canvas';
import { BaseSheetComponentProps } from '../../../src/components';
import { useCellEvent, useEvents, useS2Event } from '@/hooks';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hdAdapter: false,
};
const S2EventCases = [
  {
    event: S2Event.DATA_CELL_TREND_ICON_CLICK,
    name: 'onDataCellTrendIconClick',
  },
  {
    event: S2Event.CORNER_CELL_HOVER,
    name: 'onCornerCellHover',
  },
  {
    event: S2Event.CORNER_CELL_DOUBLE_CLICK,
    name: 'onCornerCellDoubleClick',
  },
  {
    event: S2Event.CORNER_CELL_CLICK,
    name: 'onCornerCellClick',
  },

  {
    event: S2Event.MERGED_CELLS_CLICK,
    name: 'onMergedCellClick',
  },
  {
    event: S2Event.LAYOUT_AFTER_RENDER,
    name: 'onLoad',
  },
  {
    event: S2Event.LAYOUT_DESTROY,
    name: 'onDestroy',
  },
].map((i) => ({
  ...i,
  eventHook: useS2Event,
  // 在测试中，模拟 toString 方法，方便使用 %s 打印出 name
  toString: () => i.name,
}));
const cellEventCases = [
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
    event: S2Event.DATA_CELL_MOUSE_UP,
    name: 'onDataCellMouseUp',
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
    event: S2Event.ROW_CELL_HOVER,
    name: 'onRowCellHover',
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
    event: S2Event.COL_CELL_HOVER,
    name: 'onColCellHover',
  },
  {
    event: S2Event.MERGED_CELLS_CLICK,
    name: 'onMergedCellClick',
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
    cellEventCases.concat(S2EventCases) as Array<{
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
