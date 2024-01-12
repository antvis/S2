import { each, isBoolean, isEmpty } from 'lodash';
import type { SpreadSheet } from '../../sheet-type';
import type { Hierarchy } from '../layout/hierarchy';
import type { Node } from '../layout/node';

/**
 * re-arrange field values by custom arrange hooks
 */
export const layoutArrange = (
  spreadsheet: SpreadSheet,
  fieldValues: string[],
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
 */
export const layoutHierarchy = (
  spreadsheet: SpreadSheet,
  parentNode: Node,
  currentNode: Node,
  hierarchy: Hierarchy,
): boolean => {
  const hiddenColumnNode =
    spreadsheet?.facet?.getHiddenColumnsInfo(currentNode);

  if (
    hiddenColumnNode &&
    // fix: Only hiding the column headers is supported to prevent the row subtotals from being hidden when the IDs of the row totals and column totals are the same.
    spreadsheet?.dataSet?.fields?.columns?.find(
      (field) => field === currentNode?.field,
    )
  ) {
    return false;
  }

  let expandCurrentNode = true;
  const addNode = (node: Node, insetIndex = -1, hierarchyIndex = -1) => {
    if (insetIndex === -1) {
      // add in parent
      parentNode.children.push(node);
      hierarchy.pushNode(node);
    } else {
      parentNode.children.splice(insetIndex, 0, node);
      hierarchy.pushNode(node, hierarchyIndex);
    }
  };

  if (spreadsheet.options.layoutHierarchy) {
    const facetLayoutHierarchy = spreadsheet.options.layoutHierarchy(
      spreadsheet,
      currentNode,
    );

    if (facetLayoutHierarchy) {
      const deleteNode = !isBoolean(facetLayoutHierarchy?.delete)
        ? false
        : facetLayoutHierarchy?.delete;

      expandCurrentNode = !deleteNode;
      const { push: pushNodes, unshift: unshiftNodes } = facetLayoutHierarchy;
      let currentIndex = parentNode.children.length;
      let hierarchyIndex = hierarchy.getNodes().length;

      if (!isEmpty(unshiftNodes)) {
        each(unshiftNodes, (node) => {
          addNode(node);
        });
        currentIndex = parentNode.children.length;
        hierarchyIndex = hierarchy.getNodes().length;
      }

      if (!isEmpty(pushNodes)) {
        each(pushNodes, (node) => {
          addNode(node);
        });
      }

      if (!deleteNode) {
        addNode(currentNode, currentIndex, hierarchyIndex);
      }
    } else {
      addNode(currentNode);
    }
  } else {
    addNode(currentNode);
  }

  return expandCurrentNode;
};

/**
 * custom control every header node's coordinates
 */
export const layoutCoordinate = (
  spreadsheet: SpreadSheet,
  rowNode: Node | null,
  colNode: Node | null,
) => {
  if (spreadsheet.options?.layoutCoordinate) {
    // only leaf node's coordinates can be modified
    if (rowNode?.isLeaf || colNode?.isLeaf) {
      spreadsheet.options?.layoutCoordinate(spreadsheet, rowNode, colNode);
    }
  }
};
