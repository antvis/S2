import { createFakeSpreadSheet, createMockCellInfo } from 'tests/util/helpers';
import type { GEvent } from '@/index';
import { DataCellMultiSelection } from '@/interaction/data-cell-multi-selection';
import type { CellMeta } from '@/common/interface';
import type { SpreadSheet } from '@/sheet-type';
import {
  InteractionKeyboardKey,
  InteractionStateName,
  InterceptType,
  S2Event,
} from '@/common/constant';

jest.mock('@/interaction/event-controller');
jest.mock('@/ui/hd-adapter');

describe('Interaction Data Cell Multi Selection Tests', () => {
  let dataCellMultiSelection: DataCellMultiSelection;
  let s2: SpreadSheet;

  beforeEach(() => {
    const mockCell = createMockCellInfo('testId1').mockCell as any;

    s2 = createFakeSpreadSheet();
    s2.getCell = () => mockCell;
    s2.dataCfg = {
      ...s2.dataCfg,
      fields: {
        valueInCols: false,
      },
    };
    dataCellMultiSelection = new DataCellMultiSelection(s2);
    s2.isTableMode = jest.fn(() => true);
    s2.interaction.intercepts.clear();
    s2.interaction.isEqualStateName = () => false;
    s2.interaction.getInteractedCells = () => [mockCell];
  });

  test('should bind events', () => {
    expect(dataCellMultiSelection.bindEvents).toBeDefined();
  });

  test.each([InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL])(
    'should add click intercept when %s keydown',
    (key) => {
      s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
        key,
      } as KeyboardEvent);

      expect(s2.interaction.hasIntercepts([InterceptType.CLICK])).toBeTruthy();
    },
  );

  test.each([InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL])(
    'should remove click intercept when %s keyup',
    (key) => {
      s2.interaction.addIntercepts([InterceptType.CLICK]);
      s2.emit(S2Event.GLOBAL_KEYBOARD_UP, {
        key,
      } as KeyboardEvent);

      expect(s2.interaction.hasIntercepts([InterceptType.CLICK])).toBeFalsy();
    },
  );

  test.each([InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL])(
    'should remove click intercept when %s released',
    () => {
      Object.defineProperty(dataCellMultiSelection, 'isMultiSelection', {
        value: true,
      });
      s2.interaction.addIntercepts([InterceptType.CLICK]);
      s2.emit(S2Event.GLOBAL_MOUSE_MOVE, {} as MouseEvent);

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
      const mockCellA = createMockCellInfo('testId2', {
        rowIndex: 0,
        colIndex: 0,
      });

      s2.interaction.getCells = () => [mockCellA.mockCellMeta as CellMeta];

      const mockCellB = createMockCellInfo('testId3', {
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
        onUpdateCells: expect.any(Function),
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

      const mockCellA = createMockCellInfo('testId2', {
        rowIndex: 0,
        colIndex: 0,
      });
      const mockCellB = createMockCellInfo('testId3', {
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
        onUpdateCells: expect.any(Function),
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
      const mockCellA = createMockCellInfo('testId2', {
        rowIndex: 0,
        colIndex: 0,
      });

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
    const mockCell00 = createMockCellInfo('0-0', { rowIndex: 0, colIndex: 0 });

    s2.getCell = () => mockCell00.mockCell as any;

    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);

    expect(s2.store.get('lastClickedCell')).toEqual(mockCell00.mockCell);
  });

  test('should get correct state when reset', () => {
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.META,
    } as KeyboardEvent);
    expect((dataCellMultiSelection as any).isMultiSelection).toBe(true);
    dataCellMultiSelection.reset();
    expect((dataCellMultiSelection as any).isMultiSelection).toBe(false);
  });
});
