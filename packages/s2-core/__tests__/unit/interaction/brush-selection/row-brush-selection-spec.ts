import { getContainer } from 'tests/util/helpers';
import * as data from '../../../data/mock-dataset.json';
import {
  InteractionBrushSelectionStage,
  Node,
  PivotSheet,
  RootInteraction,
  RowCell,
  RowCellBrushSelection,
  S2Event,
  SpreadSheet,
  type OriginalEvent,
  type S2DataConfig,
  EventController,
} from '@/index';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/root');
jest.mock('@/utils/tooltip');

const MockRootInteraction =
  RootInteraction as unknown as jest.Mock<RootInteraction>;

// RowHeader: start: { x: 0, y: 90}, end: {x: 200, y: 400}
describe('Interaction Row Cell Brush Selection Tests', () => {
  let brushSelectionInstance: RowCellBrushSelection;
  let s2: SpreadSheet;
  let mockRootInteraction: RootInteraction;

  const startBrushRowCellMeta: Partial<Node> = {
    colIndex: 0,
    rowIndex: 1,
    x: 0,
    y: 90,
  };
  const endBrushRowCellMeta: Partial<Node> = {
    colIndex: 4,
    rowIndex: 3,
    x: 100,
    y: 400,
  };

  const startBrushRowCell = Object.assign(Object.create(RowCell.prototype), {
    getMeta: () => startBrushRowCellMeta as Node,
  }) as unknown as RowCell;

  const endBrushRowCell = Object.assign(Object.create(RowCell.prototype), {
    getMeta: () => endBrushRowCellMeta as Node,
  }) as unknown as RowCell;

  beforeEach(async () => {
    MockRootInteraction.mockClear();

    s2 = new PivotSheet(getContainer(), data as S2DataConfig, {
      width: 600,
      height: 400,
      interaction: {
        brushSelection: {
          rowCell: true,
        },
      },
      style: {
        colCell: {
          height: 30,
        },
        rowCell: {
          width: 90,
        },
      },
    });

    await s2.render();

    s2.showTooltipWithInfo = jest.fn();
    s2.getCell = jest.fn(() => startBrushRowCell) as any;
    mockRootInteraction = new MockRootInteraction(s2);
    mockRootInteraction.eventController = new EventController(s2);
    mockRootInteraction.eventController.getViewportPoint = (event) => {
      return s2.container.client2Viewport({
        x: event.clientX,
        y: event.clientY,
      });
    };
    mockRootInteraction.getBrushSelection = () => {
      return {
        dataCell: true,
        rowCell: true,
        colCell: true,
      };
    };
    s2.interaction = mockRootInteraction;
    brushSelectionInstance = new RowCellBrushSelection(s2);

    brushSelectionInstance.brushSelectionStage =
      InteractionBrushSelectionStage.UN_DRAGGED;
    brushSelectionInstance.hidePrepareSelectMaskShape = jest.fn();
  });

  const emitEvent = (type: S2Event, event: Partial<OriginalEvent>) => {
    brushSelectionInstance.spreadsheet.emit(type, {
      originalEvent: event,
      preventDefault() {},
      ...event,
    } as any);
  };

  test('should get start brush point when mouse down', () => {
    emitEvent(S2Event.ROW_CELL_MOUSE_DOWN, {
      x: 10,
      y: 260,
    });

    expect(brushSelectionInstance.spreadsheet.getCell).toHaveBeenCalled();
    expect(brushSelectionInstance.startBrushPoint).toStrictEqual({
      colIndex: startBrushRowCellMeta.colIndex,
      rowIndex: startBrushRowCellMeta.rowIndex,
      scrollX: 0,
      scrollY: 0,
      x: 10,
      y: 260,
    });
    expect(s2.facet.getRowCells().length).toEqual(10);
  });

  test('should get end brush point when mouse up', () => {
    emitEvent(S2Event.ROW_CELL_MOUSE_DOWN, {
      x: 10,
      y: 100,
    });
    s2.getCell = jest.fn(() => endBrushRowCell) as any;

    const canvasRect = s2.getCanvasElement().getBoundingClientRect();

    emitEvent(S2Event.GLOBAL_MOUSE_MOVE, {
      clientY: canvasRect.top + 330,
      clientX: canvasRect.left + 160,
    });

    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});

    expect(brushSelectionInstance.spreadsheet.getCell).toHaveBeenCalled();
    expect(brushSelectionInstance.endBrushPoint).toStrictEqual({
      colIndex: endBrushRowCellMeta.colIndex,
      rowIndex: endBrushRowCellMeta.rowIndex,
      x: 160,
      y: 330,
    });
  });

  test('should skip brush selection if mouse move less than valid distance', () => {
    emitEvent(S2Event.ROW_CELL_MOUSE_DOWN, {
      x: 10,
      y: 90,
    });

    const canvasRect = s2.getCanvasElement().getBoundingClientRect();

    emitEvent(S2Event.ROW_CELL_MOUSE_MOVE, {
      clientY: canvasRect.top + 14,
      clientX: canvasRect.left + 94,
    });

    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});

    expect(brushSelectionInstance.isValidBrushSelection()).toBeFalsy();

    expect(brushSelectionInstance.brushRangeCells).toHaveLength(0);

    // 如果刷选距离过短, 则走单选的逻辑, 需要隐藏刷选提示框
    expect(
      brushSelectionInstance.hidePrepareSelectMaskShape,
    ).toHaveBeenCalled();
  });

  test('should get brush selection range cells', () => {
    const selectedFn = jest.fn();
    const brushSelectionFn = jest.fn();

    s2.on(S2Event.GLOBAL_SELECTED, selectedFn);
    s2.on(S2Event.ROW_CELL_BRUSH_SELECTION, brushSelectionFn);

    // ================== mouse down ==================
    emitEvent(S2Event.ROW_CELL_MOUSE_DOWN, { x: 10, y: 120 });

    s2.getCell = jest.fn(() => endBrushRowCell) as any;
    // ================== mouse move ==================
    const canvasRect = s2.getCanvasElement().getBoundingClientRect();

    emitEvent(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: canvasRect.left + 180,
      clientY: canvasRect.top + 400,
    });

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.DRAGGED,
    );

    expect(
      brushSelectionInstance.prepareSelectMaskShape.parsedStyle,
    ).toMatchObject({
      x: 10,
      y: 120,
      width: 170,
      height: 280,
    });

    // ================== mouse up ==================
    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});
    // reset brush stage
    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    // get brush range selected cells
    expect(brushSelectionInstance.brushRangeCells.length).toEqual(9);
    // emit event
    expect(selectedFn).toHaveBeenCalledTimes(1);
    expect(brushSelectionFn).toHaveBeenCalledTimes(1);
  });

  test('should get brush selection range cells when row header is scroll', async () => {
    s2.setOptions({
      style: {
        rowCell: {
          width: 200,
        },
      },
    });

    s2.interaction = mockRootInteraction;
    s2.facet.setScrollOffset({
      rowHeaderScrollX: 100,
      scrollY: 0,
    });
    await s2.render();
    // ================== mouse down ==================
    emitEvent(S2Event.ROW_CELL_MOUSE_DOWN, { x: 100, y: 90 });

    s2.getCell = jest.fn(() => endBrushRowCell) as any;
    // ================== mouse move ==================
    const canvasRect = s2.getCanvasElement().getBoundingClientRect();

    emitEvent(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: canvasRect.left + 150,
      clientY: canvasRect.top + 400,
    });

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.DRAGGED,
    );

    expect(
      brushSelectionInstance.prepareSelectMaskShape.parsedStyle,
    ).toMatchObject({
      x: 100,
      y: 92,
      width: 50,
      height: 310,
    });

    // ================== mouse up ==================
    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});
    // reset brush stage
    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    // get brush range selected cells
    expect(brushSelectionInstance.brushRangeCells.length).toEqual(8);
  });

  test('should not emit brush selection event', () => {
    mockRootInteraction.getBrushSelection = () => ({
      dataCell: true,
      rowCell: false,
      colCell: true,
    });

    const brushSelectionFn = jest.fn();

    s2.on(S2Event.ROW_CELL_BRUSH_SELECTION, brushSelectionFn);

    // ================== mouse down ==================
    emitEvent(S2Event.ROW_CELL_MOUSE_DOWN, { x: 10, y: 90 });

    s2.getCell = jest.fn(() => endBrushRowCell) as any;
    // ================== mouse move ==================
    emitEvent(S2Event.GLOBAL_MOUSE_MOVE, { clientX: 180, clientY: 400 });

    // ================== mouse up ==================
    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});
    // emit event
    expect(brushSelectionFn).toHaveBeenCalledTimes(0);
  });
});
