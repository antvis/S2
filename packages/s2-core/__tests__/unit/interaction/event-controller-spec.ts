/* eslint-disable jest/expect-expect */
import { Canvas, type BBox, type CanvasCfg, Shape } from '@antv/g-canvas';
import { createFakeSpreadSheet } from 'tests/util/helpers';
import { GuiIcon } from '@/common';
import type { EmitterType } from '@/common/interface/emitter';
import {
  CellTypes,
  InteractionKeyboardKey,
  InteractionStateName,
  InterceptType,
  OriginEventType,
  S2Event,
} from '@/common/constant';
import { EventController } from '@/interaction/event-controller';
import type { SpreadSheet } from '@/sheet-type';
import { RootInteraction } from '@/interaction/root';
import type { CellMeta, S2Options } from '@/common/interface';
import type { BaseFacet } from '@/facet';

const MOCK_COPY_DATA = 'data';

jest.mock('@/interaction/brush-selection/data-cell-brush-selection.ts');
jest.mock('@/interaction/base-interaction/click/row-column-click');
jest.mock('@/interaction/base-interaction/click/data-cell-click');
jest.mock('@/interaction/base-interaction/hover');
jest.mock('@/utils/export/copy', () => {
  const originalModule = jest.requireActual('@/utils/export/copy');
  return {
    __esModule: true,
    ...originalModule,
    getSelectedData: jest.fn(() => MOCK_COPY_DATA),
  };
});

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

// 定义一个变量来存储原始 MouseEvent
let OriginalMouseEvent: typeof MouseEvent;

class CustomMouseEvent extends MouseEvent {
  constructor(eventType: string, eventInitDict?: MouseEventInit) {
    super(eventType, eventInitDict);
  }
}

