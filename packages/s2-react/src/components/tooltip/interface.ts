import { TooltipShowOptions } from '@antv/s2';
import { HtmlIconProps } from '@/common/icons';

export interface TooltipRenderProps extends TooltipShowOptions {
  readonly tooltipComponent?: TooltipRenderComponent;
  readonly getTooltipComponent?: (
    options: TooltipShowOptions,
    container: HTMLElement,
  ) => void;
}

export type TooltipRenderComponent = JSX.Element;

export const TOOLTIP_DEFAULT_ICON_PROPS: Partial<HtmlIconProps> = {
  width: 14,
  height: 14,
  style: {
    verticalAlign: 'sub',
    marginRight: 4,
  },
};
