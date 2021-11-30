import { TooltipShowOptions } from '@antv/s2';
export interface TooltipRenderProps
  extends TooltipShowOptions<React.ReactNode> {
  readonly content?: React.ReactNode;
}
export type TooltipInfosProps = {
  infos: string;
};
