import { Canvas } from '@antv/g-canvas';
import EE from '@antv/event-emitter';
import { CellTypes, OriginEventType, S2Event } from '@/common/constant';
import { EventController } from '@/interaction/event-controller';
import { SpreadSheet } from '@/sheet-type';
import { RootInteraction } from '@/interaction/root';

jest.mock('@/sheet-type');

class FakeSpreadSheet extends EE {
  container: Canvas;

  interaction: RootInteraction;

  getCellType: () => CellTypes;

  getCell() {
    return {};
  }
}

describe('Interaction Event Controller Tests', () => {
  let eventController: EventController;
  let spreadsheet: FakeSpreadSheet;
  const container = document.createElement('div');

  beforeEach(() => {
    spreadsheet = new FakeSpreadSheet();
    spreadsheet.container = new Canvas({
      width: 200,
      height: 200,
      container,
    });
    spreadsheet.interaction = {} as RootInteraction;
    eventController = new EventController(
      spreadsheet as unknown as SpreadSheet,
    );
  });

  test('should bind events', () => {
    expect(eventController.bindEvents).toBeDefined();
  });

  test('should register canvas events', () => {
    const canvasEventTypes: string[] = [
      OriginEventType.MOUSE_DOWN,
      OriginEventType.MOUSE_MOVE,
      OriginEventType.MOUSE_UP,
      OriginEventType.CONTEXT_MENU,
      OriginEventType.DOUBLE_CLICK,
    ];
    expect(eventController.canvasEventHandlers).toHaveLength(
      canvasEventTypes.length,
    );
    eventController.canvasEventHandlers.forEach((item) => {
      expect(canvasEventTypes.includes(item.type)).toBeTruthy();
      expect(item.handler).toBeFunction();
    });
  });

  test('should register dom events', () => {
    const domEventTypes: string[] = [
      OriginEventType.CLICK,
      OriginEventType.KEY_DOWN,
      OriginEventType.KEY_UP,
      OriginEventType.MOUSE_UP,
    ];
    expect(eventController.domEventListeners).toHaveLength(
      domEventTypes.length,
    );
    eventController.domEventListeners.forEach((item) => {
      expect(domEventTypes.includes(item.type)).toBeTruthy();
      expect(item.handler).toBeFunction();
    });
  });

  test('should clear all events', () => {
    eventController.clearAllEvents();
    expect(eventController.canvasEventHandlers).toHaveLength(0);
    expect(eventController.domEventListeners).toHaveLength(0);
  });

  test('should get canvas container', () => {
    expect(eventController.canvasContainer).toBeDefined();
  });

  test.each([
    {
      type: CellTypes.DATA_CELL,
      event: S2Event.DATA_CELL_MOUSE_DOWN,
    },
    {
      type: CellTypes.ROW_CELL,
      event: S2Event.ROW_CELL_MOUSE_DOWN,
    },
    {
      type: CellTypes.COL_CELL,
      event: S2Event.COL_CELL_MOUSE_DOWN,
    },
    {
      type: CellTypes.CORNER_CELL,
      event: S2Event.CORNER_CELL_MOUSE_DOWN,
    },
    {
      type: CellTypes.MERGED_CELLS,
      event: S2Event.MERGED_CELLS_MOUSE_DOWN,
    },
  ])('should emit $event when $type clicked', ({ type, event }) => {
    const mouseDown = jest.fn();
    spreadsheet.getCellType = () => type;
    spreadsheet.container.emit(OriginEventType.MOUSE_DOWN, {
      target: {},
    });
    spreadsheet.on(event, mouseDown);

    expect(mouseDown).toHaveBeenCalledTimes(1);
  });
});
