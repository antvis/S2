import { isEmpty } from 'lodash';
import type { CustomTreeNode } from '../../common';
import { EXTRA_FIELD } from '../../common/constant';
import { generateId } from '../../utils/layout/generate-id';
import type { CustomTreeHeaderParams } from '../layout/interface';
import { Node } from '../layout/node';
import { layoutHierarchy } from './layout-hooks';

/**
 * 自定义🌲结构设计原则：
 * 1、渲染的节点由传入的数据结构决定, 不管是平铺,还是树状, 本质上都是树状结构
 * 2、没有总计小计的概念
 * 3、是否展开和收起完全由 customTreeNode.collapsed 来控制（默认都展开）
 * 4、支持行头/列头自定义
 * 5、支持隐藏列头
 * @param params
 */
export const buildCustomTreeHierarchy = (params: CustomTreeHeaderParams) => {
  const { tree = [], level, parentNode, hierarchy, spreadsheet } = params;
  const { collapseFields, collapseAll } = spreadsheet.options.style?.rowCell!;

  const hiddenColumnsDetail =
    spreadsheet.store.get('hiddenColumnsDetail') || [];

  tree.forEach((treeNode) => {
    const { field, title, collapsed, children, ...rest } = treeNode;

    const isHiddenNode = hiddenColumnsDetail.some(({ hideColumnNodes }) =>
      hideColumnNodes.find((hideNode) => hideNode.field === field),
    );

    if (isHiddenNode) {
      return;
    }

    // query 只与值本身有关，不会涉及到 parent 节点
    const valueQuery = { [EXTRA_FIELD]: field };
    // 使用 field 作为 id, 保证其唯一性, 复制时再做二次转换
    const nodeId = generateId(parentNode.id, field);

    const defaultCollapsed = collapsed ?? false;
    const isDefaultCollapsed =
      collapseFields?.[nodeId] || collapseFields?.[field];
    const isCollapsed = isDefaultCollapsed ?? (collapseAll || defaultCollapsed);

    // TODO: 平铺模式支持 折叠/展开
    const isCollapsedNode = spreadsheet.isHierarchyTreeType() && isCollapsed;
    const isLeaf = isEmpty(children);

    const node = new Node({
      id: nodeId,
      field,
      value: title!,
      level,
      parent: parentNode,
      // 自定义行头不会存在总计概念
      isTotals: false,
      isCollapsed: isCollapsedNode,
      hierarchy,
      query: valueQuery,
      spreadsheet,
      isLeaf,
      extra: {
        ...rest,
        isCustomNode: true,
      },
    });

    if (level > hierarchy.maxLevel && !node.isSeriesNumberNode()) {
      hierarchy.maxLevel = level;
      hierarchy.sampleNodesForAllLevels.push(node);
      hierarchy.sampleNodeForLastLevel = node;
      hierarchy.maxLevel = level;
    }

    const expandCurrentNode = layoutHierarchy(
      spreadsheet,
      parentNode,
      node,
      hierarchy,
    );

    if (!isEmpty(children) && !isCollapsed && expandCurrentNode) {
      buildCustomTreeHierarchy({
        spreadsheet,
        parentNode: node,
        level: level + 1,
        hierarchy,
        tree: (children || []) as CustomTreeNode[],
      });
    }
  });
};
