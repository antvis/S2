import { each, get } from 'lodash';
import { SpreadsheetFacet } from '../../index';
import { SpreadsheetFacetCfg } from '../../../common/interface';
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import getAdaptiveRowWidth from './get-adaptive-row-width';
import hideRowColumnsByFields from './hide-row-columns-by-fields';
import handleLayoutHook from './handle-layout-hook';

/**
 * Set all nodes x,y,width,height etc coordinate(for SpreadSheet)
 * the step of algorithm
 * 1、all leaf nodes's height, width, y
 * 2、no-leaf nodes's height, width, y
 * 3、all nodes's x
 * 4、{@param rowsHierarchy}'s width, height
 * @param cfg row's config
 * @param facet spreadsheet's facet
 * @param rowLeafNodes all will be handled leaf nodes
 * @param rowsHierarchy row type 'tree' | 'grid'
 */
export default function processRowNodesCoordinate(
  cfg: SpreadsheetFacetCfg,
  facet: SpreadsheetFacet,
  rowsHierarchy: Hierarchy,
  rowLeafNodes: Node[],
) {
  const { cellCfg, rowCfg } = cfg;
  let prevRow = Node.blankNode();
  let currentRowCellIndex = 0;
  // y & height & width for leaves node
  // (or branches included in tree hierarchy type)
  // eslint-disable-next-line no-restricted-syntax
  for (const cell of rowLeafNodes) {
    cell.colIndex = currentRowCellIndex;
    currentRowCellIndex += 1;
    cell.y = prevRow.y + prevRow.height;
    cell.height = cellCfg.height + 2 * cellCfg.padding;
    hideRowColumnsByFields(cfg.spreadsheet, facet, cell, true);
    cell.width = getAdaptiveRowWidth(
      rowsHierarchy,
      cell,
      rowCfg,
      cellCfg,
      facet,
      cfg,
    );
    // 叶子节点回调
    handleLayoutHook(cfg, cell, null);
    prevRow = cell;
  }

  // calculate other nodes(exclude leaves) with grid types
  if (!facet.spreadsheet.isHierarchyTreeType()) {
    // copy all leaf nodes
    const leafNodes = rowLeafNodes.slice(0);
    let prevRowParent = null;
    while (leafNodes.length) {
      // remove current leaf node
      const node = leafNodes.shift();
      const parent = node.parent;
      if (prevRowParent !== parent && parent) {
        // put current parent node into list
        leafNodes.push(parent);
        // parent's y = first child's y
        parent.y = parent.children[0].y;
        // parent's height = all children's height
        parent.height = parent.children
          .map((value) => value.height)
          .reduce((sum, current) => {
            return sum + current;
          });
        parent.width = getAdaptiveRowWidth(
          rowsHierarchy,
          parent,
          rowCfg,
          cellCfg,
          facet,
          cfg,
        );
        // mark pre-parent
        // 非叶子节点回调
        handleLayoutHook(cfg, parent, null);
        prevRowParent = parent;
      }
    }
    // all node's x-coordinate
    // eslint-disable-next-line no-restricted-syntax
    for (const node of rowsHierarchy.getNodes()) {
      if (node.level === 0) {
        node.x = 0;
      } else {
        node.x = node.parent.x + node.parent.width;
      }
      if (node.isLeaf) {
        // all node's height
        rowsHierarchy.height += node.height;
      }
    }
    // all nodes' width
    each(rowsHierarchy.sampleNodesForAllLevels, (value: Node) => {
      rowsHierarchy.width += value.width;
    });
  } else {
    const rowsStack = rowLeafNodes.slice(0);
    while (rowsStack.length) {
      const node = rowsStack.shift();
      node.width = cfg?.rowCfg?.treeRowsWidth || cfg.treeRowsWidth;
      if (!cfg?.rowCfg?.treeRowsWidth) {
        // user not drag
        handleLayoutHook(cfg, node, null);
      }
      // all node's height
      rowsHierarchy.height += node.height;
    }
    // all nodes' width
    rowsHierarchy.width = get(rowsHierarchy, 'sampleNodeForLastLevel.width', 0);
  }
}
