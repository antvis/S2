import { FileValue, TreeHeaderParams } from 'src/facet/layout/interface';
import { layoutArrange, layoutHierarchy } from 'src/facet/layout/layout-hooks';
import { TotalClass } from 'src/facet/layout/total-class';
import { i18n } from 'src/common/i18n';
import { generateId } from 'src/facet/layout/util/generate-id';
import { Node } from 'src/facet/layout/node';
import { isEmpty, merge, isBoolean } from 'lodash';
import { SpreadSheet } from '@/sheet-type';
import { getIntersections, filterUndefined } from '@/utils/data-set-operate';
import { PivotDataSet } from '@/data-set';

const addTotals = (
  spreadsheet: SpreadSheet,
  currentField: string,
  fieldValues: FileValue[],
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
  const {
    parentNode,
    currentField,
    level,
    facetCfg,
    hierarchy,
    pivotMeta,
  } = params;
  const { spreadsheet, dataSet, collapsedRows, hierarchyCollapse } = facetCfg;
  const query = parentNode.query;
  const isDrillDownItem = spreadsheet.dataCfg.fields.rows?.length <= level;
  const dimValues = filterUndefined(
    getIntersections(
      [...(dataSet as PivotDataSet)?.sortedDimensionValues?.get(currentField)],
      [...pivotMeta.keys()],
    ),
  );

  let fieldValues: FileValue[] = layoutArrange(
    dimValues,
    spreadsheet,
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
    if (isTotals) {
      value = i18n((fieldValue as TotalClass).label);
      nodeQuery = query;
    } else {
      value = fieldValue;
      nodeQuery = merge({}, query, { [currentField]: value });
    }
    const uniqueId = generateId(parentNode.id, value, facetCfg);
    const collapsedRow = collapsedRows[uniqueId];
    const isCollapse =
      isBoolean(collapsedRow) && collapsedRow
        ? collapsedRow
        : hierarchyCollapse;
    // TODO special logic to custom control node's collapsed state
    // if (isTotal) {
    //   // 总计用户不会有收缩状态
    //   isCollapse = false;
    // }
    // // 处理决策模式下，初始化节点的收缩状态，一次性！！
    // if (_.isBoolean(collapsedRows[uniqueId]) || hierarchyCollapse) {
    //   // 有操作后节点的情况下，需要以操作的为准，isCollapse不变
    // } else {
    //   // 没有操作的过节点的情况下，默认以配置为准
    //   const extra = findNodeExtraCfg(values, { [currentField]: value });
    //   // 必须不为空
    //   if (extra && !_.isEmpty(value)) {
    //     isCollapse = extra.collapse;
    //   }
    // }
    const node = new Node({
      id: uniqueId,
      key: currentField,
      label: value,
      value,
      level,
      parent: parentNode,
      field: currentField,
      isTotals,
      isCollapsed: isCollapse,
      hierarchy,
      query: nodeQuery,
      spreadsheet,
    });

    layoutHierarchy(facetCfg, parentNode, node, hierarchy);

    const emptyChildren = isEmpty(pivotMetaValue?.children);
    if (emptyChildren || isTotals) {
      node.isLeaf = true;
    }

    if (!emptyChildren && !isCollapse && !isTotals) {
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
