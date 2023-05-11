import { map } from 'lodash';
import { getContainer } from 'tests/util/helpers';
import * as data from '../../../data/mock-dataset.json';
import type { PivotFacet } from '../../../../src/facet';
import {
  ColCellBrushSelection,
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

const MockRootInteraction =
  RootInteraction as unknown as jest.Mock<RootInteraction>;

// ColHeader: start: { x: 200, y: 0}, end: {x: 600, y: 90}
describe('Interaction Col Cell Brush Selection Tests', () => {
  let brushSelectionInstance: ColCellBrushSelection;
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

  const startBrushColCell = Object.assign(Object.create(ColCell.prototype), {
    getMeta: () => startBrushColCellMeta as Node,
  }) as unknown as ColCell;

  const endBrushColCell = Object.assign(Object.create(ColCell.prototype), {
    getMeta: () => endBrushColCellMeta as Node,
  }) as unknown as ColCell;

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
            colCell: true,
          },
        },
        style: {
          colCell: {
            width: 90,
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
    mockSpreadSheetInstance.getCell = jest.fn(() => startBrushColCell) as any;
    mockSpreadSheetInstance.facet = {
      getColCells: () => allColHeaderCells,
      destroy: jest.fn(),
      render: jest.fn(),
      getHiddenColumnsInfo: jest.fn(),
    } as unknown as PivotFacet;
    mockSpreadSheetInstance.interaction = mockRootInteraction;
    mockSpreadSheetInstance.render();
    brushSelectionInstance = new ColCellBrushSelection(mockSpreadSheetInstance);

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
    expect(mockSpreadSheetInstance.facet.getColCells()).toEqual(
      allColHeaderCells,
    );
  });

  test('should get end brush point when mouse up', () => {
    emitEvent(S2Event.COL_CELL_MOUSE_DOWN, {
      x: 210,
      y: 10,
    });
    mockSpreadSheetInstance.getCell = jest.fn(() => endBrushColCell) as any;

    const canvasRect = mockSpreadSheetInstance
      .getCanvasElement()
      .getBoundingClientRect();

    emitEvent(S2Event.COL_CELL_MOUSE_MOVE, {
      clientX: canvasRect.left + 330,
      clientY: canvasRect.top + 60,
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

    const canvasRect = mockSpreadSheetInstance
      .getCanvasElement()
      .getBoundingClientRect();

    emitEvent(S2Event.COL_CELL_MOUSE_MOVE, {
      clientX: canvasRect.left + 205,
      clientY: canvasRect.top + 5,
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
    const canvasRect = mockSpreadSheetInstance
      .getCanvasElement()
      .getBoundingClientRect();

    emitEvent(S2Event.COL_CELL_MOUSE_MOVE, {
      clientX: canvasRect.left + 600,
      clientY: canvasRect.top + 90,
    });

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.DRAGGED,
    );

    expect(
      brushSelectionInstance.prepareSelectMaskShape.parsedStyle,
    ).toMatchObject({
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
    expect(brushSelectionInstance.brushRangeCells.length).toEqual(
      allColHeaderCells.length,
    );
    // emit event
    expect(selectedFn).toHaveBeenCalledTimes(1);
    expect(brushSelectionFn).toHaveBeenCalledTimes(1);
  });
});
