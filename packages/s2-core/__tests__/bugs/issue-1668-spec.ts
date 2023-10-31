/**
 * @description spec for issue #1668
 * https://github.com/antvis/S2/issues/1668
 */
import type { Group } from '@antv/g';
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-1668.json';
import { type S2Options, KEY_GROUP_COL_RESIZE_AREA } from '@/index';
import { PivotSheet } from '@/sheet-type';
import type { CustomRect } from '@/engine';

const s2Options: S2Options = {
  width: 800,
  height: 400,
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['province'],
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['type'],
    },
  },
};

describe('Totals Cell Resize Tests', () => {
  test('should render extra resize id for resize area handler', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    await s2.render();

    const resizeArea = s2.facet.foregroundGroup.getElementById<Group>(
      KEY_GROUP_COL_RESIZE_AREA,
    )!;
    const resizeAreaList = resizeArea.children as CustomRect[];

    expect(resizeAreaList).not.toHaveLength(0);

    resizeAreaList.forEach((shape) => {
      expect(shape.appendInfo['meta'].id).toBeTruthy();
    });
  });
});
