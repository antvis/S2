import type {
  Node,
  S2CellType,
  SimpleData,
  TooltipShowOptions,
  ViewMeta,
} from '@antv/s2';
import type { VNode } from 'vue';

type TooltipLabel = string | VNode | unknown;

export interface CustomTooltipProps {
  cell: S2CellType<Node | ViewMeta>;
  defaultTooltipShowOptions?: TooltipShowOptions<VNode>;
  label?:
    | TooltipLabel
    | ((
        cell: S2CellType<Node | ViewMeta>,
        defaultLabel: TooltipLabel,
      ) => TooltipLabel);
  showOriginalValue?: boolean;
  renderDerivedValue?: (
    currentValue: SimpleData,
    originalValue: SimpleData,
    cell: S2CellType<Node | ViewMeta>,
  ) => VNode;
}
