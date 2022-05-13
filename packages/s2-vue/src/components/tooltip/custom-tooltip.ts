import { BaseTooltip, SpreadSheet } from '@antv/s2';
import { createVNode, render, type VNodeProps } from 'vue';
import TooltipComponent from './index.vue';
import type { TooltipRenderProps } from './interface';

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

    const tooltipVNode = createVNode(
      TooltipComponent,
      tooltipProps as VNodeProps,
    );
    render(tooltipVNode, this.container);
  }
}
