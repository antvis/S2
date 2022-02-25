import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';
import { S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 300,
  height: 200,
};

const CONTAINER_CLASS_NAME = 'antv-s2-tooltip-container';

describe('Tooltip Tests', () => {
  const createS2 = (tooltipOptions: S2Options['tooltip']) => {
    return new PivotSheet(getContainer(), mockDataConfig, {
      ...s2Options,
      tooltip: tooltipOptions,
    });
  };

  test('should not render tooltip in default container if disable tooltip', async () => {
    const s2 = createS2({ showTooltip: false });
    s2.render();

    expect(
      document.querySelector(`body > .${CONTAINER_CLASS_NAME}`),
    ).toBeFalsy();

    s2.destroy();
  });

  test('should not render tooltip in default container when hide tooltip if disable tooltip', async () => {
    const s2 = createS2({ showTooltip: false });
    s2.render();

    s2.hideTooltip();

    expect(
      document.querySelector(`body > .${CONTAINER_CLASS_NAME}`),
    ).toBeFalsy();

    s2.destroy();
  });

  test('should render tooltip in default container', async () => {
    const s2 = createS2({ showTooltip: true });
    s2.render();

    s2.showTooltip({ position: { x: 0, y: 0 } });

    expect(
      document.querySelector(`body > div[class^="${CONTAINER_CLASS_NAME}"]`),
    ).toBeTruthy();

    s2.destroy();
  });

  test('should render tooltip in custom container', async () => {
    const container = document.createElement('div');
    container.id = 'custom-container';
    document.body.appendChild(container);

    const s2 = createS2({
      showTooltip: true,
      getContainer: () => container,
    });

    s2.render();

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
