import { createFakeSpreadSheet, createMockCellInfo } from 'tests/util/helpers';
import type { BaseFacet } from '../../../src/facet';
import type { InternalFullyTheme, OffsetConfig } from '@/common/interface';
import type { SpreadSheet } from '@/sheet-type';
import { InteractionKeyboardKey, S2Event } from '@/common/constant';
import { SelectedCellMove } from '@/interaction/selected-cell-move';

jest.mock('@/interaction/event-controller');

type MockCell = ReturnType<typeof createMockCellInfo>;

describe('Interaction Keyboard Move Tests', () => {
  let keyboardMove: SelectedCellMove;
  let s2: SpreadSheet;
  let mockCell00: MockCell;
  let mockCell01: MockCell;
  let mockCell10: MockCell;
  let mockCell11: MockCell;

  beforeEach(() => {
    mockCell00 = createMockCellInfo('0-0', { rowIndex: 0, colIndex: 0 });
    mockCell01 = createMockCellInfo('0-1', { rowIndex: 0, colIndex: 1 });
    mockCell10 = createMockCellInfo('1-0', { rowIndex: 1, colIndex: 0 });
    mockCell11 = createMockCellInfo('1-1', { rowIndex: 1, colIndex: 1 });
    const mockCell = createMockCellInfo('testId1').mockCell as any;

    s2 = createFakeSpreadSheet();
    keyboardMove = new SelectedCellMove(s2);
    s2.theme = {
      splitLine: {
        verticalBorderWidth: 1,
        horizontalBorderWidth: 1,
      },
    } as InternalFullyTheme;
    s2.isTableMode = jest.fn(() => true);
    s2.dataSet = {
      fields: { columns: ['0', '1'] },
      getDisplayDataSet: () => [{ a: 0 }, { a: 1 }],
    } as any;
    s2.facet = {
      getRowLeafNodes: () => [],
      getColLeafNodes: () => [
        { x: 0, id: '0', colIndex: 0 },
        { x: 1, id: '1', colIndex: 1 },
      ],
      getTotalHeightForRange: () => 0,
      scrollWithAnimation: (data: OffsetConfig) => {
        s2.store.set('scrollX', data?.offsetX?.value!);
        s2.store.set('scrollY', data?.offsetY?.value!);
      },
      getScrollOffset: () => {
        return {
          scrollX: s2.store.get('scrollX', 0),
          scrollY: s2.store.get('scrollY', 0),
        };
      },
      panelBBox: {
        viewportHeight: 200,
        viewportWidth: 200,
      },
      viewCellWidths: [],
      viewCellHeights: {
        getCellOffsetY: () => 0,
        getIndexRange: () => [0, 3],
      },
      getRealScrollX: () => 0,
      cornerBBox: {
        width: 80,
      },
    } as unknown as BaseFacet;
    s2.interaction.intercepts.clear();
    s2.interaction.isEqualStateName = () => false;
    s2.interaction.getInteractedCells = () => [mockCell];
    s2.interaction.eventController.isCanvasEffect = true;
  });

  test('should bind events', () => {
    expect(keyboardMove.bindEvents).toBeDefined();
  });

  test('should move selected cell right', () => {
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell00.mockCell as any];

    // @ts-ignore
    keyboardMove.startCell = mockCell00.mockCell;
    // @ts-ignore
    keyboardMove.endCell = mockCell00.mockCell;

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_RIGHT,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [{ colIndex: 1, id: '0-1', rowIndex: 0, type: 'dataCell' }],
      stateName: 'selected',
    });

    // overflow not call
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell01.mockCell as any];
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_RIGHT,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).not.toHaveBeenCalled();
  });

  test('should move selected cell left', () => {
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell01.mockCell as any];
    // @ts-ignore
    keyboardMove.startCell = mockCell01.mockCell;
    // @ts-ignore
    keyboardMove.endCell = mockCell01.mockCell;

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_LEFT,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [{ colIndex: 0, id: '0-0', rowIndex: 0, type: 'dataCell' }],
      stateName: 'selected',
    });

    // overflow not call
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell00.mockCell as any];
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_LEFT,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).not.toHaveBeenCalled();
  });

  test('should move selected cell up', () => {
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell10.mockCell as any];
    // @ts-ignore
    keyboardMove.startCell = mockCell10.mockCell;
    // @ts-ignore
    keyboardMove.endCell = mockCell10.mockCell;

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_UP,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [{ colIndex: 0, id: '0-0', rowIndex: 0, type: 'dataCell' }],
      stateName: 'selected',
    });

    // overflow not call
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell00.mockCell as any];
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_UP,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).not.toHaveBeenCalled();
  });

  test('should move selected cell down', () => {
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell01.mockCell as any];
    // @ts-ignore
    keyboardMove.startCell = mockCell01.mockCell;
    // @ts-ignore
    keyboardMove.endCell = mockCell01.mockCell;

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_DOWN,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [{ colIndex: 1, id: '1-1', rowIndex: 1, type: 'dataCell' }],
      stateName: 'selected',
    });

    // overflow not call
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell11.mockCell as any];
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_DOWN,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).not.toHaveBeenCalled();
  });

  test('should move selected with meta', () => {
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell00.mockCell as any];
    // @ts-ignore
    keyboardMove.startCell = mockCell00.mockCell;
    // @ts-ignore
    keyboardMove.endCell = mockCell00.mockCell;
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_RIGHT,
      metaKey: true,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [{ colIndex: 1, id: '0-1', rowIndex: 0, type: 'dataCell' }],
      stateName: 'selected',
    });

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_DOWN,
      metaKey: true,
    } as KeyboardEvent);

    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [{ colIndex: 1, id: '1-1', rowIndex: 1, type: 'dataCell' }],
      stateName: 'selected',
    });

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_LEFT,
      metaKey: true,
    } as KeyboardEvent);

    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [{ colIndex: 0, id: '1-0', rowIndex: 1, type: 'dataCell' }],
      stateName: 'selected',
    });

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_UP,
      metaKey: true,
    } as KeyboardEvent);

    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [{ colIndex: 1, id: '0-1', rowIndex: 0, type: 'dataCell' }],
      stateName: 'selected',
    });
  });

  test('should move selected with shift', () => {
    const onDataCellSelectMove = jest.fn();

    s2.interaction.changeState = jest.fn();
    s2.facet.getCells = () => [mockCell00.mockCell as any];
    // @ts-ignore
    keyboardMove.startCell = mockCell00.mockCell;
    // @ts-ignore
    keyboardMove.endCell = mockCell00.mockCell;
    s2.on(S2Event.DATA_CELL_SELECT_MOVE, onDataCellSelectMove);
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_RIGHT,
      shiftKey: true,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [
        { colIndex: 0, id: '0-0', rowIndex: 0, type: 'dataCell' },
        { colIndex: 1, id: '0-1', rowIndex: 0, type: 'dataCell' },
      ],
      stateName: 'selected',
    });

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_DOWN,
      shiftKey: true,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [
        { colIndex: 0, id: '0-0', rowIndex: 0, type: 'dataCell' },
        { colIndex: 1, id: '0-1', rowIndex: 0, type: 'dataCell' },
        { colIndex: 0, id: '1-0', rowIndex: 1, type: 'dataCell' },
        { colIndex: 1, id: '1-1', rowIndex: 1, type: 'dataCell' },
      ],
      stateName: 'selected',
    });
    expect(onDataCellSelectMove).toHaveBeenCalled();
  });

  test('should move selected with shift and meta', () => {
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell00.mockCell as any];
    // @ts-ignore
    keyboardMove.startCell = mockCell00.mockCell;
    // @ts-ignore
    keyboardMove.endCell = mockCell00.mockCell;
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_RIGHT,
      shiftKey: true,
      metaKey: true,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [
        { colIndex: 0, id: '0-0', rowIndex: 0, type: 'dataCell' },
        { colIndex: 1, id: '0-1', rowIndex: 0, type: 'dataCell' },
      ],
      stateName: 'selected',
    });

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_DOWN,
      shiftKey: true,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toHaveBeenCalled();
    expect(s2.interaction.changeState).toHaveBeenCalledWith({
      cells: [
        { colIndex: 0, id: '0-0', rowIndex: 0, type: 'dataCell' },
        { colIndex: 1, id: '0-1', rowIndex: 0, type: 'dataCell' },
        { colIndex: 0, id: '1-0', rowIndex: 1, type: 'dataCell' },
        { colIndex: 1, id: '1-1', rowIndex: 1, type: 'dataCell' },
      ],
      stateName: 'selected',
    });
  });

  test('should not move selected cell down when isCanvasEffect is false', () => {
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell01.mockCell as any];
    // @ts-ignore
    keyboardMove.startCell = mockCell01.mockCell;
    // @ts-ignore
    keyboardMove.endCell = mockCell01.mockCell;

    s2.interaction.eventController.isCanvasEffect = false;

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_DOWN,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).not.toHaveBeenCalled();

    s2.interaction.eventController.isCanvasEffect = true;
  });

  test('should scroll to active cell', () => {
    s2.interaction.changeState = jest.fn(() => {});
    s2.facet.getCells = () => [mockCell01.mockCell as any];
    // @ts-ignore
    keyboardMove.startCell = mockCell01.mockCell;
    // @ts-ignore
    keyboardMove.endCell = mockCell01.mockCell;
    s2.facet.scrollWithAnimation({
      offsetX: {
        value: 1,
      },
      offsetY: {
        value: 1,
      },
    });

    expect(s2.facet.getScrollOffset()).toEqual({
      scrollX: 1,
      scrollY: 1,
    });

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_LEFT,
    } as KeyboardEvent);

    expect(s2.facet.getScrollOffset()).toEqual({
      scrollX: 0,
      scrollY: 1,
    });
  });
});
