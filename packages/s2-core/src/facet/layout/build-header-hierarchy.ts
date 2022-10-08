import { filter } from 'lodash';
import {
  EXTRA_FIELD,
  type CustomHeaderFields,
  type CustomTreeItem,
} from '../../common';
import type { SpreadSheetFacetCfg } from '../../common/interface';
import type { PivotDataSet } from '../../data-set';
import type { SpreadSheet } from '../../sheet-type';
import { buildGridHierarchy } from '../layout/build-gird-hierarchy';
import { buildCustomTreeHierarchy } from '../layout/build-row-custom-tree-hierarchy';
import { buildRowTreeHierarchy } from '../layout/build-row-tree-hierarchy';
import { buildTableHierarchy } from '../layout/build-table-hierarchy';
import { Hierarchy } from '../layout/hierarchy';
import type { BuildHeaderParams, BuildHeaderResult } from '../layout/interface';
import { Node } from '../layout/node';

interface HeaderParams {
  isValueInCols: boolean;
  isPivotMode: boolean;
  moreThanOneValue: boolean;
  hierarchy: Hierarchy;
  rootNode: Node;
  spreadsheet: SpreadSheet;
  facetCfg: SpreadSheetFacetCfg;
  fields: CustomHeaderFields;
  isRowHeader: boolean;
  isCustomTreeFields: boolean;
}

const handleCustomTreeHierarchy = (params: HeaderParams) => {
  const { facetCfg, rootNode, hierarchy, fields } = params;

  // 自定义行/列 需要去除额外添加的 EXTRA_FIELD 虚拟数值字段, 即不参与布局, 只用于定位数据
  const withoutExtraFields = filter(
    fields,
    (field) => field !== EXTRA_FIELD,
  ) as CustomTreeItem[];

  const customTreeItems =
    facetCfg.hierarchyType === 'customTree'
      ? facetCfg.dataSet.fields.customTreeItems
      : withoutExtraFields;

  // custom tree header
  buildCustomTreeHierarchy({
    tree: customTreeItems,
    facetCfg,
    level: 0,
    parentNode: rootNode,
    hierarchy,
  });
};

const handleGridRowColHierarchy = (params: HeaderParams) => {
  const {
    isValueInCols,
    moreThanOneValue,
    rootNode,
    facetCfg,
    hierarchy,
    fields,
    isRowHeader,
    isCustomTreeFields,
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

  if (isCustomTreeFields) {
    handleCustomTreeHierarchy(params);
  } else {
    buildGridHierarchy({
      addTotalMeasureInTotal,
      addMeasureInTotalQuery,
      parentNode: rootNode,
      currentField: (fields as string[])[0],
      fields: fields as string[],
      facetCfg,
      hierarchy,
    });
  }
};

const handleTreeRowHierarchy = (params: HeaderParams) => {
  const { facetCfg, rootNode, hierarchy, isCustomTreeFields } = params;
  const { hierarchyType, rows, dataSet } = facetCfg;

  if (hierarchyType === 'tree' && !isCustomTreeFields) {
    // row tree hierarchy(value must stay in colHeader)
    buildRowTreeHierarchy({
      level: 0,
      currentField: rows[0] as string,
      pivotMeta: (dataSet as PivotDataSet).rowPivotMeta,
      facetCfg,
      parentNode: rootNode,
      hierarchy,
    });
  } else {
    handleCustomTreeHierarchy(params);
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
  const fields = isRowHeader ? rows : columns;
  const isCustomTreeFields = spreadsheet.isCustomFields(
    isRowHeader ? 'rows' : 'columns',
  );

  const headerParams: HeaderParams = {
    isValueInCols,
    isPivotMode,
    moreThanOneValue,
    rootNode,
    hierarchy,
    spreadsheet,
    facetCfg,
    fields,
    isRowHeader,
    isCustomTreeFields,
  };

  if (isRowHeader) {
    handleRowHeaderHierarchy(headerParams);
  } else {
    handleColHeaderHierarchy(headerParams);
  }

  const getLeafNodes = () => {
    if (!isRowHeader) {
      return hierarchy.getLeaves();
    }
    return spreadsheet.isHierarchyTreeType()
      ? hierarchy.getNodes()
      : hierarchy.getLeaves();
  };

  return {
    hierarchy,
    leafNodes: getLeafNodes(),
  } as BuildHeaderResult;
};
