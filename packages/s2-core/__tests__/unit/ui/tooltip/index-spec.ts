import { createFakeSpreadSheet } from 'tests/util/helpers';
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
      element: 'text',
    });

    expect(tooltip.container.innerHTML).toEqual('text');
  });

  test('should display custom dom element', () => {
    const element1 = document.createElement('span');
    const element2 = document.createElement('span');

    element1.className = 'text1';
    element2.className = 'text2';

    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
      element: element1,
    });

    expect(tooltip.container.querySelector('.text1')).toBeTruthy();

    tooltip.show({
      position: {
        x: 10,
        y: 10,
      },
      element: element2,
    });

    expect(tooltip.container.querySelector('.text2')).toBeTruthy();
    expect(tooltip.container.children.length).toBe(1);
  });

  test('should display custom string tooltipComponent', () => {
    Object.defineProperty(s2.options, 'tooltip', {
      value: {
        ...s2.options.tooltip,
        tooltipComponent: 'text',
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

  test('should display custom dom tooltipComponent', () => {
    const element = document.createElement('span');
    element.className = 'text';

    Object.defineProperty(s2.options, 'tooltip', {
      value: {
        ...s2.options.tooltip,
        tooltipComponent: element,
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
  });

  test('should get getTooltipComponent', () => {
    const getTooltipComponent = jest.fn();

    Object.defineProperty(s2.options, 'tooltip', {
      value: {
        ...s2.options.tooltip,
        getTooltipComponent,
      },
      configurable: true,
    });

    const showOptions = {
      position: {
        x: 10,
        y: 10,
      },
    };

    tooltip.show(showOptions);

    expect(getTooltipComponent).toHaveBeenCalledWith(
      showOptions,
      tooltip.container,
    );
  });
});
