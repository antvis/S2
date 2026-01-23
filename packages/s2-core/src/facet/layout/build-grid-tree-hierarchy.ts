import { isEmpty, isNumber } from 'lodash';
import { EMPTY_FIELD_VALUE, EXTRA_FIELD } from '../../common/constant';
import { i18n } from '../../common/i18n';
import { filterOutDetail } from '../../utils/data-set-operate';
import { addTotals } from '../../utils/layout/add-totals';
import { generateId, resolveNillString } from '../../utils/layout/generate-id';
import { getDimsCondition } from '../../utils/layout/get-dims-condition-by-node';
import { whetherLeafByLevel } from '../../utils/layout/whether-leaf-by-level';
import type {
  FieldValue,
  GridHeaderParams,
  HeaderNodesParams,
} from '../layout/interface';
import { layoutArrange, layoutHierarchy } from '../layout/layout-hooks';
import { Node } from '../layout/node';
import { TotalClass } from '../layout/total-class';
import { TotalMeasure } from '../layout/total-measure';

/**
 * 计算节点是否折叠
 * 注意：真正的叶子节点（没有子节点）不应该有折叠状态
 */
const calculateCollapsedState = (options: {
  spreadsheet: HeaderNodesParams['spreadsheet'];
  nodeId: string;
  currentField: string;
  level: number;
  isTotals: boolean;
  isTotalMeasure: boolean;
  isLeaf: boolean;
}): boolean => {
  const {
    spreadsheet,
    nodeId,
    currentField,
    level,
    isTotals,
    isTotalMeasure,
    isLeaf,
  } = options;

  // 真正的叶子节点没有子节点，不应有折叠状态
  if (isLeaf) {
    return false;
  }

  const { collapseFields, collapseAll, expandDepth } =
    spreadsheet.options.style?.rowCell ?? {};

  const isDefaultCollapsed =
    collapseFields?.[nodeId] ?? collapseFields?.[currentField];
  const isLevelCollapsed = isNumber(expandDepth) ? level >= expandDepth : null;

  return isTotals || isTotalMeasure
    ? false
    : isDefaultCollapsed ?? isLevelCollapsed ?? collapseAll ?? false;
};

/**
 * 处理字段值，返回节点的值、查询条件和各种标志
 */
const processFieldValue = (options: {
  fieldValue: FieldValue;
  currentField: string;
  query: Record<string, unknown>;
  parentNode: HeaderNodesParams['parentNode'];
  spreadsheet: HeaderNodesParams['spreadsheet'];
  level: number;
  fields: string[];
  addMeasureInTotalQuery: boolean | undefined;
}) => {
  const {
    fieldValue,
    currentField,
    query,
    parentNode,
    spreadsheet,
    level,
    fields,
    addMeasureInTotalQuery,
  } = options;

  const isTotals = TotalClass.isTotalClassInstance(fieldValue);
  const isTotalMeasure = TotalMeasure.isTotalMeasureInstance(fieldValue);

  let value: string;
  let nodeQuery: Record<string, unknown>;
  let isLeaf = false;
  let isGrandTotals = false;
  let isSubTotals = false;
  let isTotalRoot = false;

  if (isTotals) {
    isGrandTotals = fieldValue.isGrandTotals;
    isSubTotals = fieldValue.isSubTotals;
    isTotalRoot = fieldValue.isTotalRoot;
    value = i18n(fieldValue.label);
    nodeQuery = isTotalRoot
      ? { ...query }
      : { ...query, [currentField]: value };
    if (addMeasureInTotalQuery) {
      nodeQuery[EXTRA_FIELD] = spreadsheet?.dataSet?.fields.values![0];
    }

    isLeaf = whetherLeafByLevel({ spreadsheet, level, fields });
  } else if (isTotalMeasure) {
    value = i18n(fieldValue.label);
    nodeQuery = { ...query, [EXTRA_FIELD]: value };
    isGrandTotals = parentNode.isGrandTotals!;
    isSubTotals = parentNode.isSubTotals!;
    isLeaf = whetherLeafByLevel({ spreadsheet, level, fields });
  } else {
    value = fieldValue;
    nodeQuery =
      value === EMPTY_FIELD_VALUE
        ? { ...query }
        : { ...query, [currentField]: value };
    isLeaf = whetherLeafByLevel({ spreadsheet, level, fields });
  }

  return {
    value,
    nodeQuery,
    isLeaf,
    isGrandTotals,
    isSubTotals,
    isTotalRoot,
    isTotals,
    isTotalMeasure,
  };
};

/**
 * 生成 grid-tree 模式的行头节点
 * 与 generateHeaderNodes 类似，但支持折叠状态
 */
