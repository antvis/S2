/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description spec for issue #1781
 * https://github.com/antvis/S2/issues/1781
 */

import type { FederatedPointerEvent } from '@antv/g';
import * as mockDataConfig from '../data/simple-table-data.json';
import {
  createFederatedMouseEvent,
  getContainer,
  sleep,
} from '../util/helpers';
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
  test(`should focus on province cell but don't focus on city cell when hover on province cell`, async () => {
    const s2 = new TableSheet(getContainer(), s2DataConfig, s2Options);

    await s2.render();

    await sleep(3000);

    // 浙江省份信息
    const provinceCell = s2.facet.getDataCells()[7];

    // 义乌城市信息
    const cityCell = s2.facet.getDataCells()[10];

    const event = createFederatedMouseEvent(s2, OriginEventType.POINTER_MOVE);

    event.target = provinceCell;

    s2.emit(S2Event.DATA_CELL_HOVER, event as FederatedPointerEvent);

    expect(
      provinceCell
        .getStateShapes()
        .get('interactiveBorderShape')
        ?.attr('visibility'),
    ).toEqual('visible');

    expect(
      cityCell
        .getStateShapes()
        .get('interactiveBorderShape')
        ?.attr('visibility'),
    ).toEqual('hidden');
  });
});
