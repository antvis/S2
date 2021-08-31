import { ViewMete } from '@/facet/layout/node';

/**
 * 获取当前node所有children的总高度
 * @param node
 */
export const getAllChildrenNodeHeight = (meta: ViewMete) => {
  let nodeAllCellHeight = 0;
  const nodes = meta.children;
  nodes?.forEach((item) => {
    nodeAllCellHeight += item.height || 0;
  });

  return nodeAllCellHeight;
};
