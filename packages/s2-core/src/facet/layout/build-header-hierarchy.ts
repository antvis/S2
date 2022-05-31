import { SpreadSheetFacetCfg } from '../../common/interface';
import { PivotDataSet } from '../../data-set';
import { SpreadSheet } from '../../sheet-type';
import { buildGridHierarchy } from '../layout/build-gird-hierarchy';
import { buildRowCustomTreeHierarchy } from '../layout/build-row-custom-tree-hierarchy';
import { buildRowTreeHierarchy } from '../layout/build-row-tree-hierarchy';
import { buildTableHierarchy } from '../layout/build-table-hierarchy';
import { Hierarchy } from '../layout/hierarchy';
import { BuildHeaderParams, BuildHeaderResult } from '../layout/interface';
import { Node } from '../layout/node';

interface HeaderParams {
  isValueInCols: boolean;
  isPivotMode: boolean;
  moreThanOneValue: boolean;
  hierarchy: Hierarchy;
  rootNode: Node;
  spreadsheet: SpreadSheet;
  facetCfg: SpreadSheetFacetCfg;
  fields: string[];
  isRowHeader: boolean;
}

const handleGridRowColHierarchy = (params: HeaderParams) => {
  const {
    isValueInCols,
    moreThanOneValue,
    rootNode,
    facetCfg,
    hierarchy,
    fields,
    isRowHeader,
  } = params;
  // add new total measure in total node
  let addTotalMeasureInTotal: boolean;
  // add measure info in total query
  let addMeasureInTotalQuery: boolean;
  if (isRowHeader) {
    addTotalMeasureInTotal = !isValueInCols && moreThanOneValue;
    addMeasureInTotalQuery = !isValueInCols && !moreThanOneValue;
  } else {
    addTotalMeasureInTotal = isValueInCols && moreThanOneValue;
    addMeasureInTotalQuery = isValueInCols && !moreThanOneValue;
  }

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
    customTreeItems,
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
  // 只有透视表有行头
  const { spreadsheet } = params;
  if (spreadsheet.isHierarchyTreeType()) {
    handleTreeRowHierarchy(params);
  } else {
    handleGridRowColHierarchy(params);
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
  const { spreadsheet, rows = [], columns = [] } = facetCfg;
  const isValueInCols = spreadsheet.dataCfg.fields.valueInCols;
  const isPivotMode = spreadsheet.isPivotMode();
  const moreThanOneValue = facetCfg.dataSet.moreThanOneValue();
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
    isRowHeader,
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
