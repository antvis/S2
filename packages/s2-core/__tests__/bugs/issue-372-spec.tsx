/**
 * @description spec for issue #372
 * https://github.com/antvis/S2/issues/372
 * Wrong position of grandTotal cells in multi-value mode
 *
 */
import { find } from 'lodash';
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-372.json';
import { PivotSheet } from '@/sheet-type';
import { Node } from '@/facet/layout/node';

const s2options = {
  width: 800,
  height: 600,
  totals: {
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: ['col0', 'col1'],
    },
  },
};

describe('GrandTotal Cells Rendering Test', () => {
  const s2 = new PivotSheet(getContainer(), mockDataConfig, s2options);
  s2.render();
  test('should get right height of GrandTotal node', () => {
    const hierarchy = s2.facet.layoutResult.colsHierarchy;
    const grandTotalNode = find(
      hierarchy.getNodes(0),
      (node: Node) => node.isGrandTotals,
    ) as Node;
    expect(grandTotalNode.height).toEqual(40);
  });
});
