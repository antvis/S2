import { TotalClass } from 'src/facet/layout/total-class';
import { FieldValue, GridHeaderParams } from '@/facet/layout/interface';
import { TotalMeasure } from '@/facet/layout/total-measure';
import { layoutArrange } from '@/facet/layout/layout-hooks';
import getDimsCondition from '@/facet/layout/util/get-dims-condition-by-node';
import { addTotals } from '@/facet/layout/util/add-totals';
import { generateHeaderNodes } from '@/facet/layout/util/generate-row-nodes';
import { EXTRA_FIELD } from '@/common/constant';
import { SpreadSheetFacetCfg } from '@/common/interface';

const hideMeasureColumn = (
  fieldValues: FieldValue[],
  field: string,
  cfg: SpreadSheetFacetCfg,
) => {
  const hideMeasure = cfg.colCfg.hideMeasureColumn ?? false;
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
  const fieldValues = [] as FieldValue[];
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
    fieldValues.push(...arrangedValues);
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
    addTotalMeasureInTotal,
  });
};
