import type { S2CellType, TooltipShowOptions } from '@antv/s2';

export interface TooltipRenderProps<T = React.ReactNode>
  extends TooltipShowOptions<T> {
  readonly content?: T;
  readonly cell: S2CellType;
}

export type TooltipInfosProps = {
  infos: string;
};
