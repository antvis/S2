import { HeaderNodesParams } from '@/facet/layout/interface';
import { TotalClass } from '@/facet/layout/total-class';
import { TotalMeasure } from '@/facet/layout/total-measure';
import { i18n } from '@/common/i18n';
import _ from 'lodash';
import { EXTRA_FIELD } from '@/common/constant';
import { generateId } from '@/facet/layout/util/generate-id';
import { Node } from '@/facet/layout/node';
import { layoutHierarchy } from '@/facet/layout/layout-hooks';
import { buildGridHierarchy } from '@/facet/layout/build-gird-hierarchy';

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
  const { spreadsheet, collapsedCols, colCfg } = facetCfg;
  const hideMeasure = colCfg.hideMeasureColumn ?? false;

  for (const [index, fieldValue] of fieldValues.entries()) {
    const isTotals = fieldValue instanceof TotalClass;
    const isTotalMeasure = fieldValue instanceof TotalMeasure;
    let value;
    let nodeQuery;
    let isLeaf = false;
    let adjustedField = currentField;
    if (isTotals) {
      value = i18n((fieldValue as TotalClass).label);
      if (addMeasureInTotalQuery) {
        // root[&]四川[&]总计 => {province: '四川', EXTRA_FIELD: 'price'}
        nodeQuery = _.merge({}, query, {
          [EXTRA_FIELD]: spreadsheet?.dataSet?.fields.values[0],
        });
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
      adjustedField = EXTRA_FIELD;
      isLeaf = true;
    } else if (spreadsheet.isTableMode()) {
      value = fieldValue;
      adjustedField = fields[index];
      nodeQuery = _.merge({}, query, { [adjustedField]: value });
      isLeaf = true;
    } else {
      value = fieldValue;
      // root[&]四川[&]成都 => {province: '四川', city: '成都' }
      nodeQuery = _.merge({}, query, { [currentField]: value });
      const extraSize = hideMeasure ? 2 : 1;
      isLeaf = level === fields.length - extraSize;
    }
    const uniqueId = generateId(parentNode.id, value, facetCfg);
    // TODO need merge with collapsedRows
    const isCollapsed = _.isBoolean(collapsedCols[uniqueId])
      ? collapsedCols[uniqueId]
      : false;
    // create new header nodes
    const node = new Node({
      id: uniqueId,
      key: adjustedField,
      value,
      level,
      field: adjustedField,
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
      });
    }
  }
};
