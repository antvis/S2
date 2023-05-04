import { createFakeSpreadSheet, sleep } from 'tests/util/helpers';
import type { SpreadSheet } from '@/sheet-type/spread-sheet';
import { BaseTooltip } from '@/ui/tooltip';
import {
  TOOLTIP_CONTAINER_CLS,
  TOOLTIP_CONTAINER_HIDE_CLS,
  TOOLTIP_CONTAINER_SHOW_CLS,
  TOOLTIP_POSITION_OFFSET,
  type S2Options,
} from '@/common';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/root');

describe('Tooltip Tests', () => {
  let s2: SpreadSheet;
  let tooltip: BaseTooltip;

  beforeEach(() => {
    s2 = createFakeSpreadSheet();
    tooltip = new BaseTooltip(s2);
  });

  afterEach(() => {
    tooltip?.destroy();
  });

  test('should init tooltip', () => {
    const container = document.querySelector(`.${TOOLTIP_CONTAINER_CLS}`);

    expect(tooltip).toBeDefined();
    expect(tooltip.position).toEqual({
      x: 0,
      y: 0,
    });
    expect(tooltip.visible).toBeFalsy();
    expect(container).toBeFalsy();
    expect(tooltip.container).not.toEqual(container);
  });

  test('should create tooltip container when call tooltip show method', () => {
    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
    });

    const container = document.querySelector(`.${TOOLTIP_CONTAINER_CLS}`);

    expect(container).toBeDefined();
    expect(tooltip.container).toEqual(container);
  });

  test('should show tooltip', () => {
    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
    });

    const left = 10 + TOOLTIP_POSITION_OFFSET.x;
    const top = 10 + TOOLTIP_POSITION_OFFSET.y;
    const { style } = tooltip.container!;

    // set position
    expect(tooltip.position).toEqual({
      x: left,
      y: top,
    });
    // add class
    expect(tooltip.container!.className).toEqual(
      `${TOOLTIP_CONTAINER_CLS} ${TOOLTIP_CONTAINER_SHOW_CLS}`,
    );
    // visible status
    expect(tooltip.visible).toBeTruthy();
    // set style
    expect(style.left).toEqual(`${left}px`);
    expect(style.top).toEqual(`${top}px`);
    expect(style.pointerEvents).toEqual('all');
  });

  test('should hide tooltip', () => {
    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
    });

    tooltip.hide();

    const { style } = tooltip.container!;

    // reset position
    expect(tooltip.position).toEqual({
      x: 0,
      y: 0,
    });
    // visible status
    expect(tooltip.visible).toBeFalsy();
    // add class
    expect(tooltip.container!.className).toEqual(
      `${TOOLTIP_CONTAINER_CLS} ${TOOLTIP_CONTAINER_HIDE_CLS}`,
    );
    // add pointer events
    expect(style.pointerEvents).toEqual('none');
  });

  test('should destroy tooltip', () => {
    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
    });

    const containerId = 'testId';

    tooltip.container!.setAttribute('id', containerId);
    tooltip.destroy();

    // reset position
    expect(tooltip.position).toEqual({
      x: 0,
      y: 0,
    });
    // visible status
    expect(tooltip.visible).toBeFalsy();
    // remove container
    expect(document.getElementById(containerId)).toBeFalsy();
    expect(tooltip.container).toBe(null);
  });

  test('should disable pointer event', () => {
    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
    });

    tooltip.disablePointerEvent();

    const { style } = tooltip.container!;

    expect(style.pointerEvents).toEqual('none');
  });

  test('should display custom string element', () => {
    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
      content: 'text',
    });

    expect(tooltip.container!.innerHTML).toEqual('text');
  });

  test('should display custom dom element', async () => {
    const element1 = document.createElement('span');
    const element2 = document.createElement('span');

    const position = {
      x: 10,
      y: 10,
    };

    tooltip.show({
      position,
      content: element1,
    });

    expect(tooltip.container!.contains(element1)).toBeTruthy();

    tooltip.show({
      position,
      content: element2,
    });

    await sleep(500);

    expect(tooltip.container!.contains(element2)).toBeTruthy();
    expect(tooltip.container!.children).toHaveLength(1);
  });

  test('should display custom string content', () => {
    Object.defineProperty(s2.options, 'tooltip', {
      value: {
        ...s2.options.tooltip,
        content: 'text',
      },
      configurable: true,
    });

    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
    });

    expect(tooltip.container!.innerHTML).toEqual('text');
  });

  test('should display custom dom content', () => {
    const element = document.createElement('span');

    element.className = 'text';

    Object.defineProperty(s2.options, 'tooltip', {
      value: {
        ...s2.options.tooltip,
        content: element,
      },
      configurable: true,
    });

    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
    });

    expect(tooltip.container!.querySelector('.text')).toBeTruthy();
    expect(tooltip.container!.contains(element)).toBeTruthy();
  });

  test('should replace tooltip content by call method', () => {
    const position = {
      x: 10,
      y: 10,
    };

    tooltip.show({
      position,
      content: 'content1',
    });

    expect(tooltip.container!.innerHTML).toEqual('content1');

    tooltip.show({
      position,
      content: 'content2',
    });

    expect(tooltip.container!.innerHTML).toEqual('content2');
  });

  test('should set empty tooltip content', () => {
    const position = {
      x: 10,
      y: 10,
    };

    tooltip.show({
      position,
      content: 'content1',
    });

    expect(tooltip.container!.innerHTML).toEqual('content1');

    tooltip.show({
      position,
      content: '',
    });

    expect(tooltip.container!.innerHTML).toEqual('');
  });

  test('should display custom string content by call method and ignore option config', () => {
    Object.defineProperty(s2.options, 'tooltip', {
      value: {
        ...s2.options.tooltip,
        content: 'text',
      },
      configurable: true,
    });

    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
      content: 'content',
    });

    expect(tooltip.container!.innerHTML).toEqual('content');
  });

  test('should display custom string content by call method and ignore all option config', () => {
    const config: S2Options['tooltip'] = {
      ...s2.options.tooltip,
      content: 'text',
      rowCell: {
        content: 'row content',
      },
      colCell: {
        content: 'col content',
      },
      dataCell: {
        content: 'cell content',
      },
    };

    Object.defineProperty(s2.options, 'tooltip', {
      value: config,
      configurable: true,
    });

    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
      content: 'custom content',
    });

    expect(tooltip.container!.innerHTML).toEqual('custom content');
  });

  test('should render max container size if content size more than container size', () => {
    const contentSize = {
      width: 9999,
      height: 9999,
    };

    const MAX_HEIGHT = window.innerHeight;
    const MAX_WIDTH = 640;

    const node = document.createElement('div');

    node.innerHTML = '我很宽,很长';
    node.style.width = `${contentSize.width}px`;
    node.style.height = `${contentSize.height}px`;

    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
      content: node,
    });

    const tooltipRect = tooltip.container!.getBoundingClientRect();

    // Tooltip 最大宽度/高度
    expect(tooltipRect.width).toStrictEqual(MAX_WIDTH);
    expect(tooltipRect.height).toStrictEqual(MAX_HEIGHT);

    // Tooltip 容器应该有滚动条
    expect(tooltip.container!.scrollWidth).toStrictEqual(contentSize.width);
    expect(tooltip.container!.scrollHeight).toStrictEqual(contentSize.height);
    expect(tooltip.container!.clientWidth).toBeLessThan(
      tooltip.container!.scrollWidth,
    );
  });

  test('should set custom container style', () => {
    s2.options.tooltip!.style = {
      fontSize: '20px',
      color: 'red',
    };

    tooltip = new BaseTooltip(s2);

    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
    });

    expect(tooltip.container!.style.fontSize).toEqual('20px');
  });

  test('should set custom container class name', () => {
    s2.options.tooltip!.className = 'custom';

    tooltip = new BaseTooltip(s2);

    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
    });

    expect(tooltip.container!.classList.contains('custom')).toBeTruthy();
  });

  test('should set custom container class name list', () => {
    const classList = ['custom1', 'custom2'];

    s2.options.tooltip!.className = classList;

    tooltip = new BaseTooltip(s2);

    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
    });

    expect(tooltip.container!.classList.contains(classList[0])).toBeTruthy();
    expect(tooltip.container!.classList.contains(classList[1])).toBeTruthy();
  });
});
