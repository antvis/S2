import {
  BuildHeaderParams,
  BuildHeaderResult,
  FileValue,
  GridHeaderParams, HeaderNodesParams,
  TotalParams, TreeHeaderParams
} from "src/facet/layout/interface";
import { Hierarchy } from "src/facet/layout/hierarchy";
import { Node } from "src/facet/layout/node";
import getDimsCondition from "src/facet/layout/util/get-dims-condition-by-node";
import { TotalClass } from "src/facet/layout/total-class";
import { TotalMeasure } from "src/facet/layout/total-measure";
import * as _ from "lodash";
import { EXTRA_FIELD } from "src/common/constant";
import { i18n } from "src/common/i18n";
import { generateId } from "src/facet/layout/util/generate-id";
import { DebuggerUtil } from "src/common/debug";
import { layoutArrange, layoutHierarchy } from "src/facet/layout/layout-hooks";

export const addTotals = (params: TotalParams) => {
  const { isFirstField, currentField, fieldValues, spreadsheet, lastField } = params;
  const totalsConfig = spreadsheet.getTotalsConfig(isFirstField ? currentField : lastField);
  let func: "unshift" | "push";
  let value;
  if (isFirstField) {
    // check to see if grand total is added
    if (totalsConfig.showGrandTotals) {
      func = totalsConfig.reverseLayout
        ? "unshift"
        : "push";
      value = new TotalClass(totalsConfig.label, false);
    }
  } else {
    // check to see if sub totals is added
    if (totalsConfig.showSubTotals
    && _.size(fieldValues) > 1
    && currentField !== EXTRA_FIELD) {
      func = totalsConfig.reverseSubLayout
        ? "unshift"
        : "push";
      value = new TotalClass(totalsConfig.subLabel, true);
    }
  }
  fieldValues[func]?.(value);
};

export const generateHeaderNodes = (params: HeaderNodesParams) => {
  const { currentField, fields, fieldValues, facetCfg, hierarchy, parentNode, level, query, addMeasureInTotalQuery, addTotalMeasureInTotal } = params;
  const { spreadsheet, collapsedCols } = facetCfg;
  for (const fieldValue of fieldValues) {
    const isTotals = fieldValue instanceof TotalClass;
    const isTotalMeasure = fieldValue instanceof TotalMeasure;
    let value;
    let nodeQuery;
    let isLeaf = false;
    if (isTotals) {
      value = i18n((fieldValue as TotalClass).label);
      if (addMeasureInTotalQuery) {
        // root[&]四川[&]总计 => {province: '四川', EXTRA_FIELD: 'price'}
        nodeQuery = _.merge({}, query, { [EXTRA_FIELD]: spreadsheet?.dataSet?.fields.values[0] });
        isLeaf = true;
      } else {
        // root[&]四川[&]总计 => {province: '四川'}
        nodeQuery = query;
        if (!addTotalMeasureInTotal) {
          isLeaf = true;
        }
      }
    } else if (isTotalMeasure) {
      value = i18n((fieldValue as TotalMeasure).label);
      // root[&]四川[&]总计[&]price => {province: '四川',EXTRA_FIELD: 'price' }
      nodeQuery = _.merge({}, query, { [EXTRA_FIELD]: value });
      isLeaf = true;
    } else {
      value = fieldValue;
      // root[&]四川[&]成都 => {province: '四川', city: '成都' }
      nodeQuery = _.merge({}, query, { [currentField]: value });
      isLeaf = level === fields.length - 1;
    }
    const uniqueId = generateId(parentNode.id, value, facetCfg);
    // TODO need merge with collapsedRows
    const isCollapsed = _.isBoolean(collapsedCols[uniqueId]) ? collapsedCols[uniqueId] : false;

    DebuggerUtil.getInstance().logger('++++', value, nodeQuery);
    // create new header nodes
    const node = new Node({
      id: uniqueId,
      key: currentField,
      value,
      level,
      field: currentField,
      parent: parentNode,
      isTotals,
      isTotalMeasure,
      isCollapsed,
      hierarchy,
      query: nodeQuery,
      spreadsheet,
    });

    layoutHierarchy(facetCfg, parentNode, node, hierarchy);

    // TODO find another way?
    if (level > hierarchy.maxLevel) {
      hierarchy.sampleNodesForAllLevels.push(node);
      hierarchy.sampleNodeForLastLevel = node;
      hierarchy.maxLevel = level;
    }

    const isLeafNode = isLeaf || isCollapsed;
    if (isLeafNode) {
      node.isLeaf = true;
      hierarchy.pushIndexNode(node);
      // TODO use for what ?
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
      })
    }
  }
}

