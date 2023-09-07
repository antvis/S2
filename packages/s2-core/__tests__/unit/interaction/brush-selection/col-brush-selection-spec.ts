import { map } from 'lodash';
import * as data from '../../../data/mock-dataset.json';
import {
  ColBrushSelection,
  S2Event,
  SpreadSheet,
  RootInteraction,
  PivotSheet,
  InteractionBrushSelectionStage,
  ColCell,
  type OriginalEvent,
  type S2DataConfig,
  Node,
  CellTypes,
} from '@/index';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/root');
jest.mock('@/utils/tooltip');
jest.mock('@/cell/col-cell');

const MockRootInteraction =
  RootInteraction as unknown as jest.Mock<RootInteraction>;
const MockColCell = ColCell as unknown as jest.Mock<ColCell>;

// ColHeader: start: { x: 200, y: 0}, end: {x: 600, y: 90}
describe('Interaction Col Cell Brush Selection Tests', () => {
  let brushSelectionInstance: ColBrushSelection;
  let mockSpreadSheetInstance: SpreadSheet;
  let mockRootInteraction: RootInteraction;

  const allColHeaderCells = map(new Array(4), (a, i) => {
    const customX = 90 * i;
    return {
      cellType: CellTypes.COL_CELL,
      getMeta() {
        return {
          colIndex: i,
          rowIndex: 0,
          x: customX,
          y: 30,
          width: 90,
          height: 30,
        };
      },
    };
  });

  const startBrushColCellMeta: Partial<Node> = {
    colIndex: 0,
    rowIndex: 1,
    x: 200,
    y: 0,
  };
  const endBrushColCellMeta: Partial<Node> = {
    colIndex: 4,
    rowIndex: 3,
    x: 600,
    y: 90,
  };

  const startBrushColCell = new MockColCell();
  startBrushColCell.getMeta = () => startBrushColCellMeta as Node;

  const endBrushColCell = new MockColCell();
  endBrushColCell.getMeta = () => endBrushColCellMeta as Node;

  beforeEach(() => {
    MockRootInteraction.mockClear();

    mockSpreadSheetInstance = new PivotSheet(
      document.createElement('div'),
      data as S2DataConfig,
      {
        width: 600,
        height: 400,
        interaction: {
          brushSelection: {
            col: true,
          },
        },
        style: {
          colCfg: {
            width: 90,
            height: 30,
          },
          rowCfg: {
            width: 90,
          },
        },
      },
    );
    mockSpreadSheetInstance.container.getShape = jest.fn();
    mockSpreadSheetInstance.showTooltipWithInfo = jest.fn();
    mockRootInteraction = new MockRootInteraction(mockSpreadSheetInstance);
    mockSpreadSheetInstance.getCell = jest.fn(() => startBrushColCell) as any;
    mockRootInteraction.getAllColHeaderCells = () =>
      allColHeaderCells as unknown as ColCell[];
    mockSpreadSheetInstance.interaction = mockRootInteraction;
    mockRootInteraction.getBrushSelection = () => ({
      data: true,
      row: true,
      col: true,
    });
    mockSpreadSheetInstance.render();
    brushSelectionInstance = new ColBrushSelection(mockSpreadSheetInstance);

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
    emitEvent(S2Event.COL_CELL_MOUSE_DOWN, {
      x: 210,
      y: 60,
    });

    expect(brushSelectionInstance.spreadsheet.getCell).toHaveBeenCalled();
    expect(brushSelectionInstance.startBrushPoint).toStrictEqual({
      colIndex: startBrushColCellMeta.colIndex,
      rowIndex: startBrushColCellMeta.rowIndex,
      scrollX: 0,
      scrollY: 0,
      x: 210,
      y: 60,
    });
    expect(mockSpreadSheetInstance.interaction.getAllColHeaderCells()).toEqual(
      allColHeaderCells,
    );
  });

  test('should get end brush point when mouse up', () => {
    emitEvent(S2Event.COL_CELL_MOUSE_DOWN, {
      x: 210,
      y: 10,
    });
    mockSpreadSheetInstance.getCell = jest.fn(() => endBrushColCell) as any;

    emitEvent(S2Event.COL_CELL_MOUSE_MOVE, {
      clientX: 330,
      clientY: 60,
    });

    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});

    expect(brushSelectionInstance.spreadsheet.getCell).toHaveBeenCalled();
    expect(brushSelectionInstance.endBrushPoint).toStrictEqual({
      colIndex: endBrushColCellMeta.colIndex,
      rowIndex: endBrushColCellMeta.rowIndex,
      x: 330,
      y: 60,
    });
  });

  test('should skip brush selection if mouse move less than valid distance', () => {
    brushSelectionInstance.brushRangeCells = [];
    emitEvent(S2Event.COL_CELL_MOUSE_DOWN, {
      x: 200,
      y: 0,
    });

    emitEvent(S2Event.COL_CELL_MOUSE_MOVE, {
      clientX: 205,
      clientY: 5,
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
      S2Event.COL_CELL_BRUSH_SELECTION,
      brushSelectionFn,
    );

    // ================== mouse down ==================
    emitEvent(S2Event.COL_CELL_MOUSE_DOWN, { x: 200, y: 0 });

    mockSpreadSheetInstance.getCell = jest.fn(() => endBrushColCell) as any;
    // ================== mouse move ==================
    emitEvent(S2Event.COL_CELL_MOUSE_MOVE, {
      clientX: 600,
      clientY: 90,
    });

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.DRAGGED,
    );

    expect(brushSelectionInstance.prepareSelectMaskShape.attr()).toMatchObject({
      x: 200,
      y: 0,
      width: 400,
      height: 90,
    });

    // ================== mouse up ==================
    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});

    expect(brushSelectionInstance.isValidBrushSelection()).toBeTrue();
    // reset brush stage
    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    // get brush range selected cells
    expect(brushSelectionInstance.brushRangeCells).toHaveLength(
      allColHeaderCells.length,
    );
    // emit event
    expect(selectedFn).toHaveBeenCalledTimes(1);
    expect(brushSelectionFn).toHaveBeenCalledTimes(1);
  });

  test('should not emit brush secletion event', () => {
    mockRootInteraction.getBrushSelection = () => ({
      data: true,
      row: true,
      col: false,
    });

    const brushSelectionFn = jest.fn();

    mockSpreadSheetInstance.on(
      S2Event.COL_CELL_BRUSH_SELECTION,
      brushSelectionFn,
    );

    // ================== mouse down ==================
    emitEvent(S2Event.COL_CELL_MOUSE_DOWN, { x: 200, y: 0 });

    // ================== mouse move ==================
    emitEvent(S2Event.COL_CELL_MOUSE_MOVE, {
      clientX: 600,
      clientY: 90,
    });

    // ================== mouse up ==================
    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});
    // emit event
    expect(brushSelectionFn).toHaveBeenCalledTimes(0);
  });
});
