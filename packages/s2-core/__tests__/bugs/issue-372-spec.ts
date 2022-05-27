/**
 * @description spec for issue #372
 * https://github.com/antvis/S2/issues/372
 * Wrong position of grandTotal cells in multi-value mode
 *
 */
import { find } from 'lodash';
import * as mockDataConfig from 'tests/data/data-issue-372.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';
import { Node } from '@/facet/layout/node';
import { S2Options } from '@/common';

const s2Options: S2Options = {
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
  let s2: PivotSheet;
  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
    s2.render();
  });
  test('should get right height of GrandTotal node', () => {
    const hierarchy = s2.facet.layoutResult.colsHierarchy;
    const grandTotalNode = find(
      hierarchy.getNodes(0),
      (node: Node) => node.isGrandTotals,
    ) as Node;
    expect(grandTotalNode.height).toEqual(30);
  });
});
