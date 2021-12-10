import { renderHook, act } from '@testing-library/react-hooks';
import { PivotSheet, S2Event, S2Options, SpreadSheet } from '@antv/s2';
import { createMockCellInfo, getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { Event as GEvent } from '@antv/g-canvas';
import { BaseSheetComponentProps } from '../../../src/components';
import { useEvents } from '@/hooks';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hdAdapter: false,
};

describe('useEvents tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    const mockCell = createMockCellInfo('test', { rowIndex: 0, colIndex: 0 });

    s2.getCell = () => mockCell.mockCell;
    s2.render();
  });

  test('should be defined', () => {
    const { result } = renderHook(() => useEvents(null));

    expect(result.current).toBeDefined();
  });

  test.each([
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
      event: S2Event.DATA_CELL_TREND_ICON_CLICK,
      name: 'onDataCellTrendIconClick',
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
      event: S2Event.MERGED_CELLS_HOVER,
      name: 'onMergedCellHover',
    },
    {
      event: S2Event.MERGED_CELLS_DOUBLE_CLICK,
      name: 'onMergedCellsDoubleClick',
    },

    {
      event: S2Event.LAYOUT_AFTER_RENDER,
      name: 'onLoad',
    },
    {
      event: S2Event.LAYOUT_DESTROY,
      name: 'onDestroy',
    },
  ] as Array<{ event: S2Event; name: keyof BaseSheetComponentProps }>)(
    'should register events %o',
    ({ name, event }) => {
      const props: BaseSheetComponentProps = {
        dataCfg: mockDataConfig,
        options: s2Options,
        [name]: jest.fn(),
      };
      const { result } = renderHook(() => useEvents(props));

      // register
      act(() => {
        result.current.registerEvent(s2);
      });

      // emit
      act(() => {
        s2.emit(event, {
          target: {
            get: () => {},
          },
          stopPropagation: () => {},
        } as unknown as GEvent);
      });

      // call
      expect(props[name]).toHaveBeenCalledTimes(1);
    },
  );
});
