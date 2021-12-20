import { S2CellType, TooltipShowOptions } from '@antv/s2';

export interface CustomTooltipProps {
  cell: S2CellType;
  defaultTooltipShowOptions?: TooltipShowOptions<React.ReactNode>;
}
