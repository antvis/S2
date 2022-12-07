import type { Node } from '../../facet/layout/node';

export function getDimsCondition(parent: Node, force?: boolean) {
  const cond: Record<string, string> = {};
  let p = parent;
  while (p && p.field) {
    /**
     * 当为表格布局时，小计行的内容是“小计”不需要作为筛选条件
     * 当为树状布局时，force可以强行指定小计行，即父类目作为筛选条件
     */
    if (!p.isTotals || force) {
      cond[p.field] = p.value;
    }
    p = p.parent!;
  }
  return cond;
}
