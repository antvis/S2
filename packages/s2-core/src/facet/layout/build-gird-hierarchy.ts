import { isEmpty, isUndefined } from 'lodash';
import { EXTRA_COLUMN_FIELD, EXTRA_FIELD } from '../../common/constant';
import type { SpreadSheetFacetCfg } from '../../common/interface';
import { addTotals } from '../../utils/layout/add-totals';
import { generateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import { getDimsCondition } from '../../utils/layout/get-dims-condition-by-node';
import type { FieldValue, GridHeaderParams } from '../layout/interface';
import { layoutArrange } from '../layout/layout-hooks';
import { TotalMeasure } from '../layout/total-measure';
import type { SpreadSheet } from '../../sheet-type';

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

const getIsEqualValueLeafNode = (spreadsheet: SpreadSheet) => {
  const leafNodes = spreadsheet.getColumnLeafNodes();
  const values = new Set();
  for (let i = 0; i < leafNodes.length; i++) {
    values.add(leafNodes[i].value);
    if (values.size > 1) {
      return false;
    }
  }
  return values.size === 1;
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

  const hiddenColumnsDetail = spreadsheet.store.get('hiddenColumnsDetail');
  const isEqualValueLeafNode = getIsEqualValueLeafNode(spreadsheet);

  const displayFieldValues = fieldValues.filter((value) => {
    // 去除多余的节点
    if (isUndefined(value)) {
      return false;
    }

    if (isEmpty(hiddenColumnsDetail)) {
      return true;
    }

    return hiddenColumnsDetail.every((detail) => {
      return detail.hideColumnNodes.every((node) => {
        // 1. 有数值字段 (hideMeasureColumn: false) 隐藏父节点
        // 2. 多列头场景(数值挂列头, 隐藏数值列头, 自定义目录多指标等) 叶子节点是数值, 叶子节点的文本内容都一样, 需要额外比较父级节点的id是否相同, 确定到底隐藏哪一列
        // 3. 自定义虚拟指标列 (列头内容未知)
        const isMeasureField = node.field === EXTRA_FIELD;
        const isCustomColumnField = node.field === EXTRA_COLUMN_FIELD;
        if (isMeasureField || isCustomColumnField || isEqualValueLeafNode) {
          return (
            node.parent.id !== parentNode.id && node.parent.value !== value
          );
        }
        // 没有数值字段 (hideMeasureColumn: true) 隐藏自己即可
        return node.value !== value;
      });
    });
  });

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
