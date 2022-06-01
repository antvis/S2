import { BaseTooltip, SpreadSheet } from '@antv/s2';
import React from 'react';
import ReactDOM from 'react-dom';
import { TooltipRenderProps } from './interface';
import { TooltipComponent } from './index';

export class CustomTooltip extends BaseTooltip {
  constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
  }

  renderContent() {
    // 配置级 s2.options.tooltip.content = ''
    const { content: contentFromOptions } = this.spreadsheet.options.tooltip;
    // 方法级 s2.showTooltip({ content: '' })
    const showOptions = this.options;
    const cell = this.spreadsheet.getCell(showOptions.event?.target);
    // 优先级: 方法级 > 配置级, 兼容 content 为空字符串的场景
    const content = showOptions.content ?? contentFromOptions;

    const tooltipProps: TooltipRenderProps = {
      ...showOptions,
      cell,
      content,
    };

    ReactDOM.render(
      <TooltipComponent {...tooltipProps} content={content} />,
      this.container,
    );
  }

  destroy() {
    super.destroy();
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container);
    }
  }
}
