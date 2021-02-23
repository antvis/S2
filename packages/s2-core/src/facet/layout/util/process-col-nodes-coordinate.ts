import * as _ from 'lodash';
import { SpreadsheetFacet } from '../../index';
import { SpreadsheetFacetCfg } from '../../../common/interface';
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import getColHeight from './get-col-height';
import hideRowColumnsByFields from './hide-row-columns-by-fields';
import processColLeafNodeWH from './process-col-leaf-node-wh';
import handleLayoutHook from './handle-layout-hook';

/**
 * Create By Bruce Too
 * On 2019-11-27
 * Set all nodes x,y,width,height etc coordinate in colHeader
 */
export default function processColNodesCoordinate(
  colLeafNodes: Node[],
  rowsHierarchy: Hierarchy,
  colsHierarchy: Hierarchy,
  cfg: SpreadsheetFacetCfg,
  facet: SpreadsheetFacet,
) {
  const { cellCfg, colCfg } = cfg;
  processColLeafNodeWH(colLeafNodes, rowsHierarchy, cfg, facet, true);
  // width & height for branches
  const colsStack = colLeafNodes.slice(0);
  let prevColParent = null;
  while (colsStack.length) {
    const node = colsStack.shift();
    const parent = node.parent;
    if (prevColParent !== parent && parent) {
      colsStack.push(parent);
      parent.x = parent.children[0].x;
      parent.width = parent.children
        .map((value: Node) => value.width)
        .reduce((sum, current) => {
          return sum + current;
        });
      parent.height = getColHeight(parent, colCfg, cellCfg);
      // 非叶子节点回调
      handleLayoutHook(cfg, null, parent);
      hideRowColumnsByFields(cfg.spreadsheet, facet, parent);
      prevColParent = parent;
    }
  }
  // all node's y-coordinate
  // eslint-disable-next-line no-restricted-syntax
  for (const node of colsHierarchy.getNodes()) {
    if (node.level === 0) {
      node.y = 0;
    } else {
      node.y = node.parent.y + node.parent.height;
    }
    if (node.isLeaf && node.id !== 'root-undefined') {
      // all node's width
      colsHierarchy.width += node.width;
    }
  }

  // all node's height
  _.each(colsHierarchy.sampleNodesForAllLevels, (node) => {
    colsHierarchy.height += node.height;
  });
}
