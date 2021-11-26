import { BaseTooltip, SpreadSheet } from '@antv/s2';
import React from 'react';
import ReactDOM from 'react-dom';
import { merge } from 'lodash';
import { TooltipComponent } from '@/components/tooltip';
import { TooltipRenderProps } from '@/components/tooltip/interface';

export class CustomTooltip extends BaseTooltip {
  constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
  }

  renderContent() {
    // 配置级 s2.options.tooltip.content = ''
    const { content: contentFromOptions } = this.spreadsheet.options.tooltip;
    // 方法级 s2.showTooltip({ content: '' })
    const showOptions = this.options;
    // 优先级: 方法级 > 配置级
    const tooltipProps: TooltipRenderProps = merge(
      {},
      {
        content: contentFromOptions,
      },
      showOptions,
    );
    ReactDOM.render(<TooltipComponent {...tooltipProps} />, this.container);
  }

  destroy() {
    super.destroy();
    ReactDOM.unmountComponentAtNode(this.container);
  }
}
