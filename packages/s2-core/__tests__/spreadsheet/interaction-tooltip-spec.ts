import * as mockDataConfig from 'tests/data/simple-data.json';
import { createMockCellInfo, getContainer } from 'tests/util/helpers';
import type { GEvent } from '@/index';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type { S2Options } from '@/common/interface';
import { S2Event } from '@/common/constant';

const s2Options: S2Options = {
  width: 600,
  height: 400,
  tooltip: {
    enable: true,
  },
};

describe('Interaction Tooltip Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    jest
      .spyOn(SpreadSheet.prototype, 'getCell')
      .mockImplementation(() => createMockCellInfo('testId').mockCell);

    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  test('should display tooltip when data cell clicked', () => {
    const isContains = () =>
      s2.tooltip.container?.classList?.contains(
        'antv-s2-tooltip-container-show',
      );

    expect(isContains()).toBeFalsy();

    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);

    expect(isContains()).toBeTruthy();
    expect(s2.tooltip.container!.style.display).not.toEqual('none');
    expect(s2.tooltip.container!.style.visibility).not.toEqual('hidden');
  });
});
