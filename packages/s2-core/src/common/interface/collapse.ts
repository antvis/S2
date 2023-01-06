import type { Node } from '../../facet/layout/node';
import type { RowCellStyle } from './style';

export type RowCellCollapsedParams = {
  isCollapsed: boolean;
  node: Node;
  collapseFields?: RowCellStyle['collapseFields'];
};
