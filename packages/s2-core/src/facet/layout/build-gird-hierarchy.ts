import { isEmpty, isUndefined } from 'lodash';
import { EXTRA_FIELD } from '../../common/constant';
import type { SpreadSheetFacetCfg } from '../../common/interface';
import { addTotals } from '../../utils/layout/add-totals';
import { generateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import { getDimsCondition } from '../../utils/layout/get-dims-condition-by-node';
import type { FieldValue, GridHeaderParams } from '../layout/interface';
import { layoutArrange } from '../layout/layout-hooks';
import { TotalMeasure } from '../layout/total-measure';
import { whetherLeafByLevel } from '../../utils/layout/whether-leaf-by-level';
import { TotalClass } from './total-class';

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
  const fieldName = dataSet.getFieldName(currentField);

  let query = {};
  if (parentNode.isTotals) {
    const totalsConfig = spreadsheet.getTotalsConfig(currentField);
    const dimensionGroup = parentNode.isGrandTotals
      ? totalsConfig.totalsDimensionsGroup
      : totalsConfig.subTotalsDimensionsGroup;
    if (dimensionGroup?.includes(currentField)) {
      query = getDimsCondition(parentNode);
      const dimValues = dataSet.getTotalDimensionValues(currentField, query);
      fieldValues.push(
        ...(dimValues || []).map(
          (v) =>
            new TotalClass(
              v,
              parentNode.isSubTotals,
              parentNode.isGrandTotals,
              false,
            ),
        ),
      );
      if (isEmpty(fieldValues)) {
        fieldValues.push(fieldName);
      }
    } else if (addTotalMeasureInTotal && currentField === EXTRA_FIELD) {
      // add total measures
      query = getDimsCondition(parentNode);
      fieldValues.push(...values.map((v) => new TotalMeasure(v)));
    } else {
      if (whetherLeafByLevel({ facetCfg, level: index, fields })) {
        // 如果最后一级没有分组维度，则将上一个结点设为叶子结点
        parentNode.isLeaf = true;
        hierarchy.pushIndexNode(parentNode);
        parentNode.rowIndex = hierarchy.getIndexNodes().length - 1;
      } else {
        // 如果是空维度，则跳转到下一级 level
        buildGridHierarchy({
          addTotalMeasureInTotal,
          addMeasureInTotalQuery,
          parentNode,
          currentField: fields[index + 1],
          fields,
          facetCfg,
          hierarchy,
        });
      }
      return;
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
