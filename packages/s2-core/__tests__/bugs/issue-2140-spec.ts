/**
 * 透视表不冻结行头且行头过宽时滚动条渲染错误
 * @description spec for issue #2140
 * https://github.com/antvis/S2/issues/2140
 */

import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/simple-data.json';
import type { S2Options } from '@/index';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  frozen: { rowHeader: false },
  style: {
    rowCell: {
      widthByField: {
        province: 300,
        city: 300,
      },
    },
  },
};

describe('Horizontal Scroll Bar Tests', () => {
  test('should render correctly when row header wider than canvas', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    await s2.render();

    const { hScrollBar } = s2.facet;

    expect(hScrollBar.trackLen).toEqual(s2.facet.getCanvasSize().width);
  });
});
