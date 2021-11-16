import { TooltipShowOptions } from '@antv/s2';

export interface TooltipRenderProps extends TooltipShowOptions {
  readonly tooltipComponent?: TooltipRenderComponent;
  readonly getTooltipComponent?: (
    options: TooltipShowOptions,
    container: HTMLElement,
  ) => void;
}

export type TooltipRenderComponent = JSX.Element;
