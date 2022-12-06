import type {
  Node,
  S2CellType,
  SimpleData,
  TooltipShowOptions,
  ViewMeta,
} from '@antv/s2';

export interface CustomTooltipProps {
  cell: S2CellType<Node | ViewMeta>;
  defaultTooltipShowOptions?: TooltipShowOptions<
    React.ReactNode,
    React.ReactNode,
    React.ReactNode
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
