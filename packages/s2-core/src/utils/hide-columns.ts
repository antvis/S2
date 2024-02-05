import { compact, get, isEmpty, isEqual, last, uniq } from 'lodash';
import { NODE_ID_SEPARATOR, S2Event } from '../common/constant';
import { getLeafColumnsWithKey } from '../facet/utils';
import type { HiddenColumnsInfo } from '../common/interface/store';
import type { Node } from '../facet/layout/node';
import type { SpreadSheet } from '../sheet-type';

export const getHiddenColumnFieldKey = (field: string) => {
  const targetFieldKey = (
    field.includes(NODE_ID_SEPARATOR) ? 'id' : 'field'
  ) as keyof Node;

  return targetFieldKey;
};

/**
 * @name 获取需要隐藏的 field 转成对应的 Node
 */
export const getHiddenColumnNodes = (
  spreadsheet: SpreadSheet,
  hiddenColumnFields: string[] = [],
): Node[] => {
  const colNodes = spreadsheet.facet.getInitColLeafNodes();

  return compact(
    hiddenColumnFields.map((field) => {
      const targetFieldKey = getHiddenColumnFieldKey(field);

      return colNodes.find((node) => node[targetFieldKey] === field);
    }),
  );
};

/**
 * @name 获取隐藏列兄弟节点
 * @description 获取当前隐藏列(兼容多选) 所对应为未隐藏的兄弟节点
 * @param hideColumns 经过分组的连续隐藏列
 * [ 1, 2, 3, -, -, -, (7 √), 8, 9 ]
 * [ 1, 2, 3, (4 √), - ]
 */
export const getHiddenColumnDisplaySiblingNode = (
  spreadsheet: SpreadSheet,
  hiddenColumnFields: string[] = [],
): HiddenColumnsInfo['displaySiblingNode'] => {
  if (isEmpty(hiddenColumnFields)) {
    return {
      prev: null,
      next: null,
    };
  }

  const initColLeafNodes = spreadsheet.facet.getInitColLeafNodes();
  const hiddenColumnIndexes = getHiddenColumnNodes(
    spreadsheet,
    hiddenColumnFields,
  ).map((node) => node?.colIndex);
  const lastHiddenColumnIndex = Math.max(...hiddenColumnIndexes);
  const firstHiddenColumnIndex = Math.min(...hiddenColumnIndexes);
  const nextSiblingNode = initColLeafNodes.find(
    (node) => node.colIndex === lastHiddenColumnIndex + 1,
  );
  const prevSiblingNode = initColLeafNodes.find(
    (node) => node.colIndex === firstHiddenColumnIndex - 1,
  );

  return {
    prev: prevSiblingNode || null,
    next: nextSiblingNode || null,
  };
};

/**
 * @name 获取隐藏列组
 * @description 如果给定的隐藏列不是连续的, 比如原始列是 [1,2,3,4,5,6,7], 隐藏列是 [2,3,6], 那么其实在表格上需要显示两个展开按钮
 * [[2,3],[6]]
 */
export const getHiddenColumnsThunkGroup = (
  columns: string[],
  hiddenColumnFields: string[],
): string[][] => {
  if (isEmpty(hiddenColumnFields)) {
    return [];
  }

  // 上一个需要隐藏项的序号
  let prevHiddenIndex = Number.NEGATIVE_INFINITY;

  return columns.reduce<string[][]>((result, field, index) => {
    if (!hiddenColumnFields.includes(field)) {
      return result;
    }

    if (index === prevHiddenIndex + 1) {
      const lastGroup = last(result);

      lastGroup?.push(field);
    } else {
      const group = [field];

      result.push(group);
    }

    prevHiddenIndex = index;

    return result;
  }, []);
};

/**
 * @name 隐藏指定列
 * @description 1. 通过分析组件隐藏, 2. 点击列头隐藏
 * 存储: 1.隐藏列所对应的兄弟节点 (显示展开按钮), 2.当前隐藏列 (点击展开按钮恢复隐藏)
 * 重置交互: 比如选中当前列, 显示高亮背景色, 隐藏后需要取消高亮
 * 钩子: 提供当前被隐藏的列, 和全量的隐藏组
 */
