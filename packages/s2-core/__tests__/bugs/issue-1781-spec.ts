/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description spec for issue #1781
 * https://github.com/antvis/S2/issues/1781
 */

import { getContainer, sleep } from '../util/helpers';
import * as mockDataConfig from '../data/simple-table-data.json';
import {
  OriginEventType,
  S2Event,
  type S2DataConfig,
  type S2Options,
} from '@/index';
import { TableSheet } from '@/sheet-type';

const s2DataConfig: S2DataConfig = {
  ...mockDataConfig,
  meta: [
    {
      field: 'province',
      name: '一样的名字',
    },
    {
      field: 'city',
      name: '一样的名字',
    },
  ],
};

const s2Options: S2Options = {
  width: 800,
  height: 400,
};

describe('Hover Focus Tests', () => {
  const s2 = new TableSheet(getContainer(), s2DataConfig, s2Options);

  s2.render();

  test(`should focus on province cell but don't focus on city cell when hover on province cell`, async () => {
    await sleep(3000);

    // 浙江省份信息
    const provinceCell = s2.panelScrollGroup.getChildByIndex(7);

    // 义乌城市信息
    const cityCell = s2.panelScrollGroup.getChildByIndex(10);

    const event = new MouseEvent(OriginEventType.MOUSE_MOVE);

    // @ts-ignore
    s2.emit(S2Event.DATA_CELL_HOVER, { ...event, target: provinceCell });

    expect(
      // @ts-ignore
      provinceCell.stateShapes.get('interactiveBorderShape')?.cfg.visible,
    ).toBeTrue();
    expect(
      // @ts-ignore
      cityCell.stateShapes.get('interactiveBorderShape')?.cfg.visible,
    ).toBeFalse();
  });
});
