import { isEmpty, isUndefined, uniqWith } from 'lodash';
import { FieldValue, GridHeaderParams } from '@/facet/layout/interface';
import { TotalMeasure } from '@/facet/layout/total-measure';
import { layoutArrange } from '@/facet/layout/layout-hooks';
import { getDimsCondition } from '@/utils/layout/get-dims-condition-by-node';
import { addTotals } from '@/utils/layout/add-totals';
import { generateHeaderNodes } from '@/utils/layout/generate-header-nodes';
import { EXTRA_FIELD } from '@/common/constant';
import { SpreadSheetFacetCfg } from '@/common/interface';

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

  const hiddenColumnsDetail = spreadsheet.store.get('hiddenColumnsDetail');
  const isEqualValueLeafNode =
    uniqWith(spreadsheet.getColumnLeafNodes(), (prev, next) => {
      return prev.value === next.value;
    }).length === 1;

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
        // 有数值字段 (hideMeasureColumn: true) 隐藏父节点
        // 多列头场景(数值挂列头, 为隐藏数值列头, 自定义目录多指标等) 叶子节点是数值, 叶子节点的文本内容都一样, 需要额外比较父级节点的id是否相同, 确定到底渲染哪一列
        const isMeasureField = node.field === EXTRA_FIELD;
        if (isMeasureField || isEqualValueLeafNode) {
          return (
            node.parent.id !== parentNode.id && node.parent.value !== value
          );
        }
        // 没有数值字段 (hideMeasureColumn: false) 隐藏自己即可
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