const generateGridTreeHeaderNodes = (params: HeaderNodesParams) => {
  const {
    currentField,
    fields,
    fieldValues,
    hierarchy,
    parentNode,
    level,
    query,
    addMeasureInTotalQuery,
    addTotalMeasureInTotal,
    spreadsheet,
    handler,
  } = params;

  for (const originalFieldValue of fieldValues) {
    const fieldValue = resolveNillString(
      originalFieldValue as string,
    ) as FieldValue;
    const adjustedField = currentField;

    const processed = processFieldValue({
      fieldValue,
      currentField,
      query,
      parentNode,
      spreadsheet,
      level,
      fields,
      addMeasureInTotalQuery,
    });

    const nodeId = generateId(parentNode.id, processed.value);

    if (nodeId) {
      const isCollapsed = calculateCollapsedState({
        spreadsheet,
        nodeId,
        currentField,
        level,
        isTotals: processed.isTotals,
        isTotalMeasure: processed.isTotalMeasure,
        isLeaf: processed.isLeaf,
      });

      const node = new Node({
        id: nodeId,
        value: processed.value,
        level,
        field: adjustedField,
        parent: parentNode,
        isTotals: processed.isTotals || processed.isTotalMeasure,
        isGrandTotals: processed.isGrandTotals,
        isSubTotals: processed.isSubTotals,
        isTotalMeasure: processed.isTotalMeasure,
        isCollapsed,
        isTotalRoot: processed.isTotalRoot,
        hierarchy,
        query: processed.nodeQuery,
        spreadsheet,
        isLeaf: processed.isLeaf || isCollapsed,
      });

      const expandCurrentNode = layoutHierarchy(
        spreadsheet,
        parentNode,
        node,
        hierarchy,
      );
      const hiddenColumnsInfo = spreadsheet?.facet?.getHiddenColumnsInfo(node);

      if (
        level > hierarchy.maxLevel &&
        !processed.isGrandTotals &&
        !parentNode.isGrandTotals &&
        !parentNode.isSubTotals &&
        !node.isSubTotals &&
        !hiddenColumnsInfo
      ) {
        hierarchy.sampleNodesForAllLevels.push(node);
        hierarchy.maxLevel = level;
        hierarchy.sampleNodeForLastLevel = node;
      }

      // grid-tree 模式下，折叠的节点也是叶子节点
      const isLeafNode = processed.isLeaf || isCollapsed || !expandCurrentNode;

      if (isLeafNode) {
        node.isLeaf = true;
        hierarchy.pushIndexNode(node);
        node.rowIndex = hierarchy.getIndexNodes().length - 1;
      } else {
        handler?.({
          addTotalMeasureInTotal,
          addMeasureInTotalQuery,
          parentNode: node,
          currentField: fields[level + 1],
          fields,
          hierarchy,
          spreadsheet,
        } as HeaderNodesParams);
      }
    }
  }
};

const buildNormalGridTreeHierarchy = (params: GridHeaderParams) => {
  const { parentNode, currentField, fields, spreadsheet } = params;
  const dataSet = spreadsheet.dataSet;
  const { values = [] } = dataSet.fields;
  const index = fields.indexOf(currentField);
  const fieldValues: FieldValue[] = [];

  let query: Record<string, unknown> = {};

  query = getDimsCondition(parentNode, true);
  const dimValues = dataSet.getDimensionValues(currentField, query);

  const arrangedValues = layoutArrange(
    spreadsheet,
    dimValues as FieldValue[],
    parentNode,
    currentField,
  );

  fieldValues.push(...((arrangedValues as FieldValue[]) || []));

  if (isEmpty(fieldValues) && currentField) {
    if (currentField === EXTRA_FIELD) {
      fieldValues.push(...values);
    } else {
      fieldValues.push(EMPTY_FIELD_VALUE);
    }
  }

  addTotals({
    currentField,
    lastField: fields[index - 1],
    isFirstField: index === 0,
    fieldValues,
    spreadsheet,
  });

  const displayFieldValues = filterOutDetail(fieldValues as string[]);

  generateGridTreeHeaderNodes({
    ...params,
    fieldValues: displayFieldValues,
    level: index,
    parentNode,
    query,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handler: buildGridTreeHierarchy,
  });
};

const buildTotalGridTreeHierarchy = (params: GridHeaderParams) => {
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
    query = getDimsCondition(parentNode);
    fieldValues.push(...values.map((v) => new TotalMeasure(v)));
  } else if (whetherLeafByLevel({ spreadsheet, level: index, fields })) {
    parentNode.isLeaf = true;
    hierarchy.pushIndexNode(parentNode);
    parentNode.rowIndex = hierarchy.getIndexNodes().length - 1;

    return;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    buildTotalGridTreeHierarchy({ ...params, currentField: fields[index + 1] });

    return;
  }

  const displayFieldValues = filterOutDetail(fieldValues as string[]);

  generateGridTreeHeaderNodes({
    ...params,
    fieldValues: displayFieldValues,
    level: index,
    parentNode,
    query,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handler: buildGridTreeHierarchy,
  });
};

/**
 * 构建 grid-tree 模式的行头层级结构
 * grid-tree 模式特点：
 * 1. 每个维度占据独立的列（与 grid 模式相同）
 * 2. 支持展开/折叠子节点（与 tree 模式相同）
 */
export function buildGridTreeHierarchy(params: GridHeaderParams) {
  if (params.parentNode.isTotals) {
    buildTotalGridTreeHierarchy(params);
  } else {
    buildNormalGridTreeHierarchy(params);
  }
}
