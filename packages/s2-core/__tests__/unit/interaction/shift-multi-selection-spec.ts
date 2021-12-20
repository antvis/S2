import { createFakeSpreadSheet, createMockCellInfo } from 'tests/util/helpers';
import { Event as GEvent } from '@antv/g-canvas';
import { S2Options } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import {
  InteractionKeyboardKey,
  InteractionStateName,
  InterceptType,
  S2Event,
} from '@/common/constant';
import { RangeSelection } from '@/interaction/range-selection';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/base-interaction/click/data-cell-click');

describe('Interaction Range Selection Tests', () => {
  let rangeSelection: RangeSelection;
  let s2: SpreadSheet;

  beforeEach(() => {
    const mockCell = createMockCellInfo('testId1').mockCell as any;
    s2 = createFakeSpreadSheet();
    s2.getCell = () => mockCell;
    rangeSelection = new RangeSelection(s2);
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

  afterEach(() => {
    s2.store.set('lastClickedCell', null);
  });

  test('should bind events', () => {
    expect(rangeSelection.bindEvents).toBeDefined();
  });

  test('should add click intercept when shift keydown', () => {
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.SHIFT,
    } as KeyboardEvent);

    expect(s2.interaction.hasIntercepts([InterceptType.CLICK])).toBeTruthy();
  });

  test('should remove click intercept when shift keyup', () => {
    s2.emit(S2Event.GLOBAL_KEYBOARD_UP, {
      key: InteractionKeyboardKey.SHIFT,
    } as KeyboardEvent);

    expect(s2.interaction.hasIntercepts([InterceptType.CLICK])).toBeFalsy();
  });

  test('should set last clicked cell', () => {
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

  // should use data cell click interaction for single cell select
  test('should not hide tooltip and change single data cell state', () => {
    s2.store.set('lastClickedCell', null);

    const mockCell00 = createMockCellInfo('8-8', { rowIndex: 8, colIndex: 8 });
    s2.getCell = () => mockCell00.mockCell as any;

    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);

    expect(s2.hideTooltip).not.toHaveBeenCalled();
    expect(s2.interaction.getState()).toEqual({
      cells: [],
      force: false,
    });
  });

  test('should select range data', () => {
    s2.interaction.changeState({
      cells: [],
      stateName: InteractionStateName.SELECTED,
    });

    s2.facet = {
      layoutResult: {
        colLeafNodes: [{ id: '0' }, { id: '1' }],
        rowLeafNodes: [{ id: '0' }, { id: '1' }],
      },
      getSeriesNumberWidth: () => 200,
    } as any;

    const mockCell00 = createMockCellInfo('0-0', { rowIndex: 0, colIndex: 0 });
    const mockCell01 = createMockCellInfo('0-1', { rowIndex: 0, colIndex: 1 });
    const mockCell10 = createMockCellInfo('1-0', { rowIndex: 1, colIndex: 0 });
    const mockCell11 = createMockCellInfo('1-1', { rowIndex: 1, colIndex: 1 });

    s2.store.set('lastClickedCell', mockCell00.mockCell as any);
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.SHIFT,
    } as KeyboardEvent);

    s2.getCell = () => mockCell11.mockCell as any;

    s2.interaction.getActiveCells = () =>
      [
        mockCell00.mockCell,
        mockCell10.mockCell,
        mockCell01.mockCell,
        mockCell11.mockCell,
      ] as any;

    const selected = jest.fn();
    s2.on(S2Event.GLOBAL_SELECTED, selected);

    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);

    s2.emit(S2Event.GLOBAL_KEYBOARD_UP, {
      key: InteractionKeyboardKey.SHIFT,
    } as KeyboardEvent);

    expect(s2.interaction.getState()).toEqual({
      cells: [
        mockCell00.mockCellMeta,
        mockCell10.mockCellMeta,
        mockCell01.mockCellMeta,
        mockCell11.mockCellMeta,
      ],
      stateName: InteractionStateName.SELECTED,
    });
    expect(selected).toHaveBeenCalledWith([
      mockCell00.mockCell,
      mockCell10.mockCell,
      mockCell01.mockCell,
      mockCell11.mockCell,
    ]);
    expect(
      s2.interaction.hasIntercepts([InterceptType.CLICK, InterceptType.HOVER]),
    ).toBeTruthy();
    expect(s2.hideTooltip).toHaveBeenCalled();
  });
});
