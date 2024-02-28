import { Group } from '@antv/g';
import { getContainer } from 'tests/util/helpers';
import { DataCell } from '@/cell/data-cell';
import type { BBox } from '@/engine';
import {
  BaseBrushSelection,
  DataCellBrushSelection,
  InteractionBrushSelectionStage,
  InterceptType,
  PivotSheet,
  S2Event,
  SpreadSheet,
  type OriginalEvent,
  type S2DataConfig,
  type ViewMeta,
  EventController,
} from '@/index';
import { RootInteraction } from '@/interaction/root';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/root');
jest.mock('@/utils/tooltip');
jest.mock('@/cell/data-cell');

const MockRootInteraction =
  RootInteraction as unknown as jest.Mock<RootInteraction>;
const MockDataCell = DataCell as unknown as jest.Mock<DataCell>;

describe('Interaction Base Cell Brush Selection Tests', () => {
  let brushSelectionInstance: DataCellBrushSelection;
  let s2: SpreadSheet;
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

  beforeEach(async () => {
    MockRootInteraction.mockClear();

    s2 = new PivotSheet(getContainer(), null as unknown as S2DataConfig, null);
    await s2.render();

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
    s2.getCell = jest.fn(() => startBrushDataCell) as any;
    s2.facet.foregroundGroup = new Group();
    s2.showTooltipWithInfo = jest.fn();
    s2.interaction = mockRootInteraction;
    brushSelectionInstance = new DataCellBrushSelection(s2);
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

    s2.on(S2Event.GLOBAL_MOUSE_UP, globalMouseUp);

    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, {
      x: 10,
      y: 20,
    });

    const canvasRect = s2.getCanvasElement().getBoundingClientRect();

    emitGlobalEvent(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: canvasRect.left + 12,
      clientY: canvasRect.top + 22,
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
        InterceptType.DATA_CELL_BRUSH_SELECTION,
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
    } as BBox;
    const rect2 = {
      minX: 5,
      minY: 5,
      maxX: 15,
      maxY: 15,
    } as BBox;
    const baseBrushSelection = new BaseBrushSelection(s2);

    expect(baseBrushSelection.rectanglesIntersect(rect1, rect2)).toBeTruthy();
  });

  test('should return true when two rectangles containment relationship', () => {
    const rect1 = {
      minX: 0,
      minY: 0,
      maxX: 20,
      maxY: 20,
    } as BBox;
    const rect2 = {
      minX: 5,
      minY: 5,
      maxX: 15,
      maxY: 15,
    } as BBox;
    const baseBrushSelection = new BaseBrushSelection(s2);

    expect(baseBrushSelection.rectanglesIntersect(rect1, rect2)).toBeTruthy();
  });

  test('should return false when two rectangles is not cross relationship', () => {
    const rect1 = {
      minX: 0,
      minY: 0,
      maxX: 10,
      maxY: 10,
    } as BBox;
    const rect2 = {
      minX: 10,
      minY: 10,
      maxX: 15,
      maxY: 15,
    } as BBox;
    const baseBrushSelection = new BaseBrushSelection(s2);

    expect(baseBrushSelection.rectanglesIntersect(rect1, rect2)).toBeFalsy();
  });
});
