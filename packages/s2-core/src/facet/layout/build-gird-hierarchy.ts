import { isEmpty, isUndefined } from 'lodash';
<<<<<<< HEAD
import { EXTRA_FIELD } from '../../common/constant';
import type { SpreadSheet } from '../../sheet-type';
=======
import { EMPTY_FIELD_VALUE, EXTRA_FIELD } from '../../common/constant';
>>>>>>> origin/master
import { addTotals } from '../../utils/layout/add-totals';
import { generateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import { getDimsCondition } from '../../utils/layout/get-dims-condition-by-node';
import { whetherLeafByLevel } from '../../utils/layout/whether-leaf-by-level';
import type { FieldValue, GridHeaderParams } from '../layout/interface';
import { layoutArrange } from '../layout/layout-hooks';
import { TotalMeasure } from '../layout/total-measure';
import { TotalClass } from './total-class';

<<<<<<< HEAD
const hideValueColumn = (
  spreadsheet: SpreadSheet,
  fieldValues: FieldValue[],
  field: string,
) => {
  const hideMeasure = spreadsheet.options.style?.colCell?.hideValue ?? false;
  const { valueInCols } = spreadsheet.dataSet.fields;

  for (const value of fieldValues) {
    if (hideMeasure && valueInCols && field === EXTRA_FIELD) {
      fieldValues.splice(fieldValues.indexOf(value), 1);
    }
  }
};

/**
 * Build grid hierarchy in rows or columns
 *
 * @param params
 */
export const buildGridHierarchy = (params: GridHeaderParams) => {
=======
const buildTotalGridHierarchy = (params: GridHeaderParams) => {
>>>>>>> origin/master
  const {
    addTotalMeasureInTotal,
    parentNode,
    currentField,
    fields,
    hierarchy,
    spreadsheet,
  } = params;

  const index = fields.indexOf(currentField);

  const { values = [] } = spreadsheet.dataSet.fields;
  const fieldValues: FieldValue[] = [];

<<<<<<< HEAD
  let query: Record<string, string> = {};

  if (parentNode.isTotals) {
    // add total measures
    if (addTotalMeasureInTotal) {
      query = getDimsCondition(parentNode.parent!, true);
      // add total measures
      fieldValues.push(...values.map((v) => new TotalMeasure(v)));
    }
  } else {
    // field(dimension)'s all values
    query = getDimsCondition(parentNode, true);

    const dimValues = spreadsheet.dataSet.getDimensionValues(
      currentField,
      query,
    );

    const arrangedValues = layoutArrange(
      spreadsheet,
      dimValues,
      parentNode,
      currentField,
    );

    fieldValues.push(...(arrangedValues || []));

    // add skeleton for empty data

    const fieldName = spreadsheet.dataSet.getFieldName(currentField);

    if (isEmpty(fieldValues)) {
      if (currentField === EXTRA_FIELD) {
        fieldValues.push(...(values || []));
      } else {
        fieldValues.push(fieldName);
      }
    }

    // hide value in columns
    hideValueColumn(spreadsheet, fieldValues, currentField);
    // add totals if needed
    addTotals({
      currentField,
      lastField: fields[index - 1],
      isFirstField: index === 0,
      fieldValues,
      spreadsheet,
    });
=======
  let query: Record<string, unknown> = {};
  const totalsConfig = spreadsheet.getTotalsConfig(currentField);
  const dimensionGroup = parentNode.isGrandTotals
    ? totalsConfig.totalsGroupDimensions
    : totalsConfig.subTotalsGroupDimensions;
  if (dimensionGroup?.includes(currentField)) {
    query = getDimsCondition(parentNode);
    const dimValues = dataSet.getDimensionValues(currentField, query);
    fieldValues.push(
      ...(dimValues || []).map(
        (value) =>
          new TotalClass({
            label: value,
            isSubTotals: parentNode.isSubTotals,
            isGrandTotals: parentNode.isGrandTotals,
            isTotalRoot: false,
          }),
      ),
    );
    if (isEmpty(fieldValues) && currentField) {
      fieldValues.push(EMPTY_FIELD_VALUE);
    }
  } else if (addTotalMeasureInTotal && currentField === EXTRA_FIELD) {
    // add total measures
    query = getDimsCondition(parentNode);
    fieldValues.push(...values.map((v) => new TotalMeasure(v)));
  } else if (whetherLeafByLevel({ facetCfg, level: index, fields })) {
    // 如果最后一级没有分组维度，则将上一个结点设为叶子节点
    parentNode.isLeaf = true;
    hierarchy.pushIndexNode(parentNode);
    parentNode.rowIndex = hierarchy.getIndexNodes().length - 1;
    return;
  } else {
    // 如果是空维度，则跳转到下一级 level
    buildTotalGridHierarchy({ ...params, currentField: fields[index + 1] });
    return;
>>>>>>> origin/master
  }

  const displayFieldValues = fieldValues.filter((value) => !isUndefined(value));
  generateHeaderNodes({
<<<<<<< HEAD
    spreadsheet,
    currentField,
    fields,
    fieldValues: displayFieldValues,
    hierarchy,
    parentNode,
=======
    ...params,
    fieldValues: displayFieldValues,
>>>>>>> origin/master
    level: index,
    parentNode,
    query,
  });
};

const buildNormalGridHierarchy = (params: GridHeaderParams) => {
  const { parentNode, currentField, fields, facetCfg } = params;

  const index = fields.indexOf(currentField);

  const { dataSet, spreadsheet } = facetCfg;
  const fieldValues: FieldValue[] = [];

  let query: Record<string, unknown> = {};

  // field(dimension)'s all values
  query = getDimsCondition(parentNode, true);

  const dimValues = dataSet.getDimensionValues(currentField, query);

  const arrangedValues = layoutArrange(
    dimValues,
    facetCfg,
    parentNode,
    currentField,
  );
  fieldValues.push(...(arrangedValues || []));

  // add skeleton for empty data

  if (isEmpty(fieldValues) && currentField) {
    if (currentField === EXTRA_FIELD) {
      fieldValues.push(...dataSet.fields?.values);
    } else {
      fieldValues.push(EMPTY_FIELD_VALUE);
    }
  }

  // add totals if needed
  addTotals({
    currentField,
    lastField: fields[index - 1],
    isFirstField: index === 0,
    fieldValues,
    spreadsheet,
  });

  const displayFieldValues = fieldValues.filter((value) => !isUndefined(value));
  generateHeaderNodes({
    ...params,
    fieldValues: displayFieldValues,
    level: index,
    parentNode,
    query,
  });
};

/**
 * Build grid hierarchy in rows or columns
 *
 * @param params
 */
export const buildGridHierarchy = (params: GridHeaderParams) => {
  if (params.parentNode.isTotals) {
    buildTotalGridHierarchy(params);
  } else {
    buildNormalGridHierarchy(params);
  }
};
