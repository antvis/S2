import { each, isBoolean, isEmpty } from 'lodash';
import { Node } from '@/facet/layout/node';
import { LayoutResult, SpreadSheetFacetCfg } from '@/common/interface';
import { Hierarchy } from '@/facet/layout/hierarchy';

/**
 * re-arrange field values by custom arrange hooks
 * @param fieldValues
 * @param facetCfg
 * @param parent
 * @param field
 */
export const layoutArrange = (
  fieldValues: string[],
  facetCfg: SpreadSheetFacetCfg,
  parent: Node,
  field: string,
): string[] => {
  if (facetCfg.layoutArrange) {
    return facetCfg.layoutArrange(
      facetCfg.spreadsheet,
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
): boolean => {
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
  if (facetCfg.layoutHierarchy) {
    const facetLayoutHierarchy = facetCfg.layoutHierarchy(
      facetCfg.spreadsheet,
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
        each(unshiftNodes, (v) => {
          addNode(v);
        });
        currentIndex = parentNode.children.length;
        hierarchyIndex = hierarchy.getNodes().length;
      }
      if (!isEmpty(pushNodes)) {
        each(pushNodes, (v) => {
          addNode(v);
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
 * @param facetCfg
 * @param rowNode
 * @param colNode
 */
export const layoutCoordinate = (
  facetCfg: SpreadSheetFacetCfg,
  rowNode: Node,
  colNode: Node,
) => {
  if (facetCfg?.layoutCoordinate) {
    // only leaf node's coordinates can be modified
    if (rowNode?.isLeaf || colNode?.isLeaf) {
      facetCfg?.layoutCoordinate(facetCfg.spreadsheet, rowNode, colNode);
    }
  }
};

/**
 * Custom position cell's data
 * @param facetCfg
 * @param layoutResult
 */
export const layoutDataPosition = (
  facetCfg: SpreadSheetFacetCfg,
  layoutResult: LayoutResult,
): LayoutResult => {
  const dataPosition = facetCfg?.layoutDataPosition;
  if (dataPosition) {
    const { getCellMeta } = layoutResult;
    const handledGetCellMeta = dataPosition(facetCfg.spreadsheet, getCellMeta);
    return {
      ...layoutResult,
      getCellMeta: handledGetCellMeta,
    };
  }
  return layoutResult;
};
