import { TooltipShowOptions } from '@antv/s2';

export interface TooltipRenderProps extends TooltipShowOptions {
  readonly getTooltipComponent?: (
    options: TooltipShowOptions,
    container: HTMLElement,
  ) => Node | Element | string;
}
