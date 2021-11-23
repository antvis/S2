import React from 'react';
import ReactDOM from 'react-dom';
import { TooltipShowOptions } from '@antv/s2';
import { TooltipComponent } from '@/components/tooltip';
import { TooltipRenderProps } from '@/components/tooltip/interface';

export const getTooltipComponent = (
  tooltipOptions: TooltipShowOptions,
  tooltipContainer: HTMLElement,
) => {
  const tooltipProps: TooltipRenderProps = {
    ...tooltipOptions,
  };
  ReactDOM.render(<TooltipComponent {...tooltipProps} />, tooltipContainer);
};