export const buildGridHierarchy = (params: GridHeaderParams) => {
  const { addTotalMeasureInTotal, addMeasureInTotalQuery, parentNode, currentField, fields, facetCfg, hierarchy } = params;
  const index = fields.indexOf(currentField);
  const { dataSet, values, spreadsheet } = facetCfg;
  const fieldValues = [] as FileValue[];
  let query = {};
  if (parentNode.isTotals) {
    // add total measures
    if (addTotalMeasureInTotal) {
      query = getDimsCondition(parentNode.parent, true);
      // add total measures
      fieldValues.push(...values.map(v => new TotalMeasure(v)));
    }
  } else {
    // field(dimension)'s all values
    query = getDimsCondition(parentNode, true);
    const dimValues = dataSet.getDimensionValues(currentField, query);
    const arrangedValues = layoutArrange(dimValues, spreadsheet, parentNode, currentField);
    fieldValues.push(...arrangedValues);
    // add totals if needed
    addTotals({
      currentField,
      lastField: fields[index - 1],
      isFirstField: index === 0,
      fieldValues,
      spreadsheet
    })
  }
  generateHeaderNodes({
    currentField,
    fields,
    fieldValues,
    facetCfg,
    hierarchy,
    parentNode,
    level: index,
    query,
    addMeasureInTotalQuery,
    addTotalMeasureInTotal
  })
};

/**
 * Only row header has tree hierarchy, in this scene:
 * 1、value in rows is not work => valueInCols is ineffective
 * 2、can't add extra sub total node in row
 * @param params
 */
export const buildTreeHierarchy = (params: TreeHeaderParams) => {
  const { parentNode, currentField, fields, facetCfg, hierarchy } = params;
  const { dataSet , spreadsheet, collapsedRows, hierarchyCollapse, values  } = facetCfg;
  const index = fields.indexOf(currentField);
  const query = getDimsCondition(parentNode, true);
  let fieldValues: FileValue[];
  const dimValues = dataSet.getDimensionValues(currentField, query);
  fieldValues = layoutArrange(dimValues, spreadsheet, parentNode, currentField);
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
    let isCollapse = _.isBoolean(collapsedRows[uniqueId]) ? collapsedRows[uniqueId] : hierarchyCollapse;
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
      buildTreeHierarchy({
        currentField: fields[index + 1],
        fields,
        facetCfg,
        parentNode: node,
        hierarchy
      });
    }
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
export const buildHeaderHierarchy = (params: BuildHeaderParams): BuildHeaderResult => {
  const { isRowHeader, facetCfg } = params;
  const { rows, cols, values, spreadsheet } = facetCfg;
  const isValueInCols = spreadsheet.dataCfg.fields.valueInCols;
  const isPivotMode = spreadsheet.isPivotMode();
  const moreThanOneValue = values.length > 1;
  const rootNode = Node.rootNode();
  const hierarchy = new Hierarchy();
  // TODO use for?
  hierarchy.rows = rows;
  if (isRowHeader) {
    if (isPivotMode) {
      if (spreadsheet.isHierarchyTreeType()) {
        // row tree hierarchy(value must stay in colHeader)
        buildTreeHierarchy({
          currentField: rows[0],
          fields: rows,
          facetCfg,
          parentNode: rootNode,
          hierarchy
        });
        return {
          hierarchy,
          leafNodes: hierarchy.getNodes()
        } as BuildHeaderResult
      } else {
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
      }
    } else {
      // TODO table mode -> row
    }
  } else {
    if (isPivotMode) {
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
      // TODO table mode -> col
    }
  }
  return {
    hierarchy,
    leafNodes: hierarchy.getLeaves()
  } as BuildHeaderResult
};
