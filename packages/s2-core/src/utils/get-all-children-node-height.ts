import { Node } from 'src/facet/layout/node';

/**
 * 获取当前node所有children的总高度
 * @param node
 */
export const getAllChildrenNodeHeight = (node: Node) => {
  let nodeAllCellHeight = 0;
  const nodes = Node.getAllChildrenNode(node);
  nodes?.forEach((item) => {
    nodeAllCellHeight += item.height || 0;
  });

  return nodeAllCellHeight;
};
