import { filter } from 'lodash';
import {
  EXTRA_FIELD,
  getDefaultSeriesNumberText,
  SERIES_NUMBER_FIELD,
  type CustomTreeNode,
} from '../../common';
import type { PivotDataSet } from '../../data-set';
import { buildGridHierarchy } from '../layout/build-gird-hierarchy';
import { buildCustomTreeHierarchy } from '../layout/build-row-custom-tree-hierarchy';
import { buildRowTreeHierarchy } from '../layout/build-row-tree-hierarchy';
import { buildTableHierarchy } from '../layout/build-table-hierarchy';
import { Hierarchy } from '../layout/hierarchy';
import type {
  BuildHeaderParams,
  BuildHeaderResult,
  HeaderParams,
} from '../layout/interface';
import { Node } from '../layout/node';

const handleCustomTreeHierarchy = (params: HeaderParams) => {
  const { rootNode, hierarchy, fields, spreadsheet } = params;

  // 自定义行/列 需要去除额外添加的 EXTRA_FIELD 虚拟数值字段, 即不参与布局, 只用于定位数据
  const withoutExtraFieldsTree = filter(
    fields,
    (field) => field !== EXTRA_FIELD,
  ) as unknown as CustomTreeNode[];

  // custom tree header
  buildCustomTreeHierarchy({
    spreadsheet,
    tree: withoutExtraFieldsTree,
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
    hierarchy,
    fields,
    isRowHeader,
    isCustomTreeFields,
    spreadsheet,
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
      spreadsheet,
      addTotalMeasureInTotal,
      addMeasureInTotalQuery,
      parentNode: rootNode,
      currentField: (fields as string[])[0],
      fields: fields as string[],
      hierarchy,
    });
  }
};

const handleTreeRowHierarchy = (params: HeaderParams) => {
  const { spreadsheet, rootNode, hierarchy, isCustomTreeFields } = params;
  const { rows } = spreadsheet.dataSet.fields;

  if (spreadsheet.isHierarchyTreeType() && !isCustomTreeFields) {
    // row tree hierarchy(value must stay in colHeader)
    buildRowTreeHierarchy({
      level: 0,
      currentField: rows?.[0] as string,
      pivotMeta: (spreadsheet.dataSet as PivotDataSet).rowPivotMeta,
      parentNode: rootNode,
      hierarchy,
      spreadsheet,
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

const handleTableHierarchy = (params: HeaderParams) => {
  const { isCustomTreeFields, spreadsheet } = params;
  const { enable, text } = spreadsheet.options.seriesNumber ?? {};

  if (isCustomTreeFields) {
    const seriesNumberField: CustomTreeNode = {
      field: SERIES_NUMBER_FIELD,
      title: getDefaultSeriesNumberText(text),
    };

    const fields = enable
      ? [seriesNumberField, ...params.fields]
      : (params.fields as CustomTreeNode[]).filter(
          (node) => node?.field !== SERIES_NUMBER_FIELD,
        );

    handleCustomTreeHierarchy({
      ...params,
      fields,
    });

    return;
  }

  buildTableHierarchy(params);
};

const handleColHeaderHierarchy = (params: HeaderParams) => {
  const { spreadsheet } = params;
  const isPivotMode = spreadsheet.isPivotMode();

  if (isPivotMode) {
    handleGridRowColHierarchy(params);
  } else {
    handleTableHierarchy(params);
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
  const { isRowHeader, spreadsheet } = params;
  const { rows = [], columns = [] } = spreadsheet.dataSet.fields;
  const isValueInCols = spreadsheet.isValueInCols();
  const moreThanOneValue = spreadsheet.dataSet.moreThanOneValue();
  const rootNode = Node.rootNode();
  const hierarchy = new Hierarchy();
  const fields = isRowHeader ? rows : columns;
  const isCustomTreeFields = spreadsheet.isCustomHeaderFields(
    isRowHeader ? 'rows' : 'columns',
  );

  const headerParams: HeaderParams = {
    isValueInCols,
    moreThanOneValue,
    rootNode,
    hierarchy,
    spreadsheet,
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
  };
};
