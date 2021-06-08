import { FileValue, GridHeaderParams } from '@/facet/layout/interface';
import { TotalMeasure } from '@/facet/layout/total-measure';
import { layoutArrange } from '@/facet/layout/layout-hooks';
import getDimsCondition from '@/facet/layout/util/get-dims-condition-by-node';
import { addTotals } from '@/facet/layout/util/add-totals';
import { generateHeaderNodes } from '@/facet/layout/util/generate-row-nodes';

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
  const fieldValues = [] as FileValue[];
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
      spreadsheet,
      parentNode,
      currentField,
    );
    fieldValues.push(...arrangedValues);
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
