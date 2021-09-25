import { Group } from '@antv/g-canvas';
import { range } from 'lodash';
import { RootInteraction } from '@/interaction/root';
import {
  BrushSelection,
  CellTypes,
  DataCell,
  InteractionBrushSelectionStage,
  InterceptType,
  OriginalEvent,
  PivotSheet,
  S2CellType,
  S2Event,
  SpreadSheet,
  ViewMeta,
} from '@/index';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/root');
jest.mock('@/utils/tooltip');

const MockRootInteraction =
  RootInteraction as unknown as jest.Mock<RootInteraction>;

describe('Interaction Brush Selection Tests', () => {
  let brushSelectionInstance: BrushSelection;
  let mockSpreadSheetInstance: SpreadSheet;
  let mockRootInteraction: RootInteraction;

  const startBrushDataCellMeta: Partial<ViewMeta> = {
    colIndex: 0,
    rowIndex: 1,
  };
  const endBrushDataCellMeta: Partial<ViewMeta> = {
    colIndex: 4,
    rowIndex: 3,
  };

  const startBrushDataCell = {
    type: CellTypes.DATA_CELL,
    getMeta: () => startBrushDataCellMeta,
  } as unknown as S2CellType;

  const endBrushDataCell = {
    type: CellTypes.DATA_CELL,
    getMeta: () => endBrushDataCellMeta,
  } as unknown as S2CellType;

  const panelGroupAllDataCells = Array.from<number[]>({ length: 4 })
    .fill(range(10))
    .reduce<DataCell[]>((arr, v, i) => {
      v.forEach((_, j) => {
        const cell = {
          cellType: CellTypes.DATA_CELL,
          getMeta() {
            return {
              colIndex: j,
              rowIndex: i,
            } as ViewMeta;
          },
        } as DataCell;
        arr.push(cell);
      });
      return arr;
    }, []);

  const emitEvent = (type: S2Event, event: Partial<OriginalEvent>) => {
    brushSelectionInstance.spreadsheet.emit(type, {
      originalEvent: event,
      preventDefault() {},
    } as any);
  };

  beforeEach(() => {
    MockRootInteraction.mockClear();

    mockSpreadSheetInstance = new PivotSheet(
      document.createElement('div'),
      null,
      null,
    );
    mockRootInteraction = new MockRootInteraction(mockSpreadSheetInstance);
    mockSpreadSheetInstance.getCell = jest.fn(() => startBrushDataCell) as any;
    mockSpreadSheetInstance.foregroundGroup = new Group('');
    mockSpreadSheetInstance.showTooltipWithInfo = jest.fn();
    mockRootInteraction.getPanelGroupAllDataCells = () =>
      panelGroupAllDataCells;
    brushSelectionInstance = new BrushSelection(
      mockSpreadSheetInstance,
      mockRootInteraction,
    );
    brushSelectionInstance.brushSelectionStage =
      InteractionBrushSelectionStage.UN_DRAGGED;
    brushSelectionInstance.hidePrepareSelectMaskShape = jest.fn();
  });

  test('should register events', () => {
    expect(brushSelectionInstance.bindEvents).toBeDefined();
  });

  test('should not render invisible prepare select mask shape after rendered', () => {
    expect(brushSelectionInstance.prepareSelectMaskShape).not.toBeDefined();
  });

  test('should init brush selection stage', () => {
    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
  });

  test('should render invisible prepare select mask shape after mouse down on the data cell', () => {
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, {
      layerX: 10,
      layerY: 20,
    });
    expect(brushSelectionInstance.prepareSelectMaskShape).toBeDefined();
    expect(
      brushSelectionInstance.prepareSelectMaskShape.attr('visible'),
    ).toBeFalsy();
  });

  test('should get start brush point when mouse down', () => {
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, {
      layerX: 10,
      layerY: 20,
    });
    expect(brushSelectionInstance.spreadsheet.getCell).toHaveBeenCalled();
    expect(brushSelectionInstance.startBrushPoint).toStrictEqual({
      x: 10,
      y: 20,
      rowIndex: 1,
      colIndex: 0,
    });
    expect(brushSelectionInstance.displayedDataCells).toEqual(
      panelGroupAllDataCells,
    );
  });

  test('should skip brush selection if mouse not dragged', () => {
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, {
      layerX: 10,
      layerY: 20,
    });
    emitEvent(S2Event.DATA_CELL_MOUSE_MOVE, {
      layerX: 12,
      layerY: 22,
    });
    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    expect(
      brushSelectionInstance.interaction.hasIntercepts([
        InterceptType.BRUSH_SELECTION,
      ]),
    ).toBeFalsy();

    // 如果刷选距离过短, 则走单选的逻辑, 需要隐藏刷选提示框
    expect(
      brushSelectionInstance.hidePrepareSelectMaskShape,
    ).toHaveBeenCalled();
  });

  test('should skip brush selection if mouse move less than valid distance', () => {
    emitEvent(S2Event.DATA_CELL_MOUSE_MOVE, {});

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    expect(brushSelectionInstance.endBrushPoint).not.toBeDefined();
    expect(brushSelectionInstance.brushRangeDataCells).toHaveLength(0);
    expect(
      brushSelectionInstance.interaction.hasIntercepts([InterceptType.HOVER]),
    ).toBeFalsy();
  });

  test('should get brush selection range cells', () => {
    mockSpreadSheetInstance.getCell = jest.fn(() => endBrushDataCell) as any;

    // ================== mouse down ==================
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, { layerX: 10, layerY: 20 });

    // ================== mouse move ==================
    emitEvent(S2Event.DATA_CELL_MOUSE_MOVE, { layerX: 100, layerY: 200 });
    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.DRAGGED,
    );
    // get end brush point
    expect(brushSelectionInstance.endBrushPoint).toEqual({
      ...endBrushDataCellMeta,
      x: 100,
      y: 200,
    });
    // show prepare brush selection mask
    expect(brushSelectionInstance.prepareSelectMaskShape.attr()).toMatchObject({
      x: 10,
      y: 20,
      width: 90,
      height: 180,
    });

    // ================== mouse up ==================
    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});
    expect(
      brushSelectionInstance.prepareSelectMaskShape.attr('visible'),
    ).toBeFalsy();
    expect(mockSpreadSheetInstance.showTooltipWithInfo).toHaveBeenCalled();
    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    // get brush range selected cells
    expect(brushSelectionInstance.brushRangeDataCells).toHaveLength(1);
    brushSelectionInstance.brushRangeDataCells.forEach((cell) => {
      const { rowIndex, colIndex } = cell.getMeta();
      expect(rowIndex).toBeLessThanOrEqual(endBrushDataCellMeta.rowIndex);
      expect(rowIndex).toBeGreaterThanOrEqual(startBrushDataCellMeta.rowIndex);
      expect(colIndex).toBeLessThanOrEqual(endBrushDataCellMeta.colIndex);
      expect(colIndex).toBeGreaterThanOrEqual(startBrushDataCellMeta.colIndex);
    });
  });
});
