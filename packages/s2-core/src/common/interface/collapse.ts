import type { Node } from '../../facet/layout/node';
import type { ColCellStyle, RowCellStyle } from './style';

export type RowCellCollapsedParams = {
  isCollapsed: boolean;
  node: Node;
  collapseFields?: RowCellStyle['collapseFields'];
};

export type ColCellCollapsedParams = {
  isCollapsed: boolean;
  node: Node;
  collapseFields?: ColCellStyle['collapseFields'];
};
