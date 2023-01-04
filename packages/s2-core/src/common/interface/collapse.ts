import type { Node } from '../../facet/layout/node';

export type RowCellCollapsedParams = {
  isCollapsed: boolean;
  node: Node;
  collapsedFields?: string[];
};
