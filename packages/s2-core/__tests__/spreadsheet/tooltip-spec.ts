import { createPivotSheet } from 'tests/util/helpers';
import type { S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 300,
  height: 200,
};

const CONTAINER_CLASS_NAME = 'antv-s2-tooltip-container';

describe('Tooltip Tests', () => {
  const createS2 = (tooltipOptions: S2Options['tooltip']) =>
    createPivotSheet({
      ...s2Options,
      tooltip: tooltipOptions,
    });

  test('should not render tooltip in default container if disable tooltip', async () => {
    const s2 = createS2({ enable: false });

    await s2.render();

    expect(
      document.querySelector(`body > .${CONTAINER_CLASS_NAME}`),
    ).toBeFalsy();

    s2.destroy();
  });

  test('should not render tooltip in default container when hide tooltip if disable tooltip', async () => {
    const s2 = createS2({ enable: false });

    await s2.render();

    s2.hideTooltip();

    expect(
      document.querySelector(`body > .${CONTAINER_CLASS_NAME}`),
    ).toBeFalsy();

    s2.destroy();
  });

  test('should render tooltip in default container', async () => {
    const s2 = createS2({ enable: true });

    await s2.render();

    s2.showTooltip({ position: { x: 0, y: 0 } });

    expect(
      document.querySelector(`body > div[class^="${CONTAINER_CLASS_NAME}"]`),
    ).toBeTruthy();

    s2.destroy();
  });

  test('should render tooltip in custom position', async () => {
    const container = document.createElement('div');

    container.id = 'custom-container';
    document.body.appendChild(container);

    const s2 = createS2({
      enable: true,
      adjustPosition: (positionInfo) => {
        const { position } = positionInfo;

        return { x: position.x + 100, y: position.y + 100 };
      },
    });

    await s2.render();

    s2.showTooltip({ position: { x: 0, y: 0 } });

    expect(s2.tooltip.position).toEqual({ x: 115, y: 110 });

    s2.destroy();
  });

  test('should render tooltip in custom container', async () => {
    const container = document.createElement('div');

    container.id = 'custom-container';
    document.body.appendChild(container);

    const s2 = createS2({
      enable: true,
      getContainer: () => container,
    });

    await s2.render();

    s2.showTooltip({ position: { x: 0, y: 0 } });

    expect(
      document.querySelector(`body > .${CONTAINER_CLASS_NAME}`),
    ).toBeFalsy();

    expect(
      document.querySelector(
        `#custom-container > div[class^="${CONTAINER_CLASS_NAME}"]`,
      ),
    ).toBeTruthy();

    s2.destroy();
  });
});
