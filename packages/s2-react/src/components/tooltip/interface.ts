import { TooltipShowOptions } from '@antv/s2';

export interface TooltipRenderProps extends TooltipShowOptions {
  readonly tooltipComponent?: TooltipRenderComponent;
  readonly getTooltipComponent?: (
    options: TooltipShowOptions,
    container: HTMLElement,
  ) => Node | Element | string;
}

export type TooltipRenderComponent = JSX.Element;
