import type { Node, S2CellType, TooltipShowOptions, ViewMeta } from '@antv/s2';
import type { StrategySheetProps } from '..';

export interface CustomTooltipProps {
  cell: S2CellType<Node | ViewMeta>;
  defaultTooltipShowOptions?: TooltipShowOptions<React.ReactNode>;
}
