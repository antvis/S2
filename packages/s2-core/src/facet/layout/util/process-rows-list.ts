// import * as _ from 'lodash';
// import { DetailPivot } from '../../../data-set';
// import { SpreadsheetFacet } from '../../index';
// import { SpreadsheetFacetCfg } from '../../../common/interface';
// import { Hierarchy } from '../hierarchy';
// import { Node } from '../node';
// import getAdaptiveRowWidth from './get-adaptive-row-width';
// import { RowsResult } from './process-rows';
// import { ID_SEPARATOR } from '../../../common/constant';
//
// function generateNodes(
//   field: string,
//   rowValues: string[],
//   level: number,
//   parent: Node,
//   hierarchy: Hierarchy,
// ) {
//   if (rowValues) {
//     rowValues.forEach((value, k) => {
//       const node = new Node({
//         id: `${parent.id}${ID_SEPARATOR}${field}`,
//         key: field,
//         field,
//         value,
//         level,
//         parent,
//         rowIndex: k,
//         isTotals: false,
//         isCollapsed: false,
//         isSubTotals: false,
//         isGrandTotals: false,
//       });
//       hierarchy.pushNode(node);
//     });
//   }
// }
//
// export default function processRowsList(
//   pivot: DetailPivot,
//   cfg: SpreadsheetFacetCfg,
//   rows: string[],
//   facet: SpreadsheetFacet,
// ) {
//   const { cellCfg, rowCfg } = cfg;
//   const initHeight = cellCfg.height + 2 * cellCfg.padding;
//
//   const rowsHierarchy = new Hierarchy();
//   rowsHierarchy.rows = rows;
//   const rootNode = Node.rootNode();
//   // eslint-disable-next-line no-restricted-syntax
//   for (const row of rows) {
//     const rowValues = pivot.getDimValues(row);
//     generateNodes(row, rowValues, rows.indexOf(row), rootNode, rowsHierarchy);
//   }
//
//   // each row's nodes length
//   const rowNodeLength = rootNode.children.length / rows.length;
//   // each col's first nodes list
//   const colFirstNodes: Map<string, Node> = new Map<string, Node>();
//   // level's x-coordinate
//   const levelWidths: Map<string, number> = new Map<string, number>();
//
//   // the step of algorithm
//   // 1、get the first node is rows, and calculate theirs width & height, and store to reuse in same level
//   // 2、calculate each level node's x-coordinate
//   // 3、calculate each node's height( index % rowNodeLength * initHeight)
//   for (let i = 0; i < rootNode.children.length; i++) {
//     const current = rootNode.children[i];
//     const currentLevel = current.level;
//     const levelKey = `${currentLevel}`;
//     if (!colFirstNodes.has(levelKey)) {
//       // calculate first node in thi level
//       current.width = getAdaptiveRowWidth(
//         rowsHierarchy,
//         current,
//         rowCfg,
//         cellCfg,
//         facet,
//         cfg,
//         false,
//       );
//       // remove any padding(text align left)
//       current.padding = 0;
//       const draggedWidth = _.get(rowCfg, `widthByField.${current.key}`);
//       if (draggedWidth) {
//         current.width = draggedWidth;
//       }
//       current.height = initHeight;
//
//       // current level node's x-coordinate
//       let levelWidth = 0;
//       colFirstNodes.forEach((value, key) => {
//         if (parseInt(key, 10) < currentLevel) {
//           levelWidth += value.width;
//         }
//       });
//       levelWidths.set(levelKey, levelWidth);
//       colFirstNodes.set(levelKey, current);
//     } else {
//       // level exist, re-use it
//       current.width = colFirstNodes.get(levelKey).width;
//       current.height = colFirstNodes.get(levelKey).height;
//     }
//
//     current.y = (i % rowNodeLength) * initHeight;
//     current.x = levelWidths.get(levelKey);
//
//     // mark leaf node
//     if (currentLevel === rows.length - 1) {
//       current.isLeaf = true;
//     }
//   }
//
//   const firstRowNodes = rootNode.children.filter((node) => node.level === 0);
//
//   // width / height for header area
//   colFirstNodes.forEach((value) => {
//     rowsHierarchy.width += value.width;
//     rowsHierarchy.sampleNodesForAllLevels.push(value);
//   });
//   _.each(firstRowNodes, (node) => {
//     rowsHierarchy.height += node.height;
//   });
//
//   return {
//     rowLeafNodes: firstRowNodes,
//     rowsHierarchy,
//   } as RowsResult;
// }
