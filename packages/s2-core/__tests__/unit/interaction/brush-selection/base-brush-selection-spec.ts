import { Group } from '@antv/g-canvas';
import { DataCell } from '@/cell/data-cell';
import { RootInteraction } from '@/interaction/root';
import {
  DataCellBrushSelection,
  InteractionBrushSelectionStage,
  type OriginalEvent,
  PivotSheet,
  S2Event,
  SpreadSheet,
  type ViewMeta,
  InterceptType,
  BaseBrushSelection,
  type Rect,
} from '@/index';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/root');
jest.mock('@/utils/tooltip');
jest.mock('@/cell/data-cell');

const MockRootInteraction =
  RootInteraction as unknown as jest.Mock<RootInteraction>;
const MockDataCell = DataCell as unknown as jest.Mock<DataCell>;

describe('Interaction Base Cell Brush Selection Tests', () => {
  let brushSelectionInstance: DataCellBrushSelection;
  let mockSpreadSheetInstance: SpreadSheet;
  let mockRootInteraction: RootInteraction;

  const startBrushDataCellMeta: Partial<ViewMeta> = {
    colIndex: 0,
    rowIndex: 1,
  };

  const startBrushDataCell = new MockDataCell();
  startBrushDataCell.getMeta = () => startBrushDataCellMeta as ViewMeta;

  const emitEvent = (type: S2Event, event: Partial<OriginalEvent>) => {
    brushSelectionInstance.spreadsheet.emit(type, {
      originalEvent: event,
      preventDefault() {},
      ...event,
    } as any);
  };

  const emitGlobalEvent = (type: S2Event, event: Partial<MouseEvent>) => {
    brushSelectionInstance.spreadsheet.emit(type, {
      ...event,
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
    mockSpreadSheetInstance.interaction = mockRootInteraction;
    mockSpreadSheetInstance.render();
    brushSelectionInstance = new DataCellBrushSelection(
      mockSpreadSheetInstance,
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
      x: 10,
      y: 20,
    });
    expect(brushSelectionInstance.prepareSelectMaskShape).toBeDefined();
    expect(
      brushSelectionInstance.prepareSelectMaskShape.attr('visible'),
    ).toBeFalsy();
  });

  // https://github.com/antvis/S2/issues/852
  test('should clear brush selection state when mouse down and context menu clicked', () => {
    const globalMouseUp = jest.fn();
    mockSpreadSheetInstance.on(S2Event.GLOBAL_MOUSE_UP, globalMouseUp);

    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, {
      x: 10,
      y: 20,
    });
    emitGlobalEvent(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: 12,
      clientY: 22,
    });

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.DRAGGED,
    );

    emitEvent(S2Event.GLOBAL_CONTEXT_MENU, {});

    expect(globalMouseUp).not.toHaveBeenCalled();
    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    expect(
      brushSelectionInstance.spreadsheet.interaction.hasIntercepts([
        InterceptType.HOVER,
      ]),
    ).toBeFalsy();
    expect(
      brushSelectionInstance.spreadsheet.interaction.hasIntercepts([
        InterceptType.BRUSH_SELECTION,
      ]),
    ).toBeFalsy();
    expect(
      brushSelectionInstance.hidePrepareSelectMaskShape,
    ).toHaveReturnedTimes(1);
  });

  test('should skip brush selection if mouse move less than valid distance', () => {
    emitEvent(S2Event.GLOBAL_MOUSE_MOVE, {});

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    expect(brushSelectionInstance.endBrushPoint).not.toBeDefined();
    expect(brushSelectionInstance.brushRangeCells).toHaveLength(0);
    expect(
      brushSelectionInstance.spreadsheet.interaction.hasIntercepts([
        InterceptType.HOVER,
      ]),
    ).toBeFalsy();
  });

  test('should return true when two rectangles cross relationship', () => {
    const rect1 = {
      minX: 0,
      minY: 0,
      maxX: 10,
      maxY: 10,
    };
    const rect2 = {
      minX: 5,
      minY: 5,
      maxX: 15,
      maxY: 15,
    };
    const baseBrushSelection = new BaseBrushSelection(mockSpreadSheetInstance);
    expect(baseBrushSelection.rectanglesIntersect(rect1, rect2)).toBeTruthy();
  });

  test('should return true when two rectangles containment relationship', () => {
    const rect1: Rect = {
      minX: 0,
      minY: 0,
      maxX: 20,
      maxY: 20,
    };
    const rect2: Rect = {
      minX: 5,
      minY: 5,
      maxX: 15,
      maxY: 15,
    };
    const baseBrushSelection = new BaseBrushSelection(mockSpreadSheetInstance);
    expect(baseBrushSelection.rectanglesIntersect(rect1, rect2)).toBeTruthy();
  });

  test('should return false when two rectangles is not cross relationship', () => {
    const rect1: Rect = {
      minX: 0,
      minY: 0,
      maxX: 10,
      maxY: 10,
    };
    const rect2: Rect = {
      minX: 10,
      minY: 10,
      maxX: 15,
      maxY: 15,
    };
    const baseBrushSelection = new BaseBrushSelection(mockSpreadSheetInstance);
    expect(baseBrushSelection.rectanglesIntersect(rect1, rect2)).toBeFalsy();
  });
});
