import type { Node, S2CellType, TooltipShowOptions, ViewMeta } from '@antv/s2';

export interface CustomTooltipProps {
  cell: S2CellType<Node | ViewMeta>;
  defaultTooltipShowOptions?: TooltipShowOptions<React.ReactNode>;
  label?: React.ReactNode | (() => React.ReactNode);
}
