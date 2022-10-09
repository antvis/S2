import { get, isEmpty } from 'lodash';
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
 * @param params
 */
export const buildCustomTreeHierarchy = (params: CustomTreeHeaderParams) => {
  const { facetCfg, tree = [], level, parentNode, hierarchy } = params;
  const { spreadsheet, collapsedRows, hierarchyCollapse, hierarchyType } =
    facetCfg;

  tree.forEach((treeNode) => {
    const { key, title, collapsed, children, ...rest } = treeNode;
    // query只与值本身有关，不会涉及到 parent节点
    const valueQuery = { [EXTRA_FIELD]: key };
    // 保持和其他场景头部生成id的格式一致
    const nodeId = generateId(parentNode.id, title);

    const defaultCollapsed = collapsed ?? false;
    const isCollapsedRow = get(collapsedRows, nodeId);
    const isCollapsed =
      isCollapsedRow ?? (hierarchyCollapse || defaultCollapsed);

    // 平铺模式没有折叠状态
    const isCollapsedNode = hierarchyType !== 'grid' && isCollapsed;
    const isLeaf = isEmpty(children);

    const node = new Node({
      id: nodeId,
      key,
      label: title,
      value: title,
      level,
      parent: parentNode,
      field: key,
      isTotals: false, // 自定义行头不会存在总计概念
      isCollapsed: isCollapsedNode,
      hierarchy,
      query: valueQuery,
      spreadsheet,
      extra: rest,
      isLeaf,
    });

    if (level > hierarchy.maxLevel) {
      hierarchy.maxLevel = level;
      hierarchy.sampleNodesForAllLevels.push(node);
      hierarchy.sampleNodeForLastLevel = node;
      hierarchy.maxLevel = level;
    }

    const expandCurrentNode = layoutHierarchy(
      facetCfg,
      parentNode,
      node,
      hierarchy,
    );

    if (!isEmpty(children) && !isCollapsed && expandCurrentNode) {
      buildCustomTreeHierarchy({
        facetCfg,
        parentNode: node,
        level: level + 1,
        hierarchy,
        tree: children,
      });
    }
  });
};
