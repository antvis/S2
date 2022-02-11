import { isEmpty, get } from 'lodash';
import { layoutHierarchy } from './layout-hooks';
import { CustomTreeHeaderParams } from '@/facet/layout/interface';
import { Node } from '@/facet/layout/node';
import { EXTRA_FIELD } from '@/common/constant';
import { generateId } from '@/utils/layout/generate-id';

/**
 * 自定义🌲结构设计原则：
 * 1、渲染的节点全部跟着定义的数据结构走，如果需要结构变（数据挂父节点）等场景，建议直接改
 * 传入的customTreeItems配置
 * 2、没有总计小计的概念，如果有类似的，建议也是直接改customTreeItems配置
 * 3、是否展开和收起完全由 customTreeItem.collapsed 来控制（默认都展开）
 * @param params
 */
export const buildRowCustomTreeHierarchy = (params: CustomTreeHeaderParams) => {
  const {
    facetCfg,
    customTreeItems = [],
    level,
    parentNode,
    hierarchy,
  } = params;
  const { spreadsheet, collapsedRows, hierarchyCollapse } = facetCfg;
  for (const customTreeItem of customTreeItems) {
    const { key, title, collapsed, children, ...rest } = customTreeItem;
    // query只与值本身有关，不会涉及到parent节点
    const valueQuery = { [EXTRA_FIELD]: key };
    // 保持和其他场景头部生成id的格式一致
    const uniqueId = generateId(parentNode.id, title);
    const defaultCollapsed = collapsed ?? false;
    const isCollapsedRow = get(collapsedRows, uniqueId);
    const isCollapsed =
      isCollapsedRow ?? (hierarchyCollapse || defaultCollapsed);

    const node = new Node({
      id: uniqueId,
      key,
      label: title,
      value: title,
      level,
      parent: parentNode,
      field: key,
      isTotals: false, // 自定义行头不会存在总计概念
      isCollapsed,
      hierarchy,
      query: valueQuery,
      spreadsheet,
      extra: rest,
    });

    if (level > hierarchy.maxLevel) {
      hierarchy.maxLevel = level;
    }

    if (isEmpty(children)) {
      node.isLeaf = true;
    }
    const expandCurrentNode = layoutHierarchy(
      facetCfg,
      parentNode,
      node,
      hierarchy,
    );

    // go recursive
    if (!isEmpty(children) && !isCollapsed && expandCurrentNode) {
      buildRowCustomTreeHierarchy({
        facetCfg,
        parentNode: node,
        level: level + 1,
        hierarchy,
        customTreeItems: children,
      });
    }
  }
};
