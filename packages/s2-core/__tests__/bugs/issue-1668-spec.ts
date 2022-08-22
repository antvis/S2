/**
 * @description spec for issue #1668
 * https://github.com/antvis/S2/issues/1668
 */

import type { IGroup } from '@antv/g-adapter';
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-1668.json';
import { type S2Options, KEY_GROUP_COL_RESIZE_AREA } from '@/index';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 400,
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: ['province'],
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: ['type'],
    },
  },
};

describe('Totals Cell Resize Tests', () => {
  const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
  s2.render();

  test('should render extra resize id for resize area handler', () => {
    const resizeArea = s2.foregroundGroup.findById(
      KEY_GROUP_COL_RESIZE_AREA,
    ) as IGroup;
    const resizeAreaList = resizeArea.getChildren();

    expect(resizeAreaList).not.toHaveLength(0);

    resizeAreaList.forEach((shape) => {
      expect(shape.attr('appendInfo').id).toBeTruthy();
    });
  });
});
