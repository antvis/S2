import { createFakeSpreadSheet } from 'tests/util/helpers';
import { Event as GEvent } from '@antv/g-canvas';
import { omit } from 'lodash';
import { DataCellMultiSelection } from '@/interaction/data-cell-multi-selection';
import { CellMeta, S2Options, ViewMeta } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import {
  InteractionKeyboardKey,
  InteractionStateName,
  InterceptType,
  S2Event,
} from '@/common/constant';

jest.mock('@/interaction/event-controller');

describe('Interaction Data Cell Multi Selection Tests', () => {
  let dataCellMultiSelection: DataCellMultiSelection;
  let s2: SpreadSheet;

  const createMockCell = (
    cellId: string,
    { colIndex = 0, rowIndex = 0 } = {},
  ) => {
    const mockCellViewMeta: Partial<ViewMeta> = {
      id: cellId,
      colIndex,
      rowIndex,
      type: undefined,
    };
    const mockCellMeta = omit(mockCellViewMeta, 'update');
    const mockCell = {
      ...mockCellViewMeta,
      getMeta: () => mockCellViewMeta,
      hideInteractionShape: jest.fn(),
    };

    return {
      mockCell,
      mockCellMeta,
    };
  };

  beforeEach(() => {
    const mockCell = createMockCell('testId1').mockCell as any;
    s2 = createFakeSpreadSheet();
    s2.getCell = () => mockCell;
    s2.dataCfg = {
      ...s2.dataCfg,
      fields: {
        valueInCols: false,
      },
    };
    dataCellMultiSelection = new DataCellMultiSelection(s2);
    s2.options = {
      ...s2.options,
      tooltip: {
        operation: {
          trend: false,
        },
      },
    } as S2Options;
    s2.isTableMode = jest.fn(() => true);
    s2.interaction.intercepts.clear();
    s2.interaction.isEqualStateName = () => false;
    s2.interaction.getInteractedCells = () => [mockCell];
  });

  test('should bind events', () => {
    expect(dataCellMultiSelection.bindEvents).toBeDefined();
  });

  test.each([InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL])(
    'should add click intercept when keydown',
    (key) => {
      s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
        key,
      } as KeyboardEvent);

      expect(s2.interaction.hasIntercepts([InterceptType.CLICK])).toBeTruthy();
    },
  );

  test.each([InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL])(
    'should remove click intercept when  keyup',
    (key) => {
      s2.emit(S2Event.GLOBAL_KEYBOARD_UP, {
        key,
      } as KeyboardEvent);

      expect(s2.interaction.hasIntercepts([InterceptType.CLICK])).toBeFalsy();
    },
  );

  test.each([InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL])(
    'should select multiple data cell',
    (key) => {
      s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
        key,
      } as KeyboardEvent);

      s2.interaction.changeState({
        cells: [],
        stateName: InteractionStateName.SELECTED,
      });
      const mockCellA = createMockCell('testId2', { rowIndex: 0, colIndex: 0 });
      s2.interaction.getCells = () => [mockCellA.mockCellMeta as CellMeta];

      const mockCellB = createMockCell('testId3', {
        rowIndex: 1,
        colIndex: 1,
      });

      s2.getCell = () => mockCellB.mockCell as any;

      s2.interaction.getActiveCells = () =>
        [mockCellA.mockCell, mockCellB.mockCell] as any;

      const selected = jest.fn();
      s2.on(S2Event.GLOBAL_SELECTED, selected);

      s2.emit(S2Event.DATA_CELL_CLICK, {
        stopPropagation() {},
      } as unknown as GEvent);

      expect(selected).toHaveBeenCalledWith([
        mockCellA.mockCell,
        mockCellB.mockCell,
      ]);

      expect(s2.interaction.getState()).toEqual({
        cells: [mockCellA.mockCellMeta, mockCellB.mockCellMeta],
        stateName: InteractionStateName.SELECTED,
      });

      expect(
        s2.interaction.hasIntercepts([
          InterceptType.CLICK,
          InterceptType.HOVER,
        ]),
      ).toBeTruthy();
      expect(s2.hideTooltip).toHaveBeenCalled();
      expect(s2.showTooltipWithInfo).toHaveBeenCalled();
    },
  );

  test.each([InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL])(
    'should unselect multiple data cell',
    (key) => {
      s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
        key,
      } as KeyboardEvent);

      const mockCellA = createMockCell('testId2', { rowIndex: 0, colIndex: 0 });
      const mockCellB = createMockCell('testId3', {
        rowIndex: 1,
        colIndex: 1,
      });

      s2.interaction.getCells = () =>
        [mockCellA.mockCellMeta, mockCellB.mockCellMeta] as CellMeta[];

      // unselect cellA
      s2.getCell = () => mockCellA.mockCell as any;

      s2.emit(S2Event.DATA_CELL_CLICK, {
        stopPropagation() {},
      } as unknown as GEvent);

      expect(s2.interaction.getState()).toEqual({
        cells: [mockCellB.mockCellMeta],
        stateName: InteractionStateName.SELECTED,
      });

      expect(
        s2.interaction.hasIntercepts([
          InterceptType.CLICK,
          InterceptType.HOVER,
        ]),
      ).toBeTruthy();
      expect(s2.hideTooltip).toHaveBeenCalled();
      expect(s2.showTooltipWithInfo).toHaveBeenCalled();
    },
  );

  test.each([InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL])(
    'should clear state when unselect all data cell and',
    (key) => {
      s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
        key,
      } as KeyboardEvent);

      s2.interaction.changeState({
        cells: [],
        stateName: InteractionStateName.SELECTED,
      });
      const mockCellA = createMockCell('testId2', { rowIndex: 0, colIndex: 0 });

      s2.interaction.getCells = () => [mockCellA.mockCellMeta] as CellMeta[];

      // unselect cellA
      s2.getCell = () => mockCellA.mockCell as any;

      s2.emit(S2Event.DATA_CELL_CLICK, {
        stopPropagation() {},
      } as unknown as GEvent);

      expect(s2.interaction.getState()).toEqual({
        cells: [],
        force: false,
      });
      expect(s2.hideTooltip).toHaveBeenCalled();
    },
  );

  test('should set lastClickedCell', () => {
    s2.interaction.changeState({
      cells: [],
      stateName: InteractionStateName.SELECTED,
    });
    const mockCell00 = createMockCell('0-0', { rowIndex: 0, colIndex: 0 });

    s2.getCell = () => mockCell00.mockCell as any;

    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);

    expect(s2.store.get('lastClickedCell')).toEqual(mockCell00.mockCell);
  });
});
