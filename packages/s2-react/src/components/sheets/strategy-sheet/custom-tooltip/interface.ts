import { S2CellType, TooltipShowOptions } from '@antv/s2';
import { StrategySheetProps } from '../../interface';

export interface CustomTooltipProps {
  cell: S2CellType;
  defaultTooltipShowOptions?: TooltipShowOptions<React.ReactNode>;
  valuesConfig?: StrategySheetProps['valuesConfig'];
}
