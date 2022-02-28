/**
 * @description spec for issue #368
 * https://github.com/antvis/S2/issues/368
 * Wrong style when show the totals in multi-value mode
 *
 */
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-368.json';
import { PivotSheet } from '@/sheet-type';
import { Node } from '@/facet/layout/node';

const s2Options = {
  width: 800,
  height: 600,
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: ['row0', 'row1'],
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: ['col0', 'col1'],
    },
  },
};

describe('Total Cells Rendering Test', () => {
  const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
  s2.render();
  test('should get right SubTotals position', () => {
    const layoutResult = s2.facet.layoutResult;
    const rowSubTotalNodes = layoutResult.rowsHierarchy
      .getNodes()
      .filter((node: Node) => node.isSubTotals);
    const colSubTotalNodes = layoutResult.colsHierarchy
      .getNodes()
      .filter((node: Node) => node.isSubTotals);

    expect(rowSubTotalNodes[0].width).toEqual(192);
    expect(rowSubTotalNodes[0].height).toEqual(30);
    expect(rowSubTotalNodes[0].x).toEqual(96);
    expect(rowSubTotalNodes[0].y).toEqual(30);

    expect(colSubTotalNodes[0].width).toEqual(192);
    expect(colSubTotalNodes[0].height).toEqual(60);
    expect(colSubTotalNodes[0].x).toEqual(192);
    expect(colSubTotalNodes[0].y).toEqual(30);
  });
});
