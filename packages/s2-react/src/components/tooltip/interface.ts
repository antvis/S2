import type {
  S2CellType,
  TooltipShowOptions,
  TooltipOperatorMenu as S2TooltipOperatorMenu,
} from '@antv/s2';

export interface TooltipRenderProps<
  T = React.ReactNode,
  Icon = React.ReactNode,
  Text = React.ReactNode,
> extends TooltipShowOptions<T, Icon, Text> {
  readonly content?: T;
  readonly cell?: S2CellType | null;
  readonly onMounted?: () => void;
}

export type TooltipInfosProps = {
  infos: string;
};

export type TooltipOperatorMenu = S2TooltipOperatorMenu<
  React.ReactNode,
  React.ReactNode
>;

export type TooltipIconProps = {
  icon: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
};