describe('Interaction Event Controller Tests', () => {
  let eventController: EventController;
  let spreadsheet: SpreadSheet;

  const mockEvent = {
    target: undefined,
    preventDefault: () => {},
    originalEvent: {},
    stopPropagation: () => {},
  };

  const expectEvents =
    (eventType: OriginEventType, callback?: () => void) =>
    (options: { eventNames: (keyof EmitterType)[]; type: CellTypes }) => {
      const { eventNames, type } = options;
      spreadsheet.getCellType = () => type;
      spreadsheet.getCell = () =>
        ({
          cellType: type,
          getMeta: () => {},
        } as any);

      eventNames.forEach((eventName) => {
        const eventHandler = jest.fn();
        spreadsheet.once(eventName, eventHandler);
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
    } as CanvasCfg);
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
    Object.defineProperty(eventController, 'isCanvasEffect', {
      value: true,
    });
    OriginalMouseEvent = MouseEvent;
    (global as any).MouseEvent = CustomMouseEvent;
  });

  afterEach(() => {
    spreadsheet.setOptions({
      interaction: {
        autoResetSheetStyle: true,
      },
    });
    (global as any).MouseEvent = OriginalMouseEvent;
  });

  test('should bind events', () => {
    expect(eventController.bindEvents).toBeDefined();
  });

  test('should register canvas events', () => {
    const canvasEventTypes: string[] = [
      OriginEventType.MOUSE_DOWN,
      OriginEventType.MOUSE_MOVE,
      OriginEventType.MOUSE_UP,
      OriginEventType.MOUSE_OUT,
      OriginEventType.CONTEXT_MENU,
      OriginEventType.DOUBLE_CLICK,
      OriginEventType.CLICK,
    ];
    expect(eventController.canvasEventHandlers).toHaveLength(
      canvasEventTypes.length,
    );
    eventController.canvasEventHandlers.forEach((item) => {
      expect(canvasEventTypes.includes(item.type)).toBeTruthy();
      expect(item.handler).toBeFunction();
    });
  });

  test('should register s2 events', () => {
    const s2EventTypes: S2Event[] = [S2Event.GLOBAL_ACTION_ICON_CLICK];

    expect(eventController.s2EventHandlers).toHaveLength(s2EventTypes.length);
    eventController.s2EventHandlers.forEach((item) => {
      expect(s2EventTypes.includes(item.type)).toBeTruthy();
      expect(item.handler).toBeFunction();
    });
  });

  test('should register dom events', () => {
    const domEventTypes: string[] = [
      OriginEventType.CLICK,
      OriginEventType.KEY_DOWN,
      OriginEventType.KEY_UP,
      OriginEventType.MOUSE_UP,
      OriginEventType.MOUSE_MOVE,
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
    expect(eventController.s2EventHandlers).toHaveLength(0);
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
      type: CellTypes.MERGED_CELL,
      eventNames: [S2Event.MERGED_CELLS_MOUSE_DOWN],
    },
  ])(
    'should emit mouse down event for %o',
    expectEvents(OriginEventType.MOUSE_DOWN),
  );

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
      type: CellTypes.MERGED_CELL,
      eventNames: [
        S2Event.MERGED_CELLS_MOUSE_MOVE,
        S2Event.MERGED_CELLS_HOVER,
        S2Event.GLOBAL_HOVER,
      ],
    },
  ])(
    'should emit mouse move and hover event for %s',
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
      type: CellTypes.MERGED_CELL,
      eventNames: [S2Event.MERGED_CELLS_MOUSE_UP],
    },
  ])(
    'should emit mouse up and click event for %s',
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
      type: CellTypes.MERGED_CELL,
      eventNames: [S2Event.MERGED_CELLS_DOUBLE_CLICK],
    },
  ])(
    'should emit double click event for %s',
    expectEvents(OriginEventType.DOUBLE_CLICK),
  );

  test.each([
    {
      type: CellTypes.DATA_CELL,
      eventNames: [S2Event.DATA_CELL_CONTEXT_MENU, S2Event.GLOBAL_CONTEXT_MENU],
    },
    {
      type: CellTypes.ROW_CELL,
      eventNames: [S2Event.ROW_CELL_CONTEXT_MENU, S2Event.GLOBAL_CONTEXT_MENU],
    },
    {
      type: CellTypes.COL_CELL,
      eventNames: [S2Event.COL_CELL_CONTEXT_MENU, S2Event.GLOBAL_CONTEXT_MENU],
    },
    {
      type: CellTypes.CORNER_CELL,
      eventNames: [
        S2Event.CORNER_CELL_CONTEXT_MENU,
        S2Event.GLOBAL_CONTEXT_MENU,
      ],
    },
    {
      type: CellTypes.MERGED_CELL,
      eventNames: [
        S2Event.MERGED_CELLS_CONTEXT_MENU,
        S2Event.GLOBAL_CONTEXT_MENU,
      ],
    },
  ])(
    'should emit context menu event for %s',
    expectEvents(OriginEventType.CONTEXT_MENU),
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

  test('should copy data', () => {
    const copied = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_COPIED, copied);

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: InteractionKeyboardKey.ESC,
      }),
    );
    expect(copied).not.toHaveBeenCalled();

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: InteractionKeyboardKey.COPY,
        metaKey: true,
      }),
    );
    expect(copied).toHaveBeenCalledWith(MOCK_COPY_DATA);
  });

  test('should not trigger sheet copy event if outside the canvas container', () => {
    window.dispatchEvent(new Event('click', {}));

    const copied = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_COPIED, copied);

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: InteractionKeyboardKey.COPY,
        metaKey: true,
      }),
    );
    expect(copied).not.toHaveBeenCalled();
  });

  test('should not reset if current interaction has brush selection', () => {
    spreadsheet.interaction.addIntercepts([InterceptType.BRUSH_SELECTION]);
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    window.dispatchEvent(new Event('click', {}));

    expect(spreadsheet.interaction.removeIntercepts).toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
  });

  test('should not reset if current mouse on the canvas container', () => {
    const containsMock = jest
      .spyOn(HTMLElement.prototype, 'contains')
      .mockImplementation(() => true);

    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    window.dispatchEvent(
      new MouseEvent('click', {
        clientX: 100,
        clientY: 100,
      } as MouseEventInit),
    );

    expect(containsMock).toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  test('should reset if current mouse not on the canvas container', () => {
    const containsMock = jest
      .spyOn(HTMLElement.prototype, 'contains')
      .mockImplementation(() => true);
    spreadsheet.hideTooltip = jest.fn();
    const reset = jest.fn().mockImplementation(() => {
      spreadsheet.hideTooltip();
    });
    spreadsheet.tooltip.show = jest.fn();

    spreadsheet.on(S2Event.GLOBAL_RESET, reset);
    spreadsheet.tooltip.show({
      position: {
        x: 100,
        y: 100,
      },
      content: 'test style reset',
    });
    spreadsheet.interaction.addIntercepts([InterceptType.HOVER]);
    window.dispatchEvent(
      new MouseEvent('click', {
        clientX: 1000,
        clientY: 1000,
      } as MouseEventInit),
    );

    expect(containsMock).toHaveBeenCalled();
    expect(reset).toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).toHaveBeenCalled();
    expect(spreadsheet.hideTooltip).toHaveBeenCalled();
  });

  test('should reset if current mouse outside the canvas container', () => {
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    window.dispatchEvent(
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

    window.dispatchEvent(
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

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: InteractionKeyboardKey.ESC }),
    );

    expect(reset).toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).toHaveBeenCalled();
  });

  test('should not reset if current mouse on the tooltip and outside the canvas container', () => {
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);
    spreadsheet.tooltip.visible = true;
    spreadsheet.tooltip.container.getBoundingClientRect = () =>
      ({
        x: 200,
        y: 200,
        width: 200,
        height: 200,
      } as DOMRect);

    window.dispatchEvent(
      new MouseEvent('click', {
        clientX: 300,
        clientY: 300,
      } as MouseEventInit),
    );

    expect(reset).not.toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  test('should not reset if current mouse not on the tooltip container but on the tooltip children container', () => {
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    // https://github.com/antvis/S2/pull/1352
    const cTooltipParent = document.createElement('div');
    const cTooltipChild = document.createElement('div');
    cTooltipParent.setAttribute(
      'style',
      'position: relative; width: 200px; height: 200px;',
    );
    cTooltipParent.innerHTML = '创建一个div 模拟tooltip装载了一个”弹出层“元素';
    cTooltipChild.setAttribute(
      'style',
      'position: absolute; top: 0; left: 0; width: 300px; height: 300px;',
    );
    cTooltipChild.innerHTML = '我是”弹出层“元素';
    cTooltipParent.appendChild(cTooltipChild);
    document.body.appendChild(cTooltipParent);

    spreadsheet.tooltip.visible = true;
    spreadsheet.tooltip.container = cTooltipParent;
    spreadsheet.tooltip.container.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        width: 200,
        height: 200,
      } as DOMRect);

    cTooltipChild.dispatchEvent(
      new MouseEvent('click', {
        clientX: 233,
        clientY: 233,
        bubbles: true,
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

    window.dispatchEvent(
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

    window.dispatchEvent(
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
  });

  test('should hide tooltip and clear hover highlight cell if current mouse outside the canvas', () => {
    spreadsheet.interaction.changeState({
      cells: [{} as CellMeta],
      stateName: InteractionStateName.HOVER,
    });
    spreadsheet.container.emit(OriginEventType.MOUSE_OUT, {
      shape: null,
    });

    expect(spreadsheet.interaction.reset).toHaveBeenCalled();
    expect(spreadsheet.hideTooltip).toHaveBeenCalled();
    expect(spreadsheet.interaction.getActiveCells()).toHaveLength(0);
  });

  test('should not hide tooltip if mouse move inside the canvas', () => {
    spreadsheet.interaction.changeState({
      cells: [{} as CellMeta],
      stateName: InteractionStateName.SELECTED,
    });
    spreadsheet.container.emit(OriginEventType.MOUSE_OUT, {
      shape: 'mock',
    });

    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  test('should not hide tooltip if mouse outside the canvas and has selected cells', () => {
    spreadsheet.interaction.changeState({
      cells: [{} as CellMeta],
      stateName: InteractionStateName.SELECTED,
    });
    spreadsheet.container.emit(OriginEventType.MOUSE_OUT, {
      shape: null,
    });

    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  test('should disable reset if mouse outside the canvas and autoResetSheetStyle set to false', () => {
    spreadsheet.setOptions({
      interaction: {
        autoResetSheetStyle: false,
      },
    });

    spreadsheet.container.emit(OriginEventType.MOUSE_OUT, {
      shape: null,
    });
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  test('should disable reset if mouse outside the canvas and action tooltip is active', () => {
    spreadsheet.interaction.addIntercepts([InterceptType.HOVER]);

    spreadsheet.container.emit(OriginEventType.MOUSE_OUT, {
      shape: null,
    });
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  // https://github.com/antvis/S2/issues/1172
  test.each([
    { type: OriginEventType.KEY_DOWN, event: S2Event.GLOBAL_KEYBOARD_DOWN },
    { type: OriginEventType.KEY_UP, event: S2Event.GLOBAL_KEYBOARD_UP },
    { type: OriginEventType.MOUSE_UP, event: S2Event.GLOBAL_MOUSE_UP },
    { type: OriginEventType.MOUSE_MOVE, event: S2Event.GLOBAL_MOUSE_MOVE },
  ])(
    'should not prevent default original event if controller emitted global event %o',
    ({ type, event }) => {
      jest
        .spyOn(HTMLElement.prototype, 'contains')
        .mockImplementation(() => true);

      const handler = jest.fn();
      const originalEventHandler = jest.fn();
      const preventDefault = jest.fn();

      spreadsheet.on(event, handler);

      // 外部额外注册一个相同的事件
      window.addEventListener(type, originalEventHandler);

      window.dispatchEvent(
        new MouseEvent('click', { preventDefault } as EventInit),
      );
      window.dispatchEvent(new Event(type, { preventDefault } as EventInit));

      // 都应该触发
      expect(handler).toHaveBeenCalled();
      expect(originalEventHandler).toHaveBeenCalled();

      // 不应该阻止默认事件
      expect(preventDefault).not.toHaveBeenCalled();

      spreadsheet.off(event, handler);
      window.removeEventListener(type, originalEventHandler);
    },
  );

  test.each([
    { type: OriginEventType.KEY_DOWN, event: S2Event.GLOBAL_KEYBOARD_DOWN },
    { type: OriginEventType.KEY_UP, event: S2Event.GLOBAL_KEYBOARD_UP },
    { type: OriginEventType.MOUSE_UP, event: S2Event.GLOBAL_MOUSE_UP },
    { type: OriginEventType.MOUSE_MOVE, event: S2Event.GLOBAL_MOUSE_MOVE },
  ])(
    'should first trigger capture event listener event %o',
    ({ type, event }) => {
      eventController.clear();
      spreadsheet.options = {
        ...s2Options,
        interaction: {
          // 捕获阶段
          eventListenerOptions: {
            capture: true,
          },
        },
      };
      eventController = new EventController(spreadsheet);

      jest
        .spyOn(HTMLElement.prototype, 'contains')
        .mockImplementation(() => true);

      const captureEventHandler = jest.fn();
      const bubbleEventHandler = jest.fn();
      const preventDefault = jest.fn();

      // 通过 event controller 注册 [捕获阶段] 的事件
      spreadsheet.on(event, captureEventHandler);

      // 额外注册一个相同的 [冒泡阶段] 的事件
      window.addEventListener(type, bubbleEventHandler);

      window.dispatchEvent(
        new MouseEvent('click', { preventDefault } as EventInit),
      );
      window.dispatchEvent(new Event(type, { preventDefault } as EventInit));

      // 捕获 比冒泡先触发, 且应该都触发
      expect(captureEventHandler).toHaveBeenCalledBefore(bubbleEventHandler);
      expect(bubbleEventHandler).toHaveBeenCalledAfter(captureEventHandler);

      spreadsheet.off(event, captureEventHandler);
      window.removeEventListener(type, bubbleEventHandler);
    },
  );

  test.each([
    { cellType: CellTypes.ROW_CELL, event: S2Event.ROW_CELL_CLICK },
    { cellType: CellTypes.COL_CELL, event: S2Event.COL_CELL_CLICK },
    { cellType: CellTypes.CORNER_CELL, event: S2Event.CORNER_CELL_CLICK },
  ])(
    'should not trigger click event if event target is gui icon image shape for event %o',
    ({ cellType, event }) => {
      spreadsheet.getCell = () =>
        ({
          cellType,
          getMeta: () => {},
        } as any);

      const handler = jest.fn();
      const { iconImageShape } = new GuiIcon({
        name: 'test',
        width: 10,
        height: 10,
      });

      spreadsheet.once(event, handler);

      Object.defineProperty(eventController, 'target', {
        value: iconImageShape,
        writable: true,
      });

      // 内部的 GuiIcon
      spreadsheet.container.emit(OriginEventType.MOUSE_UP, {
        ...mockEvent,
        target: iconImageShape,
      });

      expect(handler).not.toHaveBeenCalled();

      // 普通 Target
      spreadsheet.container.emit(OriginEventType.MOUSE_UP, mockEvent);

      expect(handler).toHaveBeenCalledTimes(1);
    },
  );

  // https://github.com/antvis/S2/issues/1360
  test.each([
    { cellType: CellTypes.ROW_CELL, event: S2Event.ROW_CELL_CLICK },
    { cellType: CellTypes.COL_CELL, event: S2Event.COL_CELL_CLICK },
    { cellType: CellTypes.CORNER_CELL, event: S2Event.CORNER_CELL_CLICK },
  ])(
    'should trigger click event if event target is custom image shape for event %o',
    ({ cellType, event }) => {
      spreadsheet.getCell = () =>
        ({
          cellType,
          getMeta: () => {},
        } as any);

      const handler = jest.fn();

      const image = new Shape.Image({
        name: 'test',
        attrs: {
          img: 'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png',
        },
      });

      Object.defineProperty(eventController, 'target', {
        value: image,
        writable: true,
      });

      spreadsheet.on(event, handler);
      spreadsheet.container.emit(OriginEventType.MOUSE_UP, {
        ...mockEvent,
        target: image,
      });

      expect(handler).toHaveBeenCalledTimes(1);
    },
  );

  // https://github.com/antvis/S2/issues/2170
  test('should not reset if tooltip content clicked', () => {
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);
    spreadsheet.options.tooltip = {
      showTooltip: false,
      data: {
        showTooltip: true,
      },
      col: {
        showTooltip: true,
      },
      row: {
        showTooltip: true,
      },
    };
    spreadsheet.tooltip.visible = true;
    spreadsheet.tooltip.container.getBoundingClientRect = () =>
      ({
        x: 200,
        y: 200,
        width: 200,
        height: 200,
      } as DOMRect);

    Array.from({ length: 3 }).forEach(() => {
      window.dispatchEvent(
        new PointerEvent('click', {
          clientX: 300,
          clientY: 300,
        }),
      );
    });
  });

  // https://github.com/antvis/S2/pull/2163
  test('should not reset if Mouse Event is Proxy', () => {
    const reset = jest.fn();
    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    window.dispatchEvent(
      new PointerEvent('click', {
        clientX: 100,
        clientY: 100,
      }),
    );
    expect(eventController.isCanvasEffect).toBe(true);
    expect(reset).not.toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });
});
