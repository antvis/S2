import {
  BaseTooltip,
  isMobile,
  MOBILE_TOOLTIP_PREFIX_CLS,
  SpreadSheet,
} from '@antv/s2';
import React from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import { startsWith } from 'lodash';
// eslint-disable-next-line react/no-deprecated
import { render, unmountComponentAtNode, version } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { MOBILE_DRAWER_WIDTH } from '../../common/constant/options';
import { ConfigProvider } from '../config-provider';
import type {
  TooltipOperatorMenuOptions,
  TooltipRenderProps,
} from './interface';
import { TooltipComponent } from './index';
import './style.less';

/**
 * 自定义 Tooltip 组件, 兼容 React 18 参考如下
 * @ref https://github.com/react-component/util/blob/677d3ac177d147572b65af63e67a7796a5104f4c/src/React/render.ts#L69-L106
 */
export class CustomTooltip extends BaseTooltip<
  React.ReactNode,
  TooltipOperatorMenuOptions
> {
  root: Root;

  isLegacyReactVersion = !startsWith(version, '18');

  constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
  }

  private isMobileDevice() {
    return isMobile(this.spreadsheet.options?.device);
  }

  renderContent() {
    // 配置级 s2.options.tooltip.content = ''
    const { content: contentFromOptions } = this.spreadsheet.options.tooltip!;
    // 方法级 s2.showTooltip({ content: '' })
    const showOptions = this.options;
    const cell = this.spreadsheet.getCell(showOptions?.event?.target);
    // 优先级: 方法级 > 配置级, 兼容 content 为空字符串的场景
    const content = (showOptions?.content ??
      contentFromOptions) as React.ReactNode;

    const tooltipProps = {
      ...showOptions,
      cell,
      content,
    } as TooltipRenderProps;

    if (showOptions?.options?.forceRender) {
      this.forceClearContent();
    }

    const Content = this.isMobileDevice() ? (
      <Drawer
        rootClassName={`${MOBILE_TOOLTIP_PREFIX_CLS}-drawer`}
        title={cell?.getActualText()}
        open={this.visible}
        closeIcon={<LeftOutlined />}
        placement="right"
        width={MOBILE_DRAWER_WIDTH}
        onClose={() => {
          this.hide();
        }}
      >
        <TooltipComponent {...tooltipProps} content={content} />
      </Drawer>
    ) : (
      <TooltipComponent {...tooltipProps} content={content} />
    );

    const themeName = this.spreadsheet.getThemeName();
    const TooltipContent = (
      <ConfigProvider themeName={themeName}>{Content}</ConfigProvider>
    );

    if (this.isLegacyReactVersion) {
      render(TooltipContent, this.container);

      return;
    }

    this.root ??= createRoot(this.container!);
    this.root.render(TooltipContent);
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
    if (this.isLegacyReactVersion) {
      this.unmount();

      return;
    }

    this.root?.render(null);
  }

  unmount() {
    if (this.isLegacyReactVersion && this.container!) {
      unmountComponentAtNode(this.container);

      return;
    }

    // https://github.com/facebook/react/issues/25675#issuecomment-1363957941
    Promise.resolve().then(() => {
      this.root?.unmount();
    });
  }
}
