/* eslint-disable jest/expect-expect */
import {
  Canvas,
  FederatedEvent,
  Image,
  CustomEvent,
  type CanvasConfig,
} from '@antv/g';
import {
  createFakeSpreadSheet,
  createFederatedMouseEvent,
  createFederatedPointerEvent,
  getClientPointOnCanvas,
  sleep,
} from 'tests/util/helpers';
import { Renderer } from '@antv/g-canvas';
import { GEventType, GuiIcon } from '@/common';
import type { EmitterType } from '@/common/interface/emitter';
import {
  CellType,
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
import type { BBox } from '@/engine';

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
    enable: true,
  },
  interaction: {
    copy: { enable: true },
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

  /** 用于识别 mock 的事件 */
  const MOCK_CLIENT = {
    x: 123,
    y: 456,
  };

  const expectEvents =
    (
      eventType: OriginEventType | GEventType,
      customEvent?: (evt: FederatedEvent) => void,
    ) =>
    (options: { eventNames: (keyof EmitterType)[]; type: CellType }) => {
      const { eventNames, type } = options;

      spreadsheet.getCellType = () => type;
      spreadsheet.getCell = () =>
        ({
          cellType: type,
          getMeta: () => {},
        }) as any;

      const dispatchEvent = () => {
        const evt = createFederatedMouseEvent(spreadsheet, eventType);

        evt.client.x = MOCK_CLIENT.x;
        evt.client.y = MOCK_CLIENT.y;

        customEvent?.(evt);

        spreadsheet.container.dispatchEvent(evt);
      };

      eventNames.forEach((eventName) => {
        const eventHandler = jest.fn((evt) => evt.client);

        spreadsheet.once(eventName, eventHandler);

        dispatchEvent();

        expect(eventHandler).toHaveReturnedWith(MOCK_CLIENT);
      });
    };

  beforeEach(() => {
    const container = document.body.appendChild(document.createElement('div'));

    spreadsheet = createFakeSpreadSheet();
    spreadsheet.container = new Canvas({
      ...s2Options,
      container,
      renderer: new Renderer() as unknown as CanvasConfig['renderer'],
    });
    spreadsheet.facet = {
      ...spreadsheet.facet,
      panelBBox: {
        maxX: s2Options.width,
        maxY: s2Options.height,
      } as BBox,
    } as unknown as BaseFacet;
    spreadsheet.interaction = new RootInteraction(
      spreadsheet as unknown as SpreadSheet,
    );
    spreadsheet.interaction.reset = jest.fn();
    spreadsheet.interaction.removeIntercepts = jest.fn();
    spreadsheet.interaction.hasIntercepts = jest.fn();
    spreadsheet.interaction.intercepts.clear();
    spreadsheet.getCell = () => ({}) as any;
    spreadsheet.options = s2Options;
    spreadsheet.tooltip.container!.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }) as DOMRect;

    // acquire instance
    eventController = spreadsheet.interaction.eventController;
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
      OriginEventType.POINTER_MOVE,
      OriginEventType.POINTER_UP,
      OriginEventType.MOUSE_OUT,
      GEventType.RIGHT_MOUSE_UP,
      OriginEventType.CLICK,
      OriginEventType.TOUCH_START,
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
      OriginEventType.POINTER_UP,
      OriginEventType.POINTER_MOVE,
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
      type: CellType.DATA_CELL,
      eventNames: [S2Event.DATA_CELL_MOUSE_DOWN],
    },
    {
      type: CellType.ROW_CELL,
      eventNames: [S2Event.ROW_CELL_MOUSE_DOWN],
    },
    {
      type: CellType.COL_CELL,
      eventNames: [S2Event.COL_CELL_MOUSE_DOWN],
    },
    {
      type: CellType.CORNER_CELL,
      eventNames: [S2Event.CORNER_CELL_MOUSE_DOWN],
    },
    {
      type: CellType.MERGED_CELL,
      eventNames: [S2Event.MERGED_CELLS_MOUSE_DOWN],
    },
  ])(
    'should emit mouse down event for %o',
    expectEvents(OriginEventType.MOUSE_DOWN),
  );

  test.each([
    {
      type: CellType.DATA_CELL,
      eventNames: [
        S2Event.DATA_CELL_MOUSE_MOVE,
        S2Event.DATA_CELL_HOVER,
        S2Event.GLOBAL_HOVER,
      ],
    },
    {
      type: CellType.ROW_CELL,
      eventNames: [
        S2Event.ROW_CELL_MOUSE_MOVE,
        S2Event.ROW_CELL_HOVER,
        S2Event.GLOBAL_HOVER,
      ],
    },
    {
      type: CellType.COL_CELL,
      eventNames: [
        S2Event.COL_CELL_MOUSE_MOVE,
        S2Event.COL_CELL_HOVER,
        S2Event.GLOBAL_HOVER,
      ],
    },
    {
      type: CellType.CORNER_CELL,
      eventNames: [
        S2Event.CORNER_CELL_MOUSE_MOVE,
        S2Event.CORNER_CELL_HOVER,
        S2Event.GLOBAL_HOVER,
      ],
    },
    {
      type: CellType.MERGED_CELL,
      eventNames: [
        S2Event.MERGED_CELLS_MOUSE_MOVE,
        S2Event.MERGED_CELLS_HOVER,
        S2Event.GLOBAL_HOVER,
      ],
    },
  ])(
    'should emit pointer move and hover event for %s',
    expectEvents(OriginEventType.POINTER_MOVE),
  );

  test.each([
    {
      type: CellType.DATA_CELL,
      eventNames: [S2Event.DATA_CELL_MOUSE_UP],
    },
    {
      type: CellType.ROW_CELL,
      eventNames: [S2Event.ROW_CELL_MOUSE_UP],
    },
    {
      type: CellType.COL_CELL,
      eventNames: [S2Event.COL_CELL_MOUSE_UP],
    },
    {
      type: CellType.CORNER_CELL,
      eventNames: [S2Event.CORNER_CELL_MOUSE_UP],
    },
    {
      type: CellType.MERGED_CELL,
      eventNames: [S2Event.MERGED_CELLS_MOUSE_UP],
    },
  ])(
    'should emit pointer up and click event for %s',
    expectEvents(OriginEventType.POINTER_UP),
  );

  test.each([
    {
      type: CellType.DATA_CELL,
      eventNames: [S2Event.DATA_CELL_DOUBLE_CLICK],
    },
    {
      type: CellType.ROW_CELL,
      eventNames: [S2Event.ROW_CELL_DOUBLE_CLICK],
    },
    {
      type: CellType.COL_CELL,
      eventNames: [S2Event.COL_CELL_DOUBLE_CLICK],
    },
    {
      type: CellType.CORNER_CELL,
      eventNames: [S2Event.CORNER_CELL_DOUBLE_CLICK],
    },
    {
      type: CellType.MERGED_CELL,
      eventNames: [S2Event.MERGED_CELLS_DOUBLE_CLICK],
    },
  ])('should emit double click event for %s', (params) => {
    Object.defineProperty(eventController, 'target', {
      value: spreadsheet.container,
      writable: true,
    });

    expectEvents(OriginEventType.CLICK, (evt: FederatedEvent) => {
      evt.detail = 2;
    })(params);
  });

  test.each([
    {
      type: CellType.DATA_CELL,
      eventNames: [S2Event.DATA_CELL_CONTEXT_MENU, S2Event.GLOBAL_CONTEXT_MENU],
    },
    {
      type: CellType.ROW_CELL,
      eventNames: [S2Event.ROW_CELL_CONTEXT_MENU, S2Event.GLOBAL_CONTEXT_MENU],
    },
    {
      type: CellType.COL_CELL,
      eventNames: [S2Event.COL_CELL_CONTEXT_MENU, S2Event.GLOBAL_CONTEXT_MENU],
    },
    {
      type: CellType.CORNER_CELL,
      eventNames: [
        S2Event.CORNER_CELL_CONTEXT_MENU,
        S2Event.GLOBAL_CONTEXT_MENU,
      ],
    },
    {
      type: CellType.MERGED_CELL,
      eventNames: [
        S2Event.MERGED_CELLS_CONTEXT_MENU,
        S2Event.GLOBAL_CONTEXT_MENU,
      ],
    },
  ])(
    'should emit context menu event for %s',
    expectEvents(GEventType.RIGHT_MOUSE_UP),
  );

  test('should emit global context menu event', () => {
    const contextMenu = jest.fn((evt) => evt.client);

    spreadsheet.on(S2Event.GLOBAL_CONTEXT_MENU, contextMenu);

    const evt = createFederatedPointerEvent(
      spreadsheet,
      GEventType.RIGHT_MOUSE_UP,
    );

    evt.client.x = MOCK_CLIENT.x;
    evt.client.y = MOCK_CLIENT.y;

    spreadsheet.container.dispatchEvent(evt);
    expect(contextMenu).toHaveReturnedWith(MOCK_CLIENT);
  });

  test('should emit global mouse up event', () => {
    const mouseUp = jest.fn();

    spreadsheet.on(S2Event.GLOBAL_MOUSE_UP, mouseUp);

    window.document.body.dispatchEvent(
      new Event(OriginEventType.POINTER_UP, {
        bubbles: true,
      }),
    );

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
    spreadsheet.interaction.addIntercepts([
      InterceptType.DATA_CELL_BRUSH_SELECTION,
    ]);
    spreadsheet.interaction.hasIntercepts = jest.fn(() => true);
    const reset = jest.fn();

    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    window.dispatchEvent(new Event('click', {}));

    expect(spreadsheet.interaction.removeIntercepts).toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
    spreadsheet.interaction.hasIntercepts = jest.fn();
  });

  test('should not reset if current mouse on the canvas container', () => {
    const reset = jest.fn();

    spreadsheet.on(S2Event.GLOBAL_RESET, reset);

    const pointInCanvas = spreadsheet.container.viewport2Client({
      x: 10,
      y: 10,
    });

    spreadsheet.getCanvasElement().dispatchEvent(
      new MouseEvent('click', {
        clientX: pointInCanvas.x,
        clientY: pointInCanvas.y,
        bubbles: true,
      } as MouseEventInit),
    );

    expect(reset).not.toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  test('should reset if current mouse not on the canvas container', () => {
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

    expect(reset).toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).toHaveBeenCalled();
    expect(spreadsheet.hideTooltip).toHaveBeenCalled();
  });

  test('should reset if current mouse inside the canvas container, but outside the panel facet', () => {
    spreadsheet.facet = {
      ...spreadsheet.facet,
      panelBBox: {
        maxX: 100,
        maxY: 100,
      } as BBox,
    } as BaseFacet;

    const selected = jest.fn();
    const reset = jest.fn();

    spreadsheet.on(S2Event.GLOBAL_RESET, reset);
    spreadsheet.on(S2Event.GLOBAL_SELECTED, selected);

    const pointInCanvas = spreadsheet.container.viewport2Client({
      x: 120,
      y: 120,
    });

    spreadsheet.getCanvasElement().dispatchEvent(
      new MouseEvent('click', {
        clientX: pointInCanvas.x,
        clientY: pointInCanvas.y,
        bubbles: true,
      } as MouseEventInit),
    );

    expect(selected).toHaveBeenCalledWith([]);
    expect(reset).toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).toHaveBeenCalled();
  });

  test('should reset if press ecs', () => {
    spreadsheet.facet = {
      ...spreadsheet.facet,
      panelBBox: {
        maxX: 100,
        maxY: 100,
      } as BBox,
    } as BaseFacet;

    const selected = jest.fn();
    const reset = jest.fn();

    spreadsheet.on(S2Event.GLOBAL_RESET, reset);
    spreadsheet.on(S2Event.GLOBAL_SELECTED, selected);

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: InteractionKeyboardKey.ESC }),
    );

    expect(selected).toHaveBeenCalledWith([]);
    expect(reset).toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).toHaveBeenCalled();
  });

  test('should not reset if current mouse on the tooltip and outside the canvas container', () => {
    const reset = jest.fn();

    spreadsheet.on(S2Event.GLOBAL_RESET, reset);
    spreadsheet.tooltip.visible = true;
    spreadsheet.tooltip.container!.getBoundingClientRect = () =>
      ({
        x: 200,
        y: 200,
        width: 200,
        height: 200,
      }) as DOMRect;

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
      }) as DOMRect;

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

  test('should disable reset if autoResetSheetStyle set to false', () => {
    spreadsheet.facet = {
      ...spreadsheet.facet,
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

    spreadsheet.container.dispatchEvent(
      new CustomEvent(
        OriginEventType.MOUSE_OUT,
        getClientPointOnCanvas(spreadsheet.container, -10, -10),
      ),
    );

    expect(spreadsheet.interaction.reset).toHaveBeenCalled();
    expect(spreadsheet.hideTooltip).toHaveBeenCalled();
    expect(spreadsheet.interaction.getActiveCells()).toHaveLength(0);
  });

  test('should not hide tooltip if mouse move inside the canvas', () => {
    spreadsheet.interaction.changeState({
      cells: [{} as CellMeta],
      stateName: InteractionStateName.SELECTED,
    });

    spreadsheet.container.dispatchEvent(
      new CustomEvent(
        OriginEventType.MOUSE_OUT,
        getClientPointOnCanvas(spreadsheet.container, 10, 10),
      ),
    );

    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  test('should not hide tooltip if mouse outside the canvas and has selected cells', () => {
    spreadsheet.interaction.changeState({
      cells: [{} as CellMeta],
      stateName: InteractionStateName.SELECTED,
    });

    spreadsheet.container.dispatchEvent(
      new CustomEvent(
        OriginEventType.MOUSE_OUT,
        getClientPointOnCanvas(spreadsheet.container, -10, -10),
      ),
    );

    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  test('should disable reset if mouse outside the canvas and autoResetSheetStyle set to false', () => {
    spreadsheet.setOptions({
      interaction: {
        autoResetSheetStyle: false,
      },
    });

    spreadsheet.container.dispatchEvent(
      new CustomEvent(
        OriginEventType.MOUSE_OUT,
        getClientPointOnCanvas(spreadsheet.container, -10, -10),
      ),
    );

    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  test('should disable reset if mouse outside the canvas and action tooltip is active', () => {
    spreadsheet.interaction.addIntercepts([InterceptType.HOVER]);

    spreadsheet.container.dispatchEvent(
      new CustomEvent(
        OriginEventType.MOUSE_OUT,
        getClientPointOnCanvas(spreadsheet.container, -10, -10),
      ),
    );

    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  // https://github.com/antvis/S2/issues/1172
  test.each([
    { type: OriginEventType.KEY_DOWN, event: S2Event.GLOBAL_KEYBOARD_DOWN },
    { type: OriginEventType.KEY_UP, event: S2Event.GLOBAL_KEYBOARD_UP },
    { type: OriginEventType.POINTER_UP, event: S2Event.GLOBAL_MOUSE_UP },
    { type: OriginEventType.POINTER_MOVE, event: S2Event.GLOBAL_MOUSE_MOVE },
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
    { type: OriginEventType.POINTER_UP, event: S2Event.GLOBAL_MOUSE_UP },
    { type: OriginEventType.POINTER_MOVE, event: S2Event.GLOBAL_MOUSE_MOVE },
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
    { cellType: CellType.ROW_CELL, event: S2Event.ROW_CELL_CLICK },
    { cellType: CellType.COL_CELL, event: S2Event.COL_CELL_CLICK },
    { cellType: CellType.CORNER_CELL, event: S2Event.CORNER_CELL_CLICK },
    { cellType: CellType.DATA_CELL, event: S2Event.DATA_CELL_CLICK },
    { cellType: CellType.MERGED_CELL, event: S2Event.MERGED_CELLS_CLICK },
  ])(
    'should not trigger click event if event target is gui icon image shape for event %o',
    async ({ cellType, event }) => {
      spreadsheet.getCell = () =>
        ({
          cellType,
          getMeta: () => {},
          getConditionIconShapes: () => [],
        }) as any;

      const handler = jest.fn();
      const guiIcon = new GuiIcon({
        name: 'SortUp',
        width: 10,
        height: 10,
      });

      await sleep(200); // 图片加载

      spreadsheet.container.appendChild(guiIcon); // 加入 g 渲染树才有事件传递
      spreadsheet.once(event, handler);

      // 内部的 GuiIcon
      const { iconImageShape } = guiIcon;

      Object.defineProperty(eventController, 'target', {
        value: iconImageShape,
        writable: true,
      });
      iconImageShape.dispatchEvent(
        createFederatedPointerEvent(spreadsheet, OriginEventType.POINTER_UP),
      );

      expect(handler).not.toHaveBeenCalled();

      // 普通 Target
      Object.defineProperty(eventController, 'target', {
        value: spreadsheet.container,
        writable: true,
      });
      spreadsheet.container.dispatchEvent(
        createFederatedPointerEvent(spreadsheet, OriginEventType.POINTER_UP),
      );

      expect(handler).toHaveBeenCalledTimes(1);
    },
  );

  // https://github.com/antvis/S2/issues/1360
  test.each([
    { cellType: CellType.ROW_CELL, event: S2Event.ROW_CELL_CLICK },
    { cellType: CellType.COL_CELL, event: S2Event.COL_CELL_CLICK },
    { cellType: CellType.CORNER_CELL, event: S2Event.CORNER_CELL_CLICK },
    { cellType: CellType.DATA_CELL, event: S2Event.DATA_CELL_CLICK },
    { cellType: CellType.MERGED_CELL, event: S2Event.MERGED_CELLS_CLICK },
  ])(
    'should trigger click event if event target is custom image shape for event %o',
    ({ cellType, event }) => {
      spreadsheet.getCell = () =>
        ({
          cellType,
          getMeta: () => {},
          getConditionIconShapes: () => [],
        }) as any;

      const handler = jest.fn();

      const image = new Image({
        name: 'test',
        style: {
          img: 'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png',
        },
      });

      spreadsheet.container.appendChild(image); // 加入 g 渲染树才有事件传递

      Object.defineProperty(eventController, 'target', {
        value: image,
        writable: true,
      });

      spreadsheet.on(event, handler);

      image.dispatchEvent(
        createFederatedMouseEvent(spreadsheet, OriginEventType.POINTER_UP),
      );

      expect(handler).toHaveBeenCalledTimes(1);
    },
  );

  test.each([
    { cellType: CellType.ROW_CELL, event: S2Event.ROW_CELL_CLICK },
    { cellType: CellType.COL_CELL, event: S2Event.COL_CELL_CLICK },
    { cellType: CellType.CORNER_CELL, event: S2Event.CORNER_CELL_CLICK },
    { cellType: CellType.DATA_CELL, event: S2Event.DATA_CELL_CLICK },
    { cellType: CellType.MERGED_CELL, event: S2Event.MERGED_CELLS_CLICK },
  ])(
    'should trigger click event if event target is condition icon image shape for event %o',
    async ({ cellType, event }) => {
      const guiIcon = new GuiIcon({
        name: 'SortUp',
        width: 10,
        height: 10,
      });

      spreadsheet.getCell = () =>
        ({
          cellType,
          getMeta: () => {},
          // 模拟当前的 target 是字段标记的 icon
          getConditionIconShapes: () => [guiIcon],
        }) as any;

      const handler = jest.fn();

      await sleep(200); // 图片加载

      spreadsheet.container.appendChild(guiIcon); // 加入 g 渲染树才有事件传递
      spreadsheet.once(event, handler);

      // 内部的 GuiIcon
      const { iconImageShape } = guiIcon;

      Object.defineProperty(eventController, 'target', {
        value: iconImageShape,
        writable: true,
      });
      iconImageShape.dispatchEvent(
        createFederatedPointerEvent(spreadsheet, OriginEventType.POINTER_UP),
      );

      expect(handler).toHaveBeenCalledTimes(1);
    },
  );

  // https://github.com/antvis/S2/issues/2170
  test('should not reset if tooltip content clicked', () => {
    const reset = jest.fn();

    spreadsheet.on(S2Event.GLOBAL_RESET, reset);
    spreadsheet.options.tooltip = {
      enable: false,
      dataCell: {
        enable: true,
      },
      colCell: {
        enable: true,
      },
      rowCell: {
        enable: true,
      },
    };
    spreadsheet.tooltip.visible = true;
    spreadsheet.tooltip.container!.getBoundingClientRect = () =>
      ({
        x: 200,
        y: 200,
        width: 200,
        height: 200,
      }) as DOMRect;

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

    const pointInCanvas = getClientPointOnCanvas(spreadsheet.container, 10, 10);
    const event = new window.CustomEvent('click');

    Object.defineProperties(event, {
      clientX: {
        value: pointInCanvas.clientX,
      },
      clientY: {
        value: pointInCanvas.clientY,
      },
    });
    spreadsheet.getCanvasElement().dispatchEvent(event);

    expect(eventController.isCanvasEffect).toBe(true);
    expect(reset).not.toHaveBeenCalled();
    expect(spreadsheet.interaction.reset).not.toHaveBeenCalled();
  });

  // https://github.com/antvis/S2/issues/2553
  test('should use offset point if enable supportsCSSTransform', () => {
    jest.spyOn(spreadsheet, 'getCanvasConfig').mockImplementationOnce(() => {
      return {
        supportsCSSTransform: true,
      };
    });

    const event = new MouseEvent('click');

    Object.defineProperties(event, {
      offsetX: {
        value: 100,
      },
      offsetY: {
        value: 200,
      },
      clientX: {
        value: 300,
      },
      clientY: {
        value: 400,
      },
    });

    expect(eventController.getViewportPoint(event)).toStrictEqual({
      x: 100,
      y: 200,
    });
  });
});
