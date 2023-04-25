import { map } from 'lodash';
import { getContainer } from 'tests/util/helpers';
import * as data from '../../../data/mock-dataset.json';
import {
  RowCellBrushSelection,
  S2Event,
  SpreadSheet,
  RootInteraction,
  PivotSheet,
  InteractionBrushSelectionStage,
  RowCell,
  type OriginalEvent,
  type S2DataConfig,
  Node,
  CellTypes,
} from '@/index';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/root');
jest.mock('@/utils/tooltip');

const MockRootInteraction =
  RootInteraction as unknown as jest.Mock<RootInteraction>;

// RowHeader: start: { x: 0, y: 90}, end: {x: 200, y: 400}
describe('Interaction Row Cell Brush Selection Tests', () => {
  let brushSelectionInstance: RowCellBrushSelection;
  let mockSpreadSheetInstance: SpreadSheet;
  let mockRootInteraction: RootInteraction;

  const allRowHeaderCells = map(new Array(8), (a, i) => {
    const customY = 30 * i + 30;

    return {
      cellType: CellTypes.ROW_CELL,
      getMeta() {
        return {
          rowIndex: i,
          x: 0,
          y: customY,
          width: 90,
          height: 30,
        };
      },
    } as RowCell;
  });

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

  beforeEach(() => {
    MockRootInteraction.mockClear();

    mockSpreadSheetInstance = new PivotSheet(
      getContainer(),
      data as S2DataConfig,
      {
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
      },
    );

    mockSpreadSheetInstance.showTooltipWithInfo = jest.fn();
    mockRootInteraction = new MockRootInteraction(mockSpreadSheetInstance);
    mockSpreadSheetInstance.getCell = jest.fn(() => startBrushRowCell) as any;
    mockRootInteraction.getAllRowHeaderCells = () => allRowHeaderCells;
    mockSpreadSheetInstance.interaction = mockRootInteraction;
    mockSpreadSheetInstance.render();
    brushSelectionInstance = new RowCellBrushSelection(mockSpreadSheetInstance);

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
    expect(mockSpreadSheetInstance.interaction.getAllRowHeaderCells()).toEqual(
      allRowHeaderCells,
    );
  });

  test('should get end brush point when mouse up', () => {
    emitEvent(S2Event.ROW_CELL_MOUSE_DOWN, {
      x: 10,
      y: 100,
    });
    mockSpreadSheetInstance.getCell = jest.fn(() => endBrushRowCell) as any;

    const canvasRect = mockSpreadSheetInstance
      .getCanvasElement()
      .getBoundingClientRect();

    emitEvent(S2Event.ROW_CELL_MOUSE_MOVE, {
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

    const canvasRect = mockSpreadSheetInstance
      .getCanvasElement()
      .getBoundingClientRect();

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

    mockSpreadSheetInstance.on(S2Event.GLOBAL_SELECTED, selectedFn);
    mockSpreadSheetInstance.on(
      S2Event.ROW_CELL_BRUSH_SELECTION,
      brushSelectionFn,
    );

    // ================== mouse down ==================
    emitEvent(S2Event.ROW_CELL_MOUSE_DOWN, { x: 10, y: 120 });

    mockSpreadSheetInstance.getCell = jest.fn(() => endBrushRowCell) as any;
    // ================== mouse move ==================

    const canvasRect = mockSpreadSheetInstance
      .getCanvasElement()
      .getBoundingClientRect();

    emitEvent(S2Event.ROW_CELL_MOUSE_MOVE, {
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
    expect(brushSelectionInstance.brushRangeCells).toHaveLength(
      allRowHeaderCells.length,
    );
    // emit event
    expect(selectedFn).toHaveBeenCalledTimes(1);
    expect(brushSelectionFn).toHaveBeenCalledTimes(1);
  });

  test('should get brush selection range cells when row header is scroll', () => {
    mockSpreadSheetInstance.setOptions({
      style: {
        rowCell: {
          width: 200,
        },
      },
    });
    const currentRow = map(new Array(8), (a, i) => {
      const customY = 30 * i + 30;

      return {
        cellType: CellTypes.ROW_CELL,
        getMeta() {
          return {
            rowIndex: i,
            x: i >= 4 ? 200 : 0,
            y: i >= 4 ? customY - 120 : customY,
            width: 200,
            height: 30,
          };
        },
      } as RowCell;
    });

    mockRootInteraction.getAllRowHeaderCells = () => currentRow;
    mockSpreadSheetInstance.interaction = mockRootInteraction;
    mockSpreadSheetInstance.facet.setScrollOffset({
      hRowScrollX: 100,
      scrollY: 0,
    });
    mockSpreadSheetInstance.render();
    // ================== mouse down ==================
    emitEvent(S2Event.ROW_CELL_MOUSE_DOWN, { x: 100, y: 90 });

    mockSpreadSheetInstance.getCell = jest.fn(() => endBrushRowCell) as any;
    // ================== mouse move ==================
    const canvasRect = mockSpreadSheetInstance
      .getCanvasElement()
      .getBoundingClientRect();

    emitEvent(S2Event.ROW_CELL_MOUSE_MOVE, {
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
      y: 90,
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
    expect(brushSelectionInstance.brushRangeCells).toHaveLength(
      currentRow.length / 2,
    );
  });
});
