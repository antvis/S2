import { isEmpty, isUndefined } from 'lodash';
import { EXTRA_FIELD } from '../../common/constant';
import type { SpreadSheet } from '../../sheet-type';
import { addTotals } from '../../utils/layout/add-totals';
import { generateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import { getDimsCondition } from '../../utils/layout/get-dims-condition-by-node';
import type { FieldValue, GridHeaderParams } from '../layout/interface';
import { layoutArrange } from '../layout/layout-hooks';
import { TotalMeasure } from '../layout/total-measure';

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
  const {
    addTotalMeasureInTotal,
    addMeasureInTotalQuery,
    parentNode,
    currentField,
    fields,
    hierarchy,
    spreadsheet,
  } = params;

  const index = fields.indexOf(currentField);

  const { values = [] } = spreadsheet.dataSet.fields;
  const fieldValues: FieldValue[] = [];

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
  }

  const displayFieldValues = fieldValues.filter((value) => !isUndefined(value));

  generateHeaderNodes({
    spreadsheet,
    currentField,
    fields,
    fieldValues: displayFieldValues,
    hierarchy,
    parentNode,
    level: index,
    query,
    addMeasureInTotalQuery,
    addTotalMeasureInTotal,
  });
};
