import { includes, isBoolean } from 'lodash';
import { HeaderNodesParams } from '@/facet/layout/interface';
import { TotalClass } from '@/facet/layout/total-class';
import { TotalMeasure } from '@/facet/layout/total-measure';
import { i18n } from '@/common/i18n';
import { EXTRA_FIELD } from '@/common/constant';
import { generateId } from '@/utils/layout/generate-id';
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

  for (const [index, fieldValue] of fieldValues.entries()) {
    const isTotals = fieldValue instanceof TotalClass;
    const isTotalMeasure = fieldValue instanceof TotalMeasure;
    let value: string;
    let nodeQuery;
    let isLeaf = false;
    let isGrandTotals = false;
    let isSubTotals = false;
    let adjustedField = currentField;
    if (isTotals) {
      const totalClass = fieldValue as TotalClass;
      isGrandTotals = totalClass.isGrandTotals;
      isSubTotals = totalClass.isSubTotals;
      value = i18n((fieldValue as TotalClass).label);
      if (addMeasureInTotalQuery) {
        // root[&]四川[&]总计 => {province: '四川', EXTRA_FIELD: 'price'}
        nodeQuery = {
          ...query,
          [EXTRA_FIELD]: spreadsheet?.dataSet?.fields.values[0],
        };
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
      nodeQuery = { ...query, [EXTRA_FIELD]: value };
      adjustedField = EXTRA_FIELD;
      isLeaf = true;
    } else if (spreadsheet.isTableMode()) {
      value = fieldValue;
      adjustedField = fields[index];
      nodeQuery = { ...query, [adjustedField]: value };
      isLeaf = true;
    } else {
      value = fieldValue;
      // root[&]四川[&]成都 => {province: '四川', city: '成都' }
      nodeQuery = { ...query, [currentField]: value };
      const isValueInCols = spreadsheet.dataCfg.fields?.valueInCols ?? true;
      const isHideMeasure =
        colCfg?.hideMeasureColumn &&
        isValueInCols &&
        includes(fields, EXTRA_FIELD);
      const extraSize = isHideMeasure ? 2 : 1;
      isLeaf = level === fields.length - extraSize;
    }
    const uniqueId = generateId(parentNode.id, value);
    if (!uniqueId) return;
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
      isTotals,
      isGrandTotals,
      isSubTotals,
      isTotalMeasure,
      isCollapsed,
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

    // omit the the whole column or row of the grandTotal or subTotals
    if (
      level > hierarchy.maxLevel &&
      !isGrandTotals &&
      !parentNode.isGrandTotals &&
      !parentNode.isSubTotals &&
      !node.isSubTotals
    ) {
      hierarchy.sampleNodesForAllLevels.push(node);
      hierarchy.sampleNodeForLastLevel = node;
      hierarchy.maxLevel = level;
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
