/**
 * @description spec for issue #1764 #1780
 * https://github.com/antvis/S2/issues/1764
 * https://github.com/antvis/S2/issues/1780
 */

import type { S2Options } from '@/index';
import { PivotSheet } from '@/sheet-type';
import { FederatedMouseEvent } from '@antv/g';
import * as mockDataConfig from '../data/data-issue-1668.json';
import { getContainer } from '../util/helpers';

const s2Options: S2Options = {
  width: 800,
  height: 400,
  style: {
    // 显示滚动条
    dataCell: {
      width: 200,
    },
  },
};

describe('ScrollBar Track Offset Tests', () => {
  test('should not get NaN offset when scroll track clicked', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    await s2.render();

    const { hScrollBar } = s2.facet;

    const updateThumbOffsetSpy = jest
      .spyOn(hScrollBar, 'updateThumbOffset')
      .mockImplementation(() => {});

    const mouseEvt = new FederatedMouseEvent(s2.container.getEventService());

    mouseEvt.type = 'click';
    hScrollBar.trackShape.dispatchEvent(mouseEvt);

    expect(updateThumbOffsetSpy).toHaveBeenCalledWith(0);
  });
});
