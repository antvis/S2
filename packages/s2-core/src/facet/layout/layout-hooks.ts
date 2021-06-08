import { SpreadSheet } from 'src/sheet-type';
import { Node } from 'src/facet/layout/node';
import { SpreadSheetFacetCfg } from 'src/common/interface';
import { Hierarchy } from 'src/facet/layout/hierarchy';
import * as _ from 'lodash';

/**
 * re-arrange field values by custom arrange hooks
 * @param fieldValues
 * @param spreadsheet
 * @param parent
 * @param field
 */
export const layoutArrange = (
  fieldValues: string[],
  spreadsheet: SpreadSheet,
  parent: Node,
  field: string,
): string[] => {
  if (spreadsheet.options.layoutArrange) {
    return spreadsheet.options.layoutArrange(
      spreadsheet,
      parent,
      field,
      fieldValues,
    );
  }
  return fieldValues;
};

/**
 * Push node directly or custom push according to Hierarchy Hooks
 * @param facetCfg
 * @param parentNode
 * @param currentNode
 * @param hierarchy
 */
export const layoutHierarchy = (
  facetCfg: SpreadSheetFacetCfg,
  parentNode: Node,
  currentNode: Node,
  hierarchy: Hierarchy,
) => {
  if (facetCfg.hierarchy) {
    const another = facetCfg.hierarchy(facetCfg.spreadsheet, currentNode);
    const push = another?.push;
    if (another.nodes.length > 0) {
      // 存在节点，按push 或者 unshift插入
      if (push) {
        hierarchy.pushNode(currentNode);
      }
      _.each(another.nodes, (v) => {
        hierarchy.pushNode(v);
      });
      if (!push) {
        // new node insert before current
        hierarchy.pushNode(currentNode);
        // adjust the index of current node
        _.remove(parentNode.children, (v) => v === currentNode);
        parentNode.children.push(currentNode);
      }
    } else {
      // 不存在节点，正常插入
      hierarchy.pushNode(currentNode);
    }
  } else {
    // no extra node exist
    hierarchy.pushNode(currentNode);
  }
};

/**
 * custom control every header node's coordinates
 * @param facetCfg
 * @param rowNode
 * @param colNode
 */
export const layoutNodes = (
  facetCfg: SpreadSheetFacetCfg,
  rowNode: Node,
  colNode: Node,
) => {
  const layout = facetCfg?.layout;
  if (layout) {
    layout(facetCfg.spreadsheet, rowNode, colNode);
  }
};
