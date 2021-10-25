import { Canvas, BBox } from '@antv/g-canvas';
import { createFakeSpreadSheet } from 'tests/util/helpers';
import { EmitterType } from '@/common/interface/emitter';
import {
  CellTypes,
  InterceptType,
  OriginEventType,
  S2Event,
} from '@/common/constant';
import { EventController } from '@/interaction/event-controller';
import { SpreadSheet } from '@/sheet-type';
import { RootInteraction } from '@/interaction/root';
import { S2Options } from '@/common/interface';
import { BaseFacet } from '@/facet';

jest.mock('@/interaction/brush-selection');
jest.mock('@/interaction/base-interaction/click/row-column-click');
jest.mock('@/interaction/base-interaction/click/data-cell-click');
jest.mock('@/interaction/base-interaction/hover');

const s2Options: S2Options = {
  width: 200,
  height: 200,
  tooltip: {
    showTooltip: true,
  },
  interaction: {
    enableCopy: true,
    autoResetSheetStyle: true,
  },
};

describe('Interaction Event Controller Tests', () => {
  let eventController: EventController;
  let spreadsheet: SpreadSheet;

  const expectEvents =
    (eventType: OriginEventType, callback?: () => void) =>
    (options: { eventNames: (keyof EmitterType)[]; type: CellTypes }) => {
      const { eventNames, type } = options;
      const mockEvent = {
        target: undefined,
        preventDefault: () => {},
        originalEvent: {},
        stopPropagation: () => {},
      };
      spreadsheet.getCellType = () => type;
      spreadsheet.getCell = () =>
        ({
          cellType: type,
          getMeta: () => {},
        } as any);

      eventNames.forEach((eventName) => {
        const eventHandler = jest.fn();
        spreadsheet.on(eventName, eventHandler);
        spreadsheet.container.emit(eventType, mockEvent);
        expect(eventHandler).toHaveBeenCalledWith(mockEvent);
      });

      callback?.();
    };

  beforeEach(() => {
    const container = document.createElement('div');
    spreadsheet = createFakeSpreadSheet();
    spreadsheet.container = new Canvas({
      ...s2Options,
      container,
    });
    spreadsheet.facet = {
      panelBBox: {
        maxX: s2Options.width,
        maxY: s2Options.height,
      } as BBox,
    } as BaseFacet;
    spreadsheet.interaction = new RootInteraction(
      spreadsheet as unknown as SpreadSheet,
    );
    spreadsheet.interaction.reset = jest.fn();
    spreadsheet.interaction.removeIntercepts = jest.fn();
    spreadsheet.interaction.intercepts.clear();
    spreadsheet.getCell = () => ({} as any);
    spreadsheet.options = s2Options;
    spreadsheet.tooltip.container.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      } as DOMRect);
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
      eventNames: [S2Event.DATA_CELL_MOUSE_DOWN],
    },
    {
      type: CellTypes.ROW_CELL,
      eventNames: [S2Event.ROW_CELL_MOUSE_DOWN],
    },
    {
      type: CellTypes.COL_CELL,
      eventNames: [S2Event.COL_CELL_MOUSE_DOWN],
    },
    {
      type: CellTypes.CORNER_CELL,
      eventNames: [S2Event.CORNER_CELL_MOUSE_DOWN],
    },
    {
      type: CellTypes.MERGED_CELLS,
      eventNames: [S2Event.MERGED_CELLS_MOUSE_DOWN],
    },
  ])('should emit mouse down for %o', expectEvents(OriginEventType.MOUSE_DOWN));

  test.each([
    {
      type: CellTypes.DATA_CELL,
      eventNames: [
        S2Event.DATA_CELL_MOUSE_MOVE,
        S2Event.DATA_CELL_HOVER,
        S2Event.GLOBAL_HOVER,
      ],
    },
    {
      type: CellTypes.ROW_CELL,
      eventNames: [
        S2Event.ROW_CELL_MOUSE_MOVE,
        S2Event.ROW_CELL_HOVER,
        S2Event.GLOBAL_HOVER,
      ],
    },
    {
      type: CellTypes.COL_CELL,
      eventNames: [
        S2Event.COL_CELL_MOUSE_MOVE,
        S2Event.COL_CELL_HOVER,
        S2Event.GLOBAL_HOVER,
      ],
    },
    {
      type: CellTypes.CORNER_CELL,
      eventNames: [
        S2Event.CORNER_CELL_MOUSE_MOVE,
        S2Event.CORNER_CELL_HOVER,
        S2Event.GLOBAL_HOVER,
      ],
    },
    {
      type: CellTypes.MERGED_CELLS,
      eventNames: [
        S2Event.MERGED_CELLS_MOUSE_MOVE,
        S2Event.MERGED_CELLS_HOVER,
        S2Event.GLOBAL_HOVER,
      ],
    },
  ])(
    'should emit mouse move and hover for %s',
    expectEvents(OriginEventType.MOUSE_MOVE),
  );

  test.each([
    {
      type: CellTypes.DATA_CELL,
      eventNames: [S2Event.DATA_CELL_MOUSE_UP],
    },
    {
      type: CellTypes.ROW_CELL,
      eventNames: [S2Event.ROW_CELL_MOUSE_UP],
    },
    {
      type: CellTypes.COL_CELL,
      eventNames: [S2Event.COL_CELL_MOUSE_UP],
    },
    {
      type: CellTypes.CORNER_CELL,
      eventNames: [S2Event.CORNER_CELL_MOUSE_UP],
    },
    {
      type: CellTypes.MERGED_CELLS,
      eventNames: [S2Event.MERGED_CELLS_MOUSE_UP],
    },
  ])(
    'should emit mouse up and hover for %s',
    expectEvents(OriginEventType.MOUSE_UP),
  );

  test.each([
    {
      type: CellTypes.DATA_CELL,
      eventNames: [S2Event.DATA_CELL_DOUBLE_CLICK],
    },
    {
      type: CellTypes.ROW_CELL,
      eventNames: [S2Event.ROW_CELL_DOUBLE_CLICK],
    },
    {
      type: CellTypes.COL_CELL,
      eventNames: [S2Event.COL_CELL_DOUBLE_CLICK],
    },
    {
      type: CellTypes.CORNER_CELL,
      eventNames: [S2Event.CORNER_CELL_DOUBLE_CLICK],
    },
    {
      type: CellTypes.MERGED_CELLS,
      eventNames: [S2Event.MERGED_CELLS_DOUBLE_CLICK],
    },
  ])(
    'should emit double click for %s',
    expectEvents(OriginEventType.DOUBLE_CLICK),
  );

  test('should emit global context menu event', () => {
    const mockEvent = {
      preventDefault: () => {},
      originalEvent: {},
    };
    const contextMenu = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_CONTEXT_MENU, contextMenu);
    spreadsheet.container.emit(OriginEventType.CONTEXT_MENU, mockEvent);
    expect(contextMenu).toHaveBeenCalledWith(mockEvent);
  });

  test('should emit global mouse up event', () => {
    const mouseUp = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_MOUSE_UP, mouseUp);

    window.dispatchEvent(new Event('mouseup'));

    expect(mouseUp).toHaveBeenCalled();
  });

  test('should emit global keyboard up event', () => {
    const keyboardUp = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, keyboardUp);

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'q' }));

    expect(keyboardUp).toHaveBeenCalled();
  });

  test('should emit global keyboard down event', () => {
    const keyboardDown = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_KEYBOARD_DOWN, keyboardDown);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    expect(keyboardDown).toHaveBeenCalled();
  });

  test("should dont't reset if current interaction has brush selection", () => {
    spreadsheet.interaction.addIntercepts([InterceptType.BRUSH_SELECTION]);
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    document.dispatchEvent(new Event('click', {}));

    expect(spreadsheet.interaction.removeIntercepts).toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
  });

  test("should dont't reset if current mouse on the canvas container", () => {
    const containsMock = jest
      .spyOn(HTMLElement.prototype, 'contains')
      .mockImplementation(() => true);

    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    document.dispatchEvent(
      new MouseEvent('click', {
        clientX: 100,
        clientY: 100,
      } as MouseEventInit),
    );

    expect(containsMock).toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  test('should reset if current mouse outside the canvas container', () => {
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    document.dispatchEvent(
      new MouseEvent('click', {
        clientX: 300,
        clientY: 300,
      } as MouseEventInit),
    );

    expect(reset).toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).toHaveBeenCalled();
  });

  test('should reset if current mouse inside the canvas container, but outside the panel facet', () => {
    spreadsheet.facet = {
      panelBBox: {
        maxX: 100,
        maxY: 100,
      } as BBox,
    } as BaseFacet;
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    document.dispatchEvent(
      new MouseEvent('click', {
        clientX: 120,
        clientY: 120,
      } as MouseEventInit),
    );

    expect(reset).toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).toHaveBeenCalled();
  });

  test('should reset if press ecs', () => {
    spreadsheet.facet = {
      panelBBox: {
        maxX: 100,
        maxY: 100,
      } as BBox,
    } as BaseFacet;
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(reset).toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).toHaveBeenCalled();
  });

  test("should dont't reset if current mouse on the tooltip and outside the canvas container", () => {
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);
    spreadsheet.tooltip.container.getBoundingClientRect = () =>
      ({
        x: 200,
        y: 200,
        width: 200,
        height: 200,
      } as DOMRect);

    document.dispatchEvent(
      new MouseEvent('click', {
        clientX: 300,
        clientY: 300,
      } as MouseEventInit),
    );

    expect(reset).not.toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  // https://github.com/antvis/S2/issues/363
  test('should reset if current mouse outside the canvas container and disable tooltip', () => {
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);
    Object.defineProperty(spreadsheet.options.tooltip, 'showTooltip', {
      get() {
        return false;
      },
    });

    document.dispatchEvent(
      new MouseEvent('click', {
        clientX: 100,
        clientY: 100,
      } as MouseEventInit),
    );

    expect(reset).not.toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  test('should disable reset if autoResetSheetStyle set to false', () => {
    spreadsheet.facet = {
      panelBBox: {
        maxX: 100,
        maxY: 100,
      } as BBox,
    } as BaseFacet;
    spreadsheet.setOptions({
      interaction: {
        autoResetSheetStyle: false,
      },
    });
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    document.dispatchEvent(
      new MouseEvent('click', {
        clientX: 120,
        clientY: 120,
      } as MouseEventInit),
    );

    expect(reset).not.toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(reset).not.toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
    spreadsheet.setOptions({
      interaction: {
        autoResetSheetStyle: true,
      },
    });
  });
});
