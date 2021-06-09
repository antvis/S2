import { FileValue, TreeHeaderParams } from 'src/facet/layout/interface';
import getDimsCondition from 'src/facet/layout/util/get-dims-condition-by-node';
import { layoutArrange, layoutHierarchy } from 'src/facet/layout/layout-hooks';
import { TotalClass } from 'src/facet/layout/total-class';
import { i18n } from 'src/common/i18n';
import { generateId } from 'src/facet/layout/util/generate-id';
import { Node } from 'src/facet/layout/node';
import * as _ from 'lodash';

/**
 * Only row header has tree hierarchy, in this scene:
 * 1、value in rows is not work => valueInCols is ineffective
 * 2、can't add extra sub total node in row
 * @param params
 */
export const buildRowTreeHierarchy = (params: TreeHeaderParams) => {
  const { parentNode, currentField, fields, facetCfg, hierarchy } = params;
  const {
    dataSet,
    spreadsheet,
    collapsedRows,
    hierarchyCollapse,
  } = facetCfg;
  const index = fields.indexOf(currentField);
  const query = getDimsCondition(parentNode, true);
  const dimValues = dataSet.getDimensionValues(currentField, query);
  const fieldValues: FileValue[] = layoutArrange(
    dimValues,
    spreadsheet,
    parentNode,
    currentField,
  );
  const totalsConfig = spreadsheet.getTotalsConfig(currentField);

  // tree mode only has grand totals, but if there are subTotals configs, it will
  // display in cross-area cell
  if (currentField === fields[0] && totalsConfig.showGrandTotals) {
    const func = totalsConfig.reverseLayout ? 'unshift' : 'push';
    fieldValues[func](new TotalClass(totalsConfig.label, false, true));
  }

  for (const fieldValue of fieldValues) {
    const isTotals = fieldValue instanceof TotalClass;
    let value;
    let nodeQuery = query;
    if (isTotals) {
      value = i18n((fieldValue as TotalClass).label);
      nodeQuery = query;
    } else {
      value = fieldValue;
      nodeQuery = _.merge({}, query, { [currentField]: value });
    }
    const uniqueId = generateId(parentNode.id, value, facetCfg);
    const isCollapse = _.isBoolean(collapsedRows[uniqueId])
      ? collapsedRows[uniqueId]
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
      level: index,
      parent: parentNode,
      field: currentField,
      isTotals,
      isCollapsed: isCollapse,
      hierarchy,
      query: nodeQuery,
      spreadsheet,
    });

    layoutHierarchy(facetCfg, parentNode, node, hierarchy);

    // TODO re-check this logic
    if (index > hierarchy.maxLevel) {
      hierarchy.sampleNodesForAllLevels.push(node);
      hierarchy.sampleNodeForLastLevel = node;
      hierarchy.maxLevel = index;
    }
    if (index === fields.length - 1 || isTotals) {
      node.isLeaf = true;
    }

    if (index < fields.length - 1 && !isCollapse && !isTotals) {
      buildRowTreeHierarchy({
        currentField: fields[index + 1],
        fields,
        facetCfg,
        parentNode: node,
        hierarchy,
      });
    }
  }
};
