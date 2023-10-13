import { isBoolean } from 'lodash';
import { EXTRA_FIELD, SERIES_NUMBER_FIELD } from '../../common/constant';
import { i18n } from '../../common/i18n';
import { buildGridHierarchy } from '../../facet/layout/build-gird-hierarchy';
import type {
  HeaderNodesParams,
  TableHeaderParams,
} from '../../facet/layout/interface';
import { layoutHierarchy } from '../../facet/layout/layout-hooks';
import { Node } from '../../facet/layout/node';
import { TotalClass } from '../../facet/layout/total-class';
import { TotalMeasure } from '../../facet/layout/total-measure';
import { generateId } from '../../utils/layout/generate-id';
import type { Columns } from '../../common';
import { whetherLeafByLevel } from './whether-leaf-by-level';

export const generateHeaderNodes = (params: HeaderNodesParams) => {
  const {
    currentField,
    fields,
    fieldValues,
    facetCfg,
    hierarchy,
    parentNode,
    level,
    query,
    addMeasureInTotalQuery,
    addTotalMeasureInTotal,
  } = params;
  const { spreadsheet, collapsedCols } = facetCfg;

  for (const [index, fieldValue] of fieldValues.entries()) {
    const isTotals = fieldValue instanceof TotalClass;
    const isTotalMeasure = fieldValue instanceof TotalMeasure;
    let value: string;
    let nodeQuery;
    let isLeaf = false;
    let isGrandTotals = false;
    let isSubTotals = false;
    let isTotalRoot = false;
    let adjustedField = currentField;
    if (isTotals) {
      const totalClass = fieldValue as TotalClass;
      isGrandTotals = totalClass.isGrandTotals;
      isSubTotals = totalClass.isSubTotals;
      isTotalRoot = totalClass.isTotalRoot;
      value = i18n((fieldValue as TotalClass).label);
      if (isTotalRoot) {
        nodeQuery = query;
      } else {
        // root[&]四川[&]总计 => {province: '四川'}
        nodeQuery = { ...query, [currentField]: value };
      }
      if (addMeasureInTotalQuery) {
        // root[&]四川[&]总计 => {province: '四川', EXTRA_FIELD: 'price'}
        nodeQuery[EXTRA_FIELD] = spreadsheet?.dataSet?.fields.values[0];
      }
      isLeaf = whetherLeafByLevel({ facetCfg, level, fields });
    } else if (isTotalMeasure) {
      value = i18n((fieldValue as TotalMeasure).label);
      // root[&]四川[&]总计[&]price => {province: '四川',EXTRA_FIELD: 'price' }
      nodeQuery = { ...query, [EXTRA_FIELD]: value };
      adjustedField = EXTRA_FIELD;
      isGrandTotals = parentNode.isGrandTotals;
      isSubTotals = parentNode.isSubTotals;
      isLeaf = whetherLeafByLevel({ facetCfg, level, fields });
    } else if (spreadsheet.isTableMode()) {
      value = fieldValue;
      adjustedField = fields[index];
      nodeQuery = { ...query, [adjustedField]: value };
      isLeaf = true;
    } else {
      value = fieldValue;
      // root[&]四川[&]成都 => {province: '四川', city: '成都' }
      nodeQuery = { ...query, [currentField]: value };
      isLeaf = whetherLeafByLevel({ facetCfg, level, fields });
    }
    const uniqueId = generateId(parentNode.id, value);
    if (!uniqueId) {
      return;
    }
    // TODO need merge with collapsedRows
    const isCollapsed = isBoolean(collapsedCols?.[uniqueId])
      ? collapsedCols?.[uniqueId]
      : false;
    // create new header nodes
    const node = new Node({
      id: uniqueId,
      key: adjustedField,
      value,
      level,
      field: adjustedField,
      parent: parentNode,
      isTotals: isTotals || isTotalMeasure,
      isGrandTotals,
      isSubTotals,
      isTotalMeasure,
      isCollapsed,
      isTotalRoot,
      hierarchy,
      query: nodeQuery,
      spreadsheet,
      isLeaf: isLeaf || isCollapsed,
    });

    const expandCurrentNode = layoutHierarchy(
      facetCfg,
      parentNode,
      node,
      hierarchy,
    );

    // 如果当前是隐藏节点, 给其父节点挂载相应信息 (兄弟节点, 当前哪个子节点隐藏了), 这样在 facet 层可以直接使用, 不用每次都去遍历
    const hiddenColumnsInfo = spreadsheet?.facet?.getHiddenColumnsInfo(node);
    if (hiddenColumnsInfo && parentNode) {
      // hiddenChildNodeInfo 属性在 S2 中没有用到，但是没删怕外部有使用，已标记为废弃
      parentNode.hiddenChildNodeInfo = hiddenColumnsInfo;
    }

    // omit the the whole column or row of the grandTotal or subTotals
    if (
      level > hierarchy.maxLevel &&
      !isGrandTotals &&
      !parentNode.isGrandTotals &&
      !parentNode.isSubTotals &&
      !node.isSubTotals
    ) {
      hierarchy.sampleNodesForAllLevels.push(node);
      hierarchy.maxLevel = level;
      // 如果当前是隐藏节点, 则采样其兄弟节点
      hierarchy.sampleNodeForLastLevel = hiddenColumnsInfo
        ? hiddenColumnsInfo?.displaySiblingNode?.next ||
          hiddenColumnsInfo?.displaySiblingNode?.prev
        : node;
    }

    const isLeafNode = isLeaf || isCollapsed || !expandCurrentNode;
    if (isLeafNode) {
      node.isLeaf = true;
      hierarchy.pushIndexNode(node);
      node.rowIndex = hierarchy.getIndexNodes().length - 1;
    } else {
      buildGridHierarchy({
        addTotalMeasureInTotal,
        addMeasureInTotalQuery,
        parentNode: node,
        currentField: fields[level + 1],
        fields,
        facetCfg,
        hierarchy,
      });
    }
  }
};

/**
 * 给定一个树形结构的表头，深度优先创建表头的 node
 * @param columns
 * @param params
 * @param pNode
 * @param level
 */
export const DFSGenerateHeaderNodes = (
  columns: Columns,
  params: TableHeaderParams,
  level: number,
  pNode?: Node,
) => {
  const { facetCfg, hierarchy, parentNode } = params;
  const { dataSet } = facetCfg;

  columns.forEach((column, i) => {
    if (typeof column === 'string') {
      column = { key: column };
    }
    const { key } = column;
    const value =
      key === SERIES_NUMBER_FIELD ? i18n('序号') : dataSet.getFieldName(key);
    const currentParent = pNode || parentNode;
    generateHeaderNodes({
      currentField: key,
      fields: [key],
      fieldValues: [value],
      facetCfg,
      hierarchy,
      parentNode: currentParent,
      level,
      query: {},
      addMeasureInTotalQuery: false,
      addTotalMeasureInTotal: false,
    });
    if (column.children && column.children.length) {
      const generateNode = currentParent.children[i];
      generateNode.isLeaf = false;
      DFSGenerateHeaderNodes(column.children, params, level + 1, generateNode);
    }
  });
};
