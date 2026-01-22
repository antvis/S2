import { isEmpty } from 'lodash';
import { EMPTY_FIELD_VALUE, EXTRA_FIELD } from '../../common/constant';
import { filterOutDetail } from '../../utils/data-set-operate';
import { addTotals } from '../../utils/layout/add-totals';
import { generateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import { getDimsCondition } from '../../utils/layout/get-dims-condition-by-node';
import { whetherLeafByLevel } from '../../utils/layout/whether-leaf-by-level';
import type { FieldValue, GridHeaderParams } from '../layout/interface';
import { layoutArrange } from '../layout/layout-hooks';
import { TotalMeasure } from '../layout/total-measure';
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
  const defaultDimensionGroup = parentNode.isGrandTotals
    ? totalsConfig.grandTotalsGroupDimensions || []
    : totalsConfig.subTotalsGroupDimensions || [];
  const dimensionGroup = !dataSet.isEmpty() ? defaultDimensionGroup : [];

  if (dimensionGroup?.includes(currentField)) {
    query = getDimsCondition(parentNode);
    const dimValues = dataSet.getDimensionValues(currentField, query);

    fieldValues.push(
      ...(dimValues || []).map(
        (value) =>
          new TotalClass({
            label: value as string,
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
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handler: buildGridHierarchy,
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
    dimValues as FieldValue[],
    parentNode,
    currentField,
  );

  fieldValues.push(...((arrangedValues as FieldValue[]) || []));

  // add skeleton for empty data
  if (isEmpty(fieldValues) && currentField) {
    if (currentField === EXTRA_FIELD) {
      fieldValues.push(...values);
    } else {
      fieldValues.push(EMPTY_FIELD_VALUE);
    }
  }

  // 找到第一个维度字段的索引（排除 EXTRA_FIELD）
  // 当 customValueOrder=0 时，EXTRA_FIELD 在位置 0，此时第一个维度字段的索引为 1
  const firstDimensionFieldIndex = fields.findIndex(
    (field) => field !== EXTRA_FIELD,
  );
  // 判断当前字段是否为第一个维度字段
  // 当 firstDimensionFieldIndex === -1 时（即所有字段都是 EXTRA_FIELD），回退到原有逻辑
  // 但由于 addTotals 中也会检查 currentField !== EXTRA_FIELD，所以不会错误添加总计
  const isFirstDimensionField =
    index === firstDimensionFieldIndex ||
    (index === 0 && firstDimensionFieldIndex === -1);

  addTotals({
    currentField,
    lastField: fields[index - 1],
    isFirstField: isFirstDimensionField,
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
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handler: buildGridHierarchy,
  });
};

/**
 * Build grid hierarchy in rows or columns
 */
export function buildGridHierarchy(params: GridHeaderParams) {
  if (params.parentNode.isTotals) {
    buildTotalGridHierarchy(params);
  } else {
    buildNormalGridHierarchy(params);
  }
}
