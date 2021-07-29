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
import { buildRowCustomTreeHierarchy } from '@/facet/layout/build-row-custom-tree-hierarchy';
import { SpreadSheet } from '@/sheet-type';
import { SpreadSheetFacetCfg } from '@/common/interface';

interface HeaderParams {
  isValueInCols: boolean;
  isPivotMode: boolean;
  moreThanOneValue: boolean;
  hierarchy: Hierarchy;
  rootNode: Node;
  spreadsheet: SpreadSheet;
  facetCfg: SpreadSheetFacetCfg;
  fields: string[];
}

const handleGridRowColHierarchy = (params: HeaderParams) => {
  const {
    isValueInCols,
    moreThanOneValue,
    rootNode,
    facetCfg,
    hierarchy,
    fields,
  } = params;
  // row grid hierarchy
  const addTotalMeasureInTotal = !isValueInCols && moreThanOneValue;
  // value in rows and only has one value(or none)
  const addMeasureInTotalQuery = !isValueInCols && !moreThanOneValue;
  buildGridHierarchy({
    addTotalMeasureInTotal,
    addMeasureInTotalQuery,
    parentNode: rootNode,
    currentField: fields[0],
    fields,
    facetCfg,
    hierarchy,
  });
};

const handleCustomTreeRowHierarchy = (params: HeaderParams) => {
  const { facetCfg, rootNode, hierarchy } = params;
  const customTreeItems = facetCfg.dataSet.fields.customTreeItems;
  // row custom tree header
  buildRowCustomTreeHierarchy({
    customTreeItems: customTreeItems,
    facetCfg,
    level: 0,
    parentNode: rootNode,
    hierarchy,
  });
};

const handleTreeRowHierarchy = (params: HeaderParams) => {
  const { facetCfg, rootNode, hierarchy } = params;
  const { hierarchyType, rows, dataSet } = facetCfg;
  if (hierarchyType === 'tree') {
    // row tree hierarchy(value must stay in colHeader)
    buildRowTreeHierarchy({
      level: 0,
      currentField: rows[0],
      pivotMeta: (dataSet as PivotDataSet).rowPivotMeta,
      facetCfg,
      parentNode: rootNode,
      hierarchy,
    });
  } else {
    handleCustomTreeRowHierarchy(params);
  }
};

const handleRowHeaderHierarchy = (params: HeaderParams) => {
  const { isPivotMode, spreadsheet } = params;
  if (isPivotMode) {
    if (spreadsheet.isHierarchyTreeType()) {
      handleTreeRowHierarchy(params);
    } else {
      handleGridRowColHierarchy(params);
    }
  }
};

const handleColHeaderHierarchy = (params: HeaderParams) => {
  const { isPivotMode, hierarchy, rootNode, facetCfg } = params;
  if (isPivotMode) {
    handleGridRowColHierarchy(params);
  } else {
    buildTableHierarchy({
      parentNode: rootNode,
      hierarchy,
      facetCfg,
    });
  }
};

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
  const { values, spreadsheet, rows, columns } = facetCfg;
  const isValueInCols = spreadsheet.dataCfg.fields.valueInCols;
  const isPivotMode = spreadsheet.isPivotMode();
  const moreThanOneValue = values.length > 1;
  const rootNode = Node.rootNode();
  const hierarchy = new Hierarchy();
  const headParams = {
    isValueInCols,
    isPivotMode,
    moreThanOneValue,
    rootNode,
    hierarchy,
    spreadsheet,
    facetCfg,
    fields: isRowHeader ? rows : columns,
  } as HeaderParams;
  if (isRowHeader) {
    handleRowHeaderHierarchy(headParams);
  } else {
    handleColHeaderHierarchy(headParams);
  }

  const getLeafNodes = () => {
    if (!isRowHeader) return hierarchy.getLeaves();
    return spreadsheet.isHierarchyTreeType()
      ? hierarchy.getNodes()
      : hierarchy.getLeaves();
  };
  return {
    hierarchy,
    leafNodes: getLeafNodes(),
  } as BuildHeaderResult;
};
