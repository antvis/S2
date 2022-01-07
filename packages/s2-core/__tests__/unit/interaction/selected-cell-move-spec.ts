import { createFakeSpreadSheet, createMockCellInfo } from 'tests/util/helpers';
import { S2Options } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { InteractionKeyboardKey, S2Event } from '@/common/constant';
import { SelectedCellMove } from '@/interaction/selected-cell-move';

jest.mock('@/interaction/event-controller');

describe('Interaction Keyboard Move Tests', () => {
  let keyboardMove: SelectedCellMove;
  let s2: SpreadSheet;
  let mockCell00;
  let mockCell01;
  let mockCell10;
  let mockCell11;

  beforeEach(() => {
    mockCell00 = createMockCellInfo('0-0', { rowIndex: 0, colIndex: 0 });
    mockCell01 = createMockCellInfo('0-1', { rowIndex: 0, colIndex: 1 });
    mockCell10 = createMockCellInfo('1-0', { rowIndex: 1, colIndex: 0 });
    mockCell11 = createMockCellInfo('1-1', { rowIndex: 1, colIndex: 1 });
    const mockCell = createMockCellInfo('testId1').mockCell as any;
    s2 = createFakeSpreadSheet();
    keyboardMove = new SelectedCellMove(s2);
    s2.options = {
      ...s2.options,
      tooltip: {
        operation: {
          trend: false,
        },
      },
    } as S2Options;
    s2.isTableMode = jest.fn(() => true);
    s2.dataSet = {
      fields: { columns: ['0', '1'] },
      getDisplayDataSet: () => [{ a: 0 }, { a: 1 }],
    } as any;
    s2.facet = {
      layoutResult: {
        colLeafNodes: [
          { x: 0, id: '0' },
          { x: 1, id: '1' },
        ],
      },
      viewCellHeights: { getCellOffsetY: (index) => 0 },
      getTotalHeightForRange: (start, end) => 0,
      scrollWithAnimation: (data) => {},
    } as any;
    s2.interaction.intercepts.clear();
    s2.interaction.isEqualStateName = () => false;
    s2.interaction.getInteractedCells = () => [mockCell];
  });

  test('should bind events', () => {
    expect(keyboardMove.bindEvents).toBeDefined();
  });

  test('should move selected cell right', () => {
    s2.interaction.changeState = jest.fn((state) => {});
    s2.interaction.getCells = () => [mockCell00.mockCell as any];

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_RIGHT,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toBeCalled();
    expect(s2.interaction.changeState).toBeCalledWith({
      cells: [{ colIndex: 1, id: '0-1', rowIndex: 0, type: 'dataCell' }],
      stateName: 'selected',
    });

    // overflow not call
    s2.interaction.changeState = jest.fn((state) => {});
    s2.interaction.getCells = () => [mockCell01.mockCell as any];
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_RIGHT,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).not.toBeCalled();
  });
  test('should move selected cell left', () => {
    s2.interaction.changeState = jest.fn((state) => {});
    s2.interaction.getCells = () => [mockCell01.mockCell as any];

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_LEFT,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toBeCalled();
    expect(s2.interaction.changeState).toBeCalledWith({
      cells: [{ colIndex: 0, id: '0-0', rowIndex: 0, type: 'dataCell' }],
      stateName: 'selected',
    });

    // overflow not call
    s2.interaction.changeState = jest.fn((state) => {});
    s2.interaction.getCells = () => [mockCell00.mockCell as any];
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_LEFT,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).not.toBeCalled();
  });

  test('should move selected cell up', () => {
    s2.interaction.changeState = jest.fn((state) => {});
    s2.interaction.getCells = () => [mockCell10.mockCell as any];

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_UP,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toBeCalled();
    expect(s2.interaction.changeState).toBeCalledWith({
      cells: [{ colIndex: 0, id: '0-0', rowIndex: 0, type: 'dataCell' }],
      stateName: 'selected',
    });

    // overflow not call
    s2.interaction.changeState = jest.fn((state) => {});
    s2.interaction.getCells = () => [mockCell00.mockCell as any];
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_UP,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).not.toBeCalled();
  });

  test('should move selected cell down', () => {
    s2.interaction.changeState = jest.fn((state) => {});
    s2.interaction.getCells = () => [mockCell01.mockCell as any];

    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_DOWN,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).toBeCalled();
    expect(s2.interaction.changeState).toBeCalledWith({
      cells: [{ colIndex: 1, id: '1-1', rowIndex: 1, type: 'dataCell' }],
      stateName: 'selected',
    });

    // overflow not call
    s2.interaction.changeState = jest.fn((state) => {});
    s2.interaction.getCells = () => [mockCell11.mockCell as any];
    s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
      key: InteractionKeyboardKey.ARROW_DOWN,
    } as KeyboardEvent);
    expect(s2.interaction.changeState).not.toBeCalled();
  });
});
