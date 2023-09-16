import { isEmpty, isUndefined } from 'lodash';
import { EXTRA_FIELD } from '../../common/constant';
import { addTotals } from '../../utils/layout/add-totals';
import { generateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import { getDimsCondition } from '../../utils/layout/get-dims-condition-by-node';
import type { FieldValue, GridHeaderParams } from '../layout/interface';
import { layoutArrange } from '../layout/layout-hooks';
import { TotalMeasure } from '../layout/total-measure';
import { whetherLeafByLevel } from '../../utils/layout/whether-leaf-by-level';
import { TotalClass } from './total-class';

const buildTotalGridHierarchy = (params: GridHeaderParams) => {
  const {
    addTotalMeasureInTotal,
    parentNode,
    currentField,
    fields,
    facetCfg,
    hierarchy,
  } = params;

  const index = fields.indexOf(currentField);

  const { dataSet, values, spreadsheet } = facetCfg;
  const fieldValues: FieldValue[] = [];
  const fieldName = dataSet.getFieldName(currentField);

  let query = {};
  const totalsConfig = spreadsheet.getTotalsConfig(currentField);
  const dimensionGroup = parentNode.isGrandTotals
    ? totalsConfig.totalsGroupDimensions
    : totalsConfig.subTotalsGroupDimensions;
  if (dimensionGroup?.includes(currentField)) {
    query = getDimsCondition(parentNode);
    const dimValues = dataSet.getTotalDimensionValues(currentField, query);
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
    if (isEmpty(fieldValues)) {
      fieldValues.push(fieldName);
    }
  } else if (addTotalMeasureInTotal && currentField === EXTRA_FIELD) {
    // add total measures
    query = getDimsCondition(parentNode);
    fieldValues.push(...values.map((v) => new TotalMeasure(v)));
  } else if (whetherLeafByLevel({ facetCfg, level: index, fields })) {
    // 如果最后一级没有分组维度，则将上一个结点设为叶子结点
    parentNode.isLeaf = true;
    hierarchy.pushIndexNode(parentNode);
    parentNode.rowIndex = hierarchy.getIndexNodes().length - 1;
    return;
  } else {
    // 如果是空维度，则跳转到下一级 level
    buildTotalGridHierarchy({ ...params, currentField: fields[index + 1] });
    return;
  }

  const displayFieldValues = fieldValues.filter((value) => !isUndefined(value));
  generateHeaderNodes({
    ...params,
    fieldValues: displayFieldValues,
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
  const fieldName = dataSet.getFieldName(currentField);

  let query = {};

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

  if (isEmpty(fieldValues)) {
    if (currentField === EXTRA_FIELD) {
      fieldValues.push(...dataSet.fields?.values);
    } else {
      fieldValues.push(fieldName);
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
