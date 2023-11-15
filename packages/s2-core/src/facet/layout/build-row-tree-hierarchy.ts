import { isNumber } from 'lodash';
import { i18n } from '../../common';
import type { SpreadSheet } from '../../sheet-type';
import { filterTotal } from '../../utils/data-set-operate';
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
    fieldValues[func](
      new TotalClass({
        label: totalsConfig.label,
        isSubTotals: false,
        isGrandTotals: true,
      }),
    );
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
  const { spreadsheet, collapsedRows, hierarchyCollapse, rowExpandDepth } =
    facetCfg;
  const { query, id: parentId } = parentNode;
  const isDrillDownItem = spreadsheet.dataCfg.fields.rows?.length <= level;

  const dimValues = filterTotal(Array.from(pivotMeta.keys()));

  let fieldValues: FieldValue[] = layoutArrange(
    dimValues,
    facetCfg,
    parentNode,
    currentField,
  );

  // limit displayed drill down data by drillItemsNum
  const drillItemsNum = spreadsheet.store.get('drillItemsNum');
  if (isDrillDownItem && drillItemsNum > 0) {
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
    const uniqueId = generateId(parentId, value);

    // 行头收起/展开配置优先级:collapseRows -> rowExpandDepth -> hierarchyCollapse
    // 优先从读取 collapseRows 中的特定 node 的值
    // 如果没有特定配置，再查看是否配置了层级展开配置，
    // 最后再降级到 hierarchyCollapse 中
    const isCollapsedRow = collapsedRows?.[uniqueId];
    // 如果 level 大于 rowExpandDepth或者没有配置层级展开配置时，返回null，保证能正确降级到 hierarchyCollapse
    const isLevelCollapsed = isNumber(rowExpandDepth)
      ? level > rowExpandDepth
      : null;
    const isCollapse = isCollapsedRow ?? isLevelCollapsed ?? hierarchyCollapse;

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

    const emptyChildren = !pivotMetaValue?.children?.size;
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
