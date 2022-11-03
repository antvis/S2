import type { S2CellType, TooltipShowOptions } from '@antv/s2';

export interface TooltipRenderProps<T = React.ReactNode | Element>
  extends TooltipShowOptions<T> {
  readonly content?: T;
  readonly cell?: S2CellType | null;
}

export type TooltipInfosProps = {
  infos: string;
};
