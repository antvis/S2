import { createFakeSpreadSheet, sleep } from 'tests/util/helpers';
import type { SpreadSheet } from '@/sheet-type/spread-sheet';
import { BaseTooltip } from '@/ui/tooltip';
import { TOOLTIP_CONTAINER_CLS, TOOLTIP_POSITION_OFFSET } from '@/common';

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
    expect(tooltip).toBeDefined();
    expect(tooltip.position).toEqual({
      x: 0,
      y: 0,
    });
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
    const { style } = tooltip.container;

    // set position
    expect(tooltip.position).toEqual({
      x: left,
      y: top,
    });
    // add class
    expect(tooltip.container.className).toEqual(
      `${TOOLTIP_CONTAINER_CLS} ${TOOLTIP_CONTAINER_CLS}-show`,
    );
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

    const { style } = tooltip.container;

    // reset position
    expect(tooltip.position).toEqual({
      x: 0,
      y: 0,
    });
    // add class
    expect(tooltip.container.className).toEqual(
      `${TOOLTIP_CONTAINER_CLS} ${TOOLTIP_CONTAINER_CLS}-hide`,
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
    tooltip.container.setAttribute('id', containerId);
    tooltip.destroy();

    // reset position
    expect(tooltip.position).toEqual({
      x: 0,
      y: 0,
    });
    // remove container
    expect(document.getElementById(containerId)).toBeFalsy();
  });

  test('should disable pointer event', () => {
    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
    });

    tooltip.disablePointerEvent();

    const { style } = tooltip.container;

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

    expect(tooltip.container.innerHTML).toEqual('text');
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

    expect(tooltip.container.contains(element1)).toBeTruthy();

    tooltip.show({
      position,
      content: element2,
    });

    await sleep(500);

    expect(tooltip.container.contains(element2)).toBeTruthy();
    expect(tooltip.container.children).toHaveLength(1);
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

    expect(tooltip.container.innerHTML).toEqual('text');
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

    expect(tooltip.container.querySelector('.text')).toBeTruthy();
    expect(tooltip.container.contains(element)).toBeTruthy();
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

    expect(tooltip.container.innerHTML).toEqual('content1');

    tooltip.show({
      position,
      content: 'content2',
    });

    expect(tooltip.container.innerHTML).toEqual('content2');
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

    expect(tooltip.container.innerHTML).toEqual('content1');

    tooltip.show({
      position,
      content: '',
    });

    expect(tooltip.container.innerHTML).toEqual('');
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

    expect(tooltip.container.innerHTML).toEqual('content');
  });

  test('should display custom string content by call method and ignore all option config', () => {
    Object.defineProperty(s2.options, 'tooltip', {
      value: {
        ...s2.options.tooltip,
        content: 'text',
        row: {
          content: 'row content',
        },
        col: {
          content: 'col content',
        },
        cell: {
          content: 'cell content',
        },
      },
      configurable: true,
    });

    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
      content: 'custom content',
    });

    expect(tooltip.container.innerHTML).toEqual('custom content');
  });
});
