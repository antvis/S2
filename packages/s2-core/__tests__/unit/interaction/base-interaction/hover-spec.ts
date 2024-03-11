import { omit } from 'lodash';
import {
  createFakeSpreadSheet,
  createFederatedMouseEvent,
  sleep,
} from 'tests/util/helpers';
import type { GEvent } from '@/index';
import type { CellEventTarget, S2Options, ViewMeta } from '@/common/interface';
import { HoverEvent } from '@/interaction/base-interaction/hover';
import type { SpreadSheet } from '@/sheet-type';
import {
  ELLIPSIS_SYMBOL,
  HOVER_FOCUS_DURATION,
  InteractionStateName,
  OriginEventType,
  S2Event,
} from '@/common/constant';

describe('Interaction Hover Tests', () => {
  let hoverEvent: HoverEvent;
  let s2: SpreadSheet;

  const mockCell: Partial<ViewMeta> = {
    id: '1',
    colIndex: 0,
    rowIndex: 0,
    type: 'dataCell',
  };

  const mockCellMeta = omit(mockCell, 'update');
  const mockCellUpdate = jest.fn();
  const mockTooltipParams = [
    [{ value: undefined, valueField: undefined }],
    {
      enableFormat: true,
      hideSummary: true,
      isTotals: undefined,
      onlyShowCellText: true,
    },
  ];

  const getCell = (target: CellEventTarget) =>
    ({
      update: mockCellUpdate,
      getMeta: () => {
        if (target) {
          return {
            ...mockCell,
            ...target,
          };
        }

        return mockCell;
      },
      isTextOverflowing: jest.fn(() => true),
      getActualText: () => ELLIPSIS_SYMBOL,
      getFieldValue: () => '',
      cellType: 'dataCell',
    }) as any;

  beforeEach(() => {
    s2 = createFakeSpreadSheet();
    s2.getCell = getCell;
    s2.options = {
      interaction: {
        hoverHighlight: true,
        hoverFocus: true,
      },
      tooltip: {
        operation: {},
      },
    } as S2Options;
    s2.isTableMode = jest.fn(() => true);
    hoverEvent = new HoverEvent(s2 as unknown as SpreadSheet);
  });

  afterEach(() => {
    mockCellUpdate.mockReset();
  });

  afterEach(() => {
    mockCellUpdate.mockRestore();
  });

  test('should bind events', () => {
    expect(hoverEvent.bindEvents).toBeDefined();
  });

  test('should trigger data cell hover', async () => {
    const interactionGetHoverHighlightSpy = jest
      .spyOn(s2.interaction, 'getHoverHighlight')
      .mockImplementationOnce(() => ({
        rowHeader: true,
        colHeader: true,
        currentRow: true,
        currentCol: true,
      }));

    s2.emit(S2Event.DATA_CELL_HOVER, { target: {} } as GEvent);
    expect(s2.interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER,
    });

    await sleep(1000);

    expect(s2.interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER_FOCUS,
    });
    expect(s2.showTooltipWithInfo).toHaveBeenCalled();
    expect(interactionGetHoverHighlightSpy).toHaveBeenCalled();
  });

  test('should trigger data cell hover depend on separate config', async () => {
    s2.facet.getRowCells().forEach((cell) => {
      jest.spyOn(cell, 'update').mockImplementationOnce(() => {});
    });

    s2.facet.getColCells().forEach((cell) => {
      jest.spyOn(cell, 'update').mockImplementationOnce(() => {});
    });

    s2.setOptions({
      interaction: {
        hoverHighlight: {
          colHeader: true,
          rowHeader: false,
        },
      },
    });

    s2.emit(S2Event.DATA_CELL_HOVER, { target: {} } as GEvent);

    expect(s2.interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER,
    });

    await sleep(1000);

    expect(s2.interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER_FOCUS,
    });

    s2.facet.getColCells().forEach((cell) => {
      expect(cell.update).toHaveBeenCalled();
    });

    s2.facet.getRowCells().forEach((cell) => {
      expect(cell.update).not.toHaveBeenCalled();
    });
  });

  test('should not trigger data cell hover when hover cell not change', () => {
    s2.emit(S2Event.DATA_CELL_HOVER, { target: {} } as GEvent);
    expect(s2.interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER,
    });

    s2.emit(S2Event.DATA_CELL_HOVER, {
      target: { cellType: 'mockCell' } as any,
    } as GEvent);
    expect((s2.interaction.getState().cells![0] as any).type).toBe('dataCell');
  });

  test('should trigger data cell hover immediately hover focus time equals 0', async () => {
    s2.setOptions({
      interaction: { hoverFocus: { duration: 0 } },
    });
    s2.emit(S2Event.DATA_CELL_HOVER, { target: {} } as GEvent);
    await sleep(200);
    expect(s2.interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER_FOCUS,
    });
    expect(s2.showTooltipWithInfo).toHaveBeenCalled();
  });

  test('should trigger row cell hover', () => {
    s2.emit(S2Event.ROW_CELL_HOVER, { target: {} } as GEvent);
    expect(s2.interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER,
    });
    expect(mockCellUpdate).toHaveBeenCalled();
    expect(s2.showTooltipWithInfo).toHaveBeenCalled();
  });

  test('should trigger col cell hover', () => {
    s2.emit(S2Event.COL_CELL_HOVER, { target: {} } as GEvent);
    expect(s2.interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER,
    });
    expect(mockCellUpdate).toHaveBeenCalled();
    expect(s2.showTooltipWithInfo).toHaveBeenCalled();
  });

  test('should not trigger header cell hover when hover cell not change', () => {
    s2.emit(S2Event.ROW_CELL_HOVER, {
      target: {
        id: 'rowCellOne',
        rowIndex: 0,
      } as any,
    } as GEvent);

    s2.emit(S2Event.ROW_CELL_HOVER, {
      target: {
        id: 'rowCellOne',
        rowIndex: 1,
      } as any,
    } as GEvent);

    expect((s2.interaction.getState().cells![0] as any).rowIndex).toBe(0);
  });

  test('should clear data cell hover focus timer when cell clicked', async () => {
    s2.emit(S2Event.DATA_CELL_HOVER, { target: {} } as GEvent);

    // click date cell before will trigger hover focus
    await sleep(HOVER_FOCUS_DURATION - 200);

    const event = createFederatedMouseEvent(s2, OriginEventType.MOUSE_DOWN);

    s2.container.dispatchEvent(event);

    await sleep(200);

    expect(s2.interaction.isHoverFocusState()).toBeFalsy();
  });

  test('should clear data cell hover focus timer when row cell hover', async () => {
    const dataCellEvent = {
      target: {
        id: 'data-cell',
      },
    };

    const rowCellEvent = {
      target: {
        id: 'row-cell',
      },
    };

    s2.emit(S2Event.DATA_CELL_HOVER, dataCellEvent as unknown as GEvent);
    s2.emit(S2Event.ROW_CELL_HOVER, rowCellEvent as unknown as GEvent);

    await sleep(HOVER_FOCUS_DURATION + 200);

    expect(s2.showTooltipWithInfo).toHaveBeenLastCalledWith(
      rowCellEvent,
      ...mockTooltipParams,
    );
  });

  test('should clear data cell hover focus timer when col cell hover', async () => {
    const dataCellEvent = {
      target: {
        id: 'data-cell',
      },
    };

    const colCellEvent = {
      target: {
        id: 'col-cell',
      },
    };

    s2.emit(S2Event.DATA_CELL_HOVER, dataCellEvent as unknown as GEvent);
    s2.emit(S2Event.COL_CELL_HOVER, colCellEvent as unknown as GEvent);

    await sleep(HOVER_FOCUS_DURATION + 200);

    expect(s2.showTooltipWithInfo).toHaveBeenLastCalledWith(
      colCellEvent,
      ...mockTooltipParams,
    );
  });

  test('should update hover focus state when data cell hover focus', async () => {
    const dataCellEvent = {
      target: {
        id: 'data-cell',
      },
    };

    s2.emit(S2Event.DATA_CELL_HOVER, dataCellEvent as unknown as GEvent);

    await sleep(HOVER_FOCUS_DURATION + 200);

    expect(s2.interaction.isHoverFocusState()).toBeTruthy();
  });

  test('should not update state when data cell hover focus but disable hoverFocus options', async () => {
    s2.options = {
      interaction: {
        hoverHighlight: true,
        hoverFocus: false,
      },
    } as S2Options;

    const dataCellEvent = {
      target: {
        id: 'data-cell',
      },
    };

    s2.emit(S2Event.DATA_CELL_HOVER, dataCellEvent as unknown as GEvent);

    await sleep(HOVER_FOCUS_DURATION + 200);

    expect(s2.interaction.isHoverFocusState()).toBeFalsy();
    expect(s2.interaction.getHoverTimer()).toBeFalsy();
  });

  test.each([
    S2Event.CORNER_CELL_HOVER,
    S2Event.DATA_CELL_HOVER,
    S2Event.COL_CELL_HOVER,
    S2Event.DATA_CELL_HOVER,
  ])(
    'should show tooltip if cell text contain ellipsis text when cell hover for %s',
    async (eventName) => {
      const cellEvent = {
        target: {
          id: 'cell',
        },
      };

      s2.emit(eventName, cellEvent as unknown as GEvent);

      await sleep(HOVER_FOCUS_DURATION + 200);

      expect(s2.showTooltipWithInfo).toHaveBeenCalled();
      expect(s2.hideTooltip).toHaveBeenCalled();
    },
  );

  test.each([
    S2Event.CORNER_CELL_HOVER,
    S2Event.DATA_CELL_HOVER,
    S2Event.COL_CELL_HOVER,
  ])(
    'should not show tooltip if cell text not contain ellipsis text when cell hover for %s',
    (eventName) => {
      s2.getCell = (target) =>
        ({
          update: mockCellUpdate,
          getMeta: () => {
            if (target) {
              return {
                ...mockCell,
                ...target,
              };
            }

            return mockCell;
          },
          getActualText: () => `test`,
          getFieldValue: () => 'test',
          isTextOverflowing: jest.fn(() => false),
          cellType: 'dataCell',
        }) as any;

      const cellEvent = {
        target: {
          id: 'cell',
        },
      };

      s2.emit(eventName, cellEvent as unknown as GEvent);

      expect(s2.showTooltipWithInfo).not.toHaveBeenCalled();
    },
  );
});
