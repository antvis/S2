import { isEmpty } from 'lodash';
import { EMPTY_FIELD_VALUE, EXTRA_FIELD } from '../../common/constant';
import { addTotals } from '../../utils/layout/add-totals';
import { generateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import { getDimsCondition } from '../../utils/layout/get-dims-condition-by-node';
import { whetherLeafByLevel } from '../../utils/layout/whether-leaf-by-level';
import type { FieldValue, GridHeaderParams } from '../layout/interface';
import { layoutArrange } from '../layout/layout-hooks';
import { TotalMeasure } from '../layout/total-measure';
import { filterOutDetail } from '../../utils/data-set-operate';
import { TotalClass } from './total-class';

const buildTotalGridHierarchy = (params: GridHeaderParams) => {
  const {
    addTotalMeasureInTotal,
    parentNode,
    currentField,
    fields,
    hierarchy,
    spreadsheet,
  } = params;

  const index = fields.indexOf(currentField);
  const dataSet = spreadsheet.dataSet;
  const { values = [] } = dataSet.fields;
  const fieldValues: FieldValue[] = [];

  let query: Record<string, unknown> = {};
  const totalsConfig = spreadsheet.getTotalsConfig(currentField);
  const dimensionGroup = parentNode.isGrandTotals
    ? totalsConfig.grandTotalsGroupDimensions
    : totalsConfig.subTotalsGroupDimensions;

  if (dimensionGroup?.includes(currentField)) {
    query = getDimsCondition(parentNode);
    const dimValues = dataSet.getDimensionValues(currentField, query);

    fieldValues.push(
      ...(dimValues || []).map(
        (value) =>
          new TotalClass({
            label: value,
            isSubTotals: parentNode.isSubTotals!,
            isGrandTotals: parentNode.isGrandTotals!,
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
  } else if (whetherLeafByLevel({ spreadsheet, level: index, fields })) {
    // 如果最后一级没有分组维度，则将上一个结点设为叶子节点
    parentNode.isLeaf = true;
    hierarchy.pushIndexNode(parentNode);
    parentNode.rowIndex = hierarchy.getIndexNodes().length - 1;

    return;
  } else {
    // 如果是空维度，则跳转到下一级 level
    buildTotalGridHierarchy({ ...params, currentField: fields[index + 1] });

    return;
  }

  const displayFieldValues = filterOutDetail(fieldValues as string[]);

  generateHeaderNodes({
    ...params,
    fieldValues: displayFieldValues,
    level: index,
    parentNode,
    query,
  });
};

const buildNormalGridHierarchy = (params: GridHeaderParams) => {
  const { parentNode, currentField, fields, spreadsheet } = params;
  const dataSet = spreadsheet.dataSet;
  const { values = [] } = dataSet.fields;

  const index = fields.indexOf(currentField);

  const fieldValues: FieldValue[] = [];

  let query: Record<string, unknown> = {};

  // field(dimension)'s all values
  query = getDimsCondition(parentNode, true);

  const dimValues = dataSet.getDimensionValues(currentField, query);

  const arrangedValues = layoutArrange(
    spreadsheet,
    dimValues,
    parentNode,
    currentField,
  );

  fieldValues.push(...(arrangedValues || []));

  // add skeleton for empty data

  if (isEmpty(fieldValues) && currentField) {
    if (currentField === EXTRA_FIELD) {
      fieldValues.push(...values);
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

  const displayFieldValues = filterOutDetail(fieldValues as string[]);

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
