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
  if (facetCfg.layoutHierarchy) {
    const layoutHierarchy = facetCfg.layoutHierarchy(
      facetCfg.spreadsheet,
      currentNode,
    );
    const deleteNode = _.isBoolean(layoutHierarchy?.delete)
      ? false
      : layoutHierarchy?.delete;
    const parentChildren = currentNode.parent?.children;
    if (!deleteNode) {
      // push node directly
      hierarchy.pushNode(currentNode);
    } else {
      // remove from parent
      _.remove(parentChildren, (child) => child === currentNode);
      expandCurrentNode = false;
    }
    const { push, unshift } = layoutHierarchy;
    if (push && _.size(push) > 0) {
      _.each(push, (v) => {
        hierarchy.pushNode(v);
      });
    }
    if (unshift && _.size(unshift) > 0) {
      _.each(unshift, (v) => {
        hierarchy.pushNode(v);
      });
      // adjust the index of current node
      _.remove(parentChildren, (child) => child === currentNode);
      parentChildren.push(currentNode);
    }
  } else {
    hierarchy.pushNode(currentNode);
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
    facetCfg?.layoutCoordinate(facetCfg.spreadsheet, rowNode, colNode);
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
  return dataPosition ? dataPosition(layoutResult) : layoutResult;
};
