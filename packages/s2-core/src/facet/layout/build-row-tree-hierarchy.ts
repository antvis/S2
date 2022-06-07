import { get, isEmpty } from 'lodash';
import { i18n, ID_SEPARATOR, ROOT_ID } from '../../common';
import type { PivotDataSet } from '../../data-set';
import type { SpreadSheet } from '../../sheet-type';
import { filterUndefined, getListBySorted } from '../../utils/data-set-operate';
import { getDimensionsWithoutPathPre } from '../../utils/dataset/pivot-data-set';
import { generateId } from '../../utils/layout/generate-id';
import type { FieldValue, TreeHeaderParams } from '../layout/interface';
import { layoutArrange, layoutHierarchy } from '../layout/layout-hooks';
import { Node } from '../layout/node';
import { TotalClass } from '../layout/total-class';

const addTotals = (
  spreadsheet: SpreadSheet,
  currentField: string,
  fieldValues: FieldValue[],
) => {
  const totalsConfig = spreadsheet.getTotalsConfig(currentField);
  // tree mode only has grand totals, but if there are subTotals configs,
  // it will display in cross-area cell
  // TODO valueInCol = false and one or more values
  if (totalsConfig.showGrandTotals) {
    const func = totalsConfig.reverseLayout ? 'unshift' : 'push';
    fieldValues[func](new TotalClass(totalsConfig.label, false, true));
  }
};

/**
 * Only row header has tree hierarchy, in this scene:
 * 1、value in rows is not work => valueInCols is ineffective
 * 2、can't add extra sub total node in row
 * @param params
 */
export const buildRowTreeHierarchy = (params: TreeHeaderParams) => {
  const { parentNode, currentField, level, facetCfg, hierarchy, pivotMeta } =
    params;
  const { spreadsheet, dataSet, collapsedRows, hierarchyCollapse } = facetCfg;
  const { query, id } = parentNode;
  const isDrillDownItem = spreadsheet.dataCfg.fields.rows?.length <= level;
  const sortedDimensionValues =
    (dataSet as PivotDataSet)?.sortedDimensionValues?.[currentField] || [];

  // 为第一个子层级时，parentNode.id === ROOT_ID 时，不需要通过分割获取当前节点的真实 value
  const dimensions =
    ROOT_ID === id
      ? sortedDimensionValues
      : sortedDimensionValues?.filter((item) =>
          item?.includes(id?.split(`${ROOT_ID}${ID_SEPARATOR}`)[1]),
        );

  const dimValues = filterUndefined(
    getListBySorted(
      [...(pivotMeta.keys() || [])],
      [...getDimensionsWithoutPathPre([...dimensions])],
    ),
  );

  let fieldValues: FieldValue[] = layoutArrange(
    dimValues,
    facetCfg,
    parentNode,
    currentField,
  );

  // limit displayed drill down data by drillItemsNum
  const drillItemsNum = spreadsheet.store.get('drillItemsNum');
  if (drillItemsNum && isDrillDownItem) {
    fieldValues = fieldValues.slice(0, drillItemsNum);
  }

  if (level === 0) {
    addTotals(spreadsheet, currentField, fieldValues);
  }

  for (const fieldValue of fieldValues) {
    const isTotals = fieldValue instanceof TotalClass;
    const pivotMetaValue = isTotals
      ? null
      : pivotMeta.get(fieldValue as string);
    let value;
    let nodeQuery = query;
    let isGrandTotals = false;
    let isSubTotals = false;
    if (isTotals) {
      const totalClass = fieldValue as TotalClass;
      isGrandTotals = totalClass.isGrandTotals;
      isSubTotals = totalClass.isSubTotals;
      value = i18n((fieldValue as TotalClass).label);
      nodeQuery = query;
    } else {
      value = fieldValue;
      nodeQuery = {
        ...query,
        [currentField]: value,
      };
    }
    const uniqueId = generateId(parentNode.id, value);
    const isCollapsedRow = get(collapsedRows, uniqueId);
    const isCollapse = isCollapsedRow ?? hierarchyCollapse;

    const node = new Node({
      id: uniqueId,
      key: currentField,
      label: value,
      value,
      level,
      parent: parentNode,
      field: currentField,
      isTotals,
      isGrandTotals,
      isSubTotals,
      isCollapsed: isCollapse,
      hierarchy,
      query: nodeQuery,
      spreadsheet,
    });

    if (level > hierarchy.maxLevel) {
      hierarchy.maxLevel = level;
    }

    const emptyChildren = isEmpty(pivotMetaValue?.children);
    if (emptyChildren || isTotals) {
      node.isLeaf = true;
    }
    if (!emptyChildren) {
      node.isTotals = true;
    }

    const expandCurrentNode = layoutHierarchy(
      facetCfg,
      parentNode,
      node,
      hierarchy,
    );

    if (!emptyChildren && !isCollapse && !isTotals && expandCurrentNode) {
      buildRowTreeHierarchy({
        level: level + 1,
        currentField: pivotMetaValue.childField,
        pivotMeta: pivotMetaValue.children,
        facetCfg,
        parentNode: node,
        hierarchy,
      });
    }
  }
};
