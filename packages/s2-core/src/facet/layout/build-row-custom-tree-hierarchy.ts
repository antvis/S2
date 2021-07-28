import { CustomTreeHeaderParams } from '@/facet/layout/interface';
import { isEmpty, isUndefined, isBoolean } from 'lodash';
import { Node } from '@/facet/layout/node';
import { EXTRA_FIELD } from '@/common/constant';
import { generateId } from '@/facet/layout/util/generate-id';

/**
 * 自定义🌲结构设计原则：
 * 1、渲染的节点全部跟着定义的数据结构走，如果需要结构变（数据挂父节点）等场景，建议直接改
 * 传入的customTreeItems配置
 * 2、没有总计小计的概念，如果有类似的，建议也是直接改customTreeItems配置
 * 3、是否展开和收起完全由 customTreeItem.collapsed 来控制（默认都展开）
 * @param params
 */
export const buildRowCustomTreeHierarchy = (params: CustomTreeHeaderParams) => {
  const { facetCfg, customTreeItems, level, parentNode, hierarchy } = params;
  const { spreadsheet, collapsedRows, hierarchyCollapse } = facetCfg;
  for (const customTreeItem of customTreeItems) {
    const { key, title, collapsed, description, children } = customTreeItem;
    // query只与值本身有关，不会涉及到parent节点
    const valueQuery = { [EXTRA_FIELD]: key };
    // 保持和其他场景头部生成id的格式一致
    const uniqueId = generateId(parentNode.id, title, facetCfg);
    const defaultCollapsed = isUndefined(collapsed) ? false : collapsed;
    let isCollapsed;
    const collapsedRow = collapsedRows[uniqueId];
    const userCollapsed = isBoolean(collapsedRow);
    if (hierarchyCollapse) {
      // 全部都收起
      isCollapsed = userCollapsed ? collapsedRow : hierarchyCollapse;
    } else {
      // 用户有自定义开关后，以用户操作为准，否则用默认配置
      isCollapsed = userCollapsed ? collapsedRow : defaultCollapsed;
    }
    const item = new Node({
      id: uniqueId,
      key,
      label: title,
      value: title,
      level,
      parent: parentNode,
      field: key,
      isTotals: false, // 自定义行头不会存在自定义行头概念
      isCollapsed,
      hierarchy,
      query: valueQuery,
      spreadsheet,
    });
    hierarchy.pushNode(item);

    if (isEmpty(children)) {
      item.isLeaf = true;
    }
    // go recursive
    if (!isEmpty(children) && !isCollapsed) {
      buildRowCustomTreeHierarchy({
        facetCfg,
        parentNode: item,
        level: level + 1,
        hierarchy,
        customTreeItems: children,
      });
    }
  }
};