export const hideColumns = async (
  spreadsheet: SpreadSheet,
  selectedColumnFields: string[] = [],
  forceRender = false,
) => {
  const renderByHiddenColumns = async (
    hiddenColumnFields: string[] = [],
    hiddenColumnsDetail: HiddenColumnsInfo[] = [],
  ) => {
    spreadsheet.setOptions({
      interaction: {
        hiddenColumnFields,
      },
    });
    spreadsheet.interaction.reset();
    spreadsheet.store.set('hiddenColumnsDetail', hiddenColumnsDetail);
    await spreadsheet.render({
      reloadData: false,
      reBuildHiddenColumnsDetail: false,
    });
  };

  if (isEmpty(selectedColumnFields) && forceRender) {
    await renderByHiddenColumns();

    return;
  }

  const lastHiddenColumnDetail = spreadsheet.store.get(
    'hiddenColumnsDetail',
    [],
  );
  const { hiddenColumnFields: lastHiddenColumnFields = [] } =
    spreadsheet.options.interaction!;

  if (isEqual(selectedColumnFields, lastHiddenColumnFields) && !forceRender) {
    return;
  }

  const hiddenColumnFields: string[] = uniq([
    ...selectedColumnFields,
    ...lastHiddenColumnFields,
  ]);

  const isAllNearToHiddenColumnNodes = getHiddenColumnNodes(
    spreadsheet,
    hiddenColumnFields,
  ).every((node, i, nodes) => {
    const nextNode = nodes[i + 1];

    return !nextNode || Math.abs(node.colIndex - nextNode.colIndex) === 1;
  });

  const displaySiblingNode = getHiddenColumnDisplaySiblingNode(
    spreadsheet,
    isAllNearToHiddenColumnNodes ? hiddenColumnFields : selectedColumnFields,
  );

  const currentHiddenColumnsInfo: HiddenColumnsInfo = {
    hideColumnNodes: getHiddenColumnNodes(spreadsheet, selectedColumnFields),
    displaySiblingNode,
  };

  const hiddenColumnsDetail: HiddenColumnsInfo[] = [
    ...lastHiddenColumnDetail,
    currentHiddenColumnsInfo,
  ];

  spreadsheet.emit(
    S2Event.COL_CELL_HIDDEN,
    currentHiddenColumnsInfo,
    hiddenColumnsDetail,
  );

  await renderByHiddenColumns(hiddenColumnFields, hiddenColumnsDetail);
};

/**
 * @name 获取配置的列头
 * @description 明细表: 配置的是 field,直接使用, 透视表: 需要将 field 转成布局之后的唯一id
 */
export const getColumns = (spreadsheet: SpreadSheet) => {
  const { columns = [] } = spreadsheet.dataCfg.fields;

  if (spreadsheet.isTableMode() && !spreadsheet.isCustomColumnFields()) {
    return columns;
  }

  return spreadsheet.facet.getInitColLeafNodes().map(({ id }) => id);
};

/**
 * @name 根据分组隐藏指定列
 * @description 根据配置的隐藏列自动分组, 批量隐藏
 * @param spreadsheet
 * @param hiddenColumnFields 隐藏的列头字段
 * @param forceRender 隐藏的列头字段为空时, 是否强制更新
 */
export const hideColumnsByThunkGroup = async (
  spreadsheet: SpreadSheet,
  hiddenColumnFields: string[] = [],
  forceRender = false,
) => {
  // 隐藏列为空时, 有可能是隐藏后又展开 ( [] => ['A'] => []), 所以需要更新一次, 将渲染的展开icon, 隐藏列信息等清空
  if (isEmpty(hiddenColumnFields) && forceRender) {
    await hideColumns(spreadsheet, hiddenColumnFields, true);
  }

  const columns = getColumns(spreadsheet);
  const leafs = getLeafColumnsWithKey(columns);
  const hiddenColumnsGroup = getHiddenColumnsThunkGroup(
    leafs,
    hiddenColumnFields,
  );

  await Promise.all(
    hiddenColumnsGroup.map(async (fields) => {
      await hideColumns(spreadsheet, fields, forceRender);
    }),
  );
};

export const isLastColumnAfterHidden = (
  spreadsheet: SpreadSheet,
  columnField: string,
) => {
  const columnNodes = spreadsheet.facet.getColNodes();
  const initColLeafNodes = spreadsheet.facet.getInitColLeafNodes();
  const fieldKey = getHiddenColumnFieldKey(columnField);

  return (
    get(last(columnNodes), fieldKey) === columnField &&
    get(last(initColLeafNodes), fieldKey) !== columnField
  );
};

export const getValidDisplaySiblingNode = (
  displaySiblingNode: HiddenColumnsInfo['displaySiblingNode'],
) => displaySiblingNode?.next || displaySiblingNode?.prev;

export const getValidDisplaySiblingNodeId = (
  displaySiblingNode: HiddenColumnsInfo['displaySiblingNode'],
) => {
  const node = getValidDisplaySiblingNode(displaySiblingNode);

  return node?.id;
};

export const isEqualDisplaySiblingNodeId = (
  displaySiblingNode: HiddenColumnsInfo['displaySiblingNode'],
  nodeId: string,
) => getValidDisplaySiblingNodeId(displaySiblingNode) === nodeId;
