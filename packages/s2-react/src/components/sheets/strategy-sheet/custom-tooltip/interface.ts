import type {
  Node,
  S2CellType,
  SimpleData,
  TooltipShowOptions,
  ViewMeta,
} from '@antv/s2';
import type { TooltipOperatorMenuOptions } from '../../../tooltip/interface';

export interface CustomTooltipProps {
  cell: S2CellType<Node | ViewMeta>;
  defaultTooltipShowOptions?: TooltipShowOptions<
    React.ReactNode,
    TooltipOperatorMenuOptions
  >;
  label?:
    | React.ReactNode
    | ((
        cell: S2CellType<Node | ViewMeta>,
        defaultLabel: React.ReactNode,
      ) => React.ReactNode);
  showOriginalValue?: boolean;
  renderDerivedValue?: (
    currentValue: SimpleData,
    originalValue: SimpleData,
    cell: S2CellType<Node | ViewMeta>,
  ) => React.ReactNode;
}
