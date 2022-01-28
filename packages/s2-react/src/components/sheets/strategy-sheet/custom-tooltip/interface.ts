import { S2CellType, TooltipShowOptions, Node, ViewMeta } from '@antv/s2';

export interface CustomTooltipProps {
  cell: S2CellType<Node | ViewMeta>;
  defaultTooltipShowOptions?: TooltipShowOptions<React.ReactNode>;
}
