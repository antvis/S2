import type { Query } from '../../data-set';
import { EMPTY_FIELD_VALUE } from '../../common/constant';
import type { Node } from '../../facet/layout/node';

export function getDimsCondition(parent: Node, force?: boolean) {
  const cond: Query = {};
  let p: Node | undefined = parent;

  while (p && p.field) {
    /**
     * 当为表格布局时，小计行的内容是“小计”不需要作为筛选条件
     * 当为树状布局时，force可以强行指定小计行，即父类目作为筛选条件
     */
    if ((!p.isTotalRoot || force) && p.value !== EMPTY_FIELD_VALUE) {
      cond[p.field] = p.value;
    }

    p = p.parent;
  }

  return cond;
}
