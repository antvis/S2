import {
  BuildHeaderParams,
  BuildHeaderResult,
} from "src/facet/layout/interface";
import { Hierarchy } from "src/facet/layout/hierarchy";
import { Node } from "src/facet/layout/node";
import { buildRowTreeHierarchy } from "src/facet/layout/build-row-tree-hierarchy";
import { buildGridHierarchy } from "src/facet/layout/build-gird-hierarchy";
/**
 * Header Hierarchy
 * - row header
 *   - tree layout
 *     - custom tree layout
 *   - grid layout
 *   - table layout
 * - col header
 *   - grid layout
 *     - single value
 *       - total + sub_total
 *     - more than one value
 *       - total + sub_total
 *         - separate by values
 *   - table layout
 * @param params
 */
export const buildHeaderHierarchy = (params: BuildHeaderParams): BuildHeaderResult => {
  const { isRowHeader, facetCfg } = params;
  const { rows, cols, values, spreadsheet } = facetCfg;
  const isValueInCols = spreadsheet.dataCfg.fields.valueInCols;
  const isPivotMode = spreadsheet.isPivotMode();
  const moreThanOneValue = values.length > 1;
  const rootNode = Node.rootNode();
  const hierarchy = new Hierarchy();
  if (isRowHeader) {
    if (isPivotMode) {
      if (spreadsheet.isHierarchyTreeType()) {
        // row tree hierarchy(value must stay in colHeader)
        buildRowTreeHierarchy({
          currentField: rows[0],
          fields: rows,
          facetCfg,
          parentNode: rootNode,
          hierarchy
        });
        return {
          hierarchy,
          leafNodes: hierarchy.getNodes()
        } as BuildHeaderResult
      } else {
        // row grid hierarchy
        const addTotalMeasureInTotal = !isValueInCols && moreThanOneValue;
        // value in rows and only has one value(or none)
        const addMeasureInTotalQuery = !isValueInCols && !moreThanOneValue;
        buildGridHierarchy({
          addTotalMeasureInTotal,
          addMeasureInTotalQuery,
          parentNode: rootNode,
          currentField: rows[0],
          fields: rows,
          facetCfg,
          hierarchy,
        });
      }
    } else {
      // TODO table mode -> row
    }
  } else {
    if (isPivotMode) {
      // only has grid hierarchy
      const addTotalMeasureInTotal = isValueInCols && moreThanOneValue;
      // value in cols and only has one value(or none)
      const addMeasureInTotalQuery = isValueInCols && !moreThanOneValue;
      buildGridHierarchy({
        addTotalMeasureInTotal,
        addMeasureInTotalQuery,
        parentNode: rootNode,
        currentField: cols[0],
        fields: cols,
        facetCfg,
        hierarchy,
      });
    } else {
      // TODO table mode -> col
    }
  }
  return {
    hierarchy,
    leafNodes: hierarchy.getLeaves()
  } as BuildHeaderResult
};
