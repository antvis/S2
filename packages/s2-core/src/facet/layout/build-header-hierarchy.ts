import {
  BuildHeaderParams,
  BuildHeaderResult,
} from 'src/facet/layout/interface';
import { Hierarchy } from 'src/facet/layout/hierarchy';
import { Node } from 'src/facet/layout/node';
import { buildRowTreeHierarchy } from 'src/facet/layout/build-row-tree-hierarchy';
import { buildGridHierarchy } from 'src/facet/layout/build-gird-hierarchy';
import { buildTableHierarchy } from 'src/facet/layout/build-table-hierarchy';
import { PivotDataSet } from '@/data-set';
import { generateHeaderNodes } from '@/facet/layout/util/generate-row-nodes';
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
export const buildHeaderHierarchy = (
  params: BuildHeaderParams,
): BuildHeaderResult => {
  const { isRowHeader, facetCfg } = params;
  const { rows, cols, values, spreadsheet, dataSet } = facetCfg;

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
          level: 0,
          currentField: rows[0],
          pivotMeta: (dataSet as PivotDataSet).rowPivotMeta,
          facetCfg,
          parentNode: rootNode,
          hierarchy,
        });
        return {
          hierarchy,
          leafNodes: hierarchy.getNodes(),
        } as BuildHeaderResult;
      }
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
    } else {
      // TODO table mode -> row
    }
  } else if (isPivotMode) {
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
    buildTableHierarchy({
      parentNode: rootNode,
      facetCfg,
      hierarchy,
    });
  }
  return {
    hierarchy,
    leafNodes: hierarchy.getLeaves(),
  } as BuildHeaderResult;
};
