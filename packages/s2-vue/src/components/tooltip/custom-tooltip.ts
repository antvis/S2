import { BaseTooltip, SpreadSheet, type TooltipShowOptions } from '@antv/s2';
import { createVNode, render, type VNodeProps } from 'vue';
import TooltipComponent from './index.vue';
import type { TooltipRenderProps } from './interface';

export class CustomTooltip extends BaseTooltip {
  constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
  }

  renderContent() {
    // 配置级 s2.options.tooltip.content = ''
    const { tooltip } = this.spreadsheet.options;
    // 方法级 s2.showTooltip({ content: '' })
    const showOptions = this.options;
    const cell = this.spreadsheet.getCell(
      showOptions.event?.target as EventTarget,
    );
    // 优先级: 方法级 > 配置级, 兼容 content 为空字符串的场景
    const content = showOptions.content ?? tooltip?.content;

    const tooltipProps: TooltipRenderProps<TooltipShowOptions['content']> = {
      ...showOptions,
      cell,
      content,
    };

    const tooltipVNode = createVNode(
      TooltipComponent,
      tooltipProps as VNodeProps,
    );

    // render(null) 确保每一次的 tooltip 内容是最新的
    render(null, this.container);
    render(tooltipVNode, this.container);
  }

  destroy() {
    super.destroy();
    if (this.container) {
      render(null, this.container);
    }
  }
}
