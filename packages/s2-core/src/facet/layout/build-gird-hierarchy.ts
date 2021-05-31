import { FileValue, GridHeaderParams, HeaderNodesParams, TotalParams } from "src/facet/layout/interface";
import { TotalClass } from "src/facet/layout/total-class";
import { EXTRA_FIELD } from "src/common/constant";
import { TotalMeasure } from "src/facet/layout/total-measure";
import { i18n } from "src/common/i18n";
import { generateId } from "src/facet/layout/util/generate-id";
import { Node } from "src/facet/layout/node";
import * as _ from "lodash";
import { layoutArrange, layoutHierarchy } from "src/facet/layout/layout-hooks";
import getDimsCondition from "src/facet/layout/util/get-dims-condition-by-node";

const addTotals = (params: TotalParams) => {
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

const generateHeaderNodes = (params: HeaderNodesParams) => {
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

/**
 * Build grid hierarchy in rows or columns
 *
 * @param params
 */
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
