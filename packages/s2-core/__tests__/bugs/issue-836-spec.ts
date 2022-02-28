/**
 * @description spec for issue #836
 * https://github.com/antvis/S2/issues/372
 * 当列小记项大于两个时出现列头列小计总计漂移问题
 *
 */
import { find } from 'lodash';
import * as mockDataConfig from 'tests/data/data-issue-836.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';
import { Node } from '@/facet/layout/node';
import { S2Options } from '@/common';

const s2Options: S2Options = {
  width: 1200,
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

describe('GrandTotal and SubTotal Cells Rendering Test', () => {
  let s2: PivotSheet;
  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
    s2.render();
  });

  test('should get the right height of GrandTotal node', () => {
    const hierarchy = s2.facet.layoutResult.colsHierarchy;

    const grandTotalNode = find(
      hierarchy.getNodes(0),
      (node: Node) => node.isGrandTotals,
    ) as Node;
    expect(grandTotalNode.height).toEqual(60);
  });

  test('should get the right position of GrandTotal Measure node', () => {
    const hierarchy = s2.facet.layoutResult.colsHierarchy;

    const grandTotalNode = find(
      hierarchy.getNodes(0),
      (node: Node) => node.isGrandTotals,
    ) as Node;
    expect(grandTotalNode.children[0].y).toEqual(60);
    expect(grandTotalNode.children[0].x).toEqual(0);
  });

  test('should get the right height of SubTotal node', () => {
    const hierarchy = s2.facet.layoutResult.colsHierarchy;

    const subTotalNode = find(
      hierarchy.getNodes(1),
      (node: Node) => node.isSubTotals,
    ) as Node;
    expect(subTotalNode.height).toEqual(30);
  });

  test('should get the right position of subTotalNode Measure node', () => {
    const hierarchy = s2.facet.layoutResult.colsHierarchy;
    const subTotalNode = find(
      hierarchy.getNodes(1),
      (node: Node) => node.isSubTotals,
    ) as Node;
    expect(subTotalNode.children[0].y).toEqual(60);
    expect(subTotalNode.children[0].x).toEqual(192);
  });
});
