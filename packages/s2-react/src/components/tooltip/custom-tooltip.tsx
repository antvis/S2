/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line prettier/prettier
import { BaseTooltip, customMerge, isMobile, SpreadSheet } from '@antv/s2';
import React from 'react';
import {
  forceClearContent,
  reactRender,
  reactUnmount,
} from '../../utils/reactRender';
import { TooltipComponent } from './index';
import type {
  TooltipOperatorMenuOptions,
  TooltipRenderProps,
} from './interface';

/**
 * 自定义 Tooltip 组件, 兼容 React 18 参考如下
 * @ref https://github.com/react-component/util/blob/677d3ac177d147572b65af63e67a7796a5104f4c/src/React/render.ts#L69-L106
 */
export class CustomTooltip extends BaseTooltip<
  React.ReactNode,
  TooltipOperatorMenuOptions
> {
  constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
  }

  private isMobileDevice() {
    return isMobile(this.spreadsheet.options?.device);
  }

  renderContent() {
    // 配置级 s2.options.tooltip.content = ''
    const { content: contentFromOptions, operation } =
      this.spreadsheet.options.tooltip!;
    // 方法级 s2.showTooltip({ content: '' })
    const showOptions = this.options;
    const cell = this.spreadsheet.getCell(showOptions?.event?.target);
    // 优先级: 方法级 > 配置级, 兼容 content 为空字符串的场景
    const content = (showOptions?.content ??
      contentFromOptions) as React.ReactNode;

    const tooltipProps = customMerge<TooltipRenderProps>(
      {
        options: {
          operator: operation,
        },
      },
      {
        ...showOptions,
        cell,
        content,
      },
    );

    if (showOptions?.options?.forceRender) {
      this.forceClearContent();
    }

    const TooltipContent = (
      <TooltipComponent {...tooltipProps} content={content} />
    );

    reactRender(TooltipContent, this.container!);
  }

  hide() {
    super.hide();
    if (this.container && this.isMobileDevice()) {
      this.renderContent();
    }
  }

  destroy() {
    this.unmount();
    super.destroy();
  }

  forceClearContent() {
    forceClearContent(this.container!);
  }

  unmount() {
    reactUnmount(this.container!);
  }
}
