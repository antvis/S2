import * as mockDataConfig from 'tests/data/simple-data.json';
import { createMockCellInfo, getContainer } from 'tests/util/helpers';
import { Event as CanvasEvent } from '@antv/g-canvas';
import { S2Event } from '@/common/constant/events/basic';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 300,
  height: 200,
};

const CONTAINER_CLASS_NAME = 'antv-s2-tooltip-container';

describe('Tooltip Tests', () => {
  beforeEach(() => {
    jest
      .spyOn(SpreadSheet.prototype, 'getCell')
      .mockImplementation(() => createMockCellInfo('testId').mockCell as any);
  });

  test('should render custom tooltip mount container12', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, {
      ...s2Options,
      tooltip: {
        showTooltip: false,
      },
    });
    s2.render();

    expect(
      document.querySelector(`body > .${CONTAINER_CLASS_NAME}`),
    ).toBeFalsy();

    s2.destroy();
  });

  test('should render default tooltip container', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, {
      ...s2Options,
      tooltip: {
        showTooltip: true,
      },
    });
    s2.render();

    s2.emit(S2Event.ROW_CELL_HOVER, {} as CanvasEvent);

    expect(
      document.querySelector(`body > div[class^="${CONTAINER_CLASS_NAME}"]`),
    ).toBeTruthy();

    s2.destroy();
  });

  test('should render custom tooltip mount container', async () => {
    const container = document.createElement('div');
    container.id = 'custom-container';
    document.body.appendChild(container);

    const s2 = new PivotSheet(getContainer(), mockDataConfig, {
      ...s2Options,
      tooltip: {
        showTooltip: true,
        getContainer: () => container,
      },
    });
    s2.render();

    s2.emit(S2Event.ROW_CELL_HOVER, {} as CanvasEvent);

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
