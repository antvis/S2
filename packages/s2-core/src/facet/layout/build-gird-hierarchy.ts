import { isEmpty, isUndefined } from 'lodash';
import { EXTRA_FIELD } from '../../common/constant';
import type { SpreadSheetFacetCfg } from '../../common/interface';
import { addTotals } from '../../utils/layout/add-totals';
import { generateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import { getDimsCondition } from '../../utils/layout/get-dims-condition-by-node';
import type { FieldValue, GridHeaderParams } from '../layout/interface';
import { layoutArrange } from '../layout/layout-hooks';
import { TotalMeasure } from '../layout/total-measure';

const hideMeasureColumn = (
  fieldValues: FieldValue[],
  field: string,
  cfg: SpreadSheetFacetCfg,
) => {
  const hideMeasure = cfg.colCfg?.hideMeasureColumn ?? false;
  const valueInCol = cfg.dataSet.fields.valueInCols;
  for (const value of fieldValues) {
    if (hideMeasure && valueInCol && field === EXTRA_FIELD) {
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
    facetCfg,
    hierarchy,
  } = params;

  const index = fields.indexOf(currentField);

  const { dataSet, values, spreadsheet } = facetCfg;
  const fieldValues: FieldValue[] = [];

  let query = {};
  if (parentNode.isTotals) {
    // add total measures
    if (addTotalMeasureInTotal) {
      query = getDimsCondition(parentNode.parent, true);
      // add total measures
      fieldValues.push(...values.map((v) => new TotalMeasure(v)));
    }
  } else {
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

    const fieldName = dataSet.getFieldName(currentField);

    if (isEmpty(fieldValues)) {
      if (currentField === EXTRA_FIELD) {
        fieldValues.push(...dataSet.fields?.values);
      } else {
        fieldValues.push(fieldName);
      }
    }
    // hide measure in columns
    hideMeasureColumn(fieldValues, currentField, facetCfg);
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
    currentField,
    fields,
    fieldValues: displayFieldValues,
    facetCfg,
    hierarchy,
    parentNode,
    level: index,
    query,
    addMeasureInTotalQuery,
    addTotalMeasureInTotal,
  });
};
