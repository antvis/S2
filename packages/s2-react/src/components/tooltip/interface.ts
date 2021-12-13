import { TooltipShowOptions } from '@antv/s2';

export interface TooltipRenderProps<T = React.ReactNode>
  extends TooltipShowOptions<T> {
  readonly content?: T;
}

export type TooltipInfosProps = {
  infos: string;
};
