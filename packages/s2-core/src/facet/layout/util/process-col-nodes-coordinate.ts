import * as _ from 'lodash';
import { BaseFacet } from "src/facet";
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import getColHeight from './get-col-height';
import hideRowColumnsByFields from './hide-row-columns-by-fields';
import processColLeafNodeWH from './process-col-leaf-node-wh';
import handleLayoutHook from './handle-layout-hook';
import { ID_SEPARATOR } from '../../../common/constant';

/**
 * Set all nodes x,y,width,height etc coordinate in colHeader
 */
export default function processColNodesCoordinate(
  colLeafNodes: Node[],
  rowsHierarchy: Hierarchy,
  colsHierarchy: Hierarchy,
  facet: BaseFacet,
) {
  const { cellCfg, colCfg, spreadsheet } = facet.cfg;
  processColLeafNodeWH(colLeafNodes, rowsHierarchy, facet.cfg, facet, true);
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
      handleLayoutHook(facet.cfg, null, parent);
      hideRowColumnsByFields(spreadsheet, facet, parent);
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
    if (node.isLeaf && node.id !== `root${ID_SEPARATOR}undefined`) {
      // all node's width
      colsHierarchy.width += node.width;
    }
  }

  // all node's height
  _.each(colsHierarchy.sampleNodesForAllLevels, (node) => {
    colsHierarchy.height += node.height;
  });
}
