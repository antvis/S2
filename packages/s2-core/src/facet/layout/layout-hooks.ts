import { Node } from 'src/facet/layout/node';
import { LayoutResult, SpreadSheetFacetCfg } from 'src/common/interface';
import { Hierarchy } from 'src/facet/layout/hierarchy';
import _ from 'lodash';

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
    const layoutHierarchy = facetCfg.layoutHierarchy(
      facetCfg.spreadsheet,
      currentNode,
    );
    if (layoutHierarchy) {
      const deleteNode = !_.isBoolean(layoutHierarchy?.delete)
        ? false
        : layoutHierarchy?.delete;
      expandCurrentNode = !deleteNode;
      const { push, unshift } = layoutHierarchy;
      let currentIndex = parentNode.children.length;
      let hierarchyIndex = hierarchy.getNodes().length;
      if (_.size(unshift) > 0) {
        _.each(unshift, (v) => {
          addNode(v);
        });
        currentIndex = parentNode.children.length;
        hierarchyIndex = hierarchy.getNodes().length;
      }
      if (_.size(push) > 0) {
        _.each(push, (v) => {
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
