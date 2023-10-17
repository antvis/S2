import {
  BaseTooltip,
  isMobile,
  MOBILE_TOOLTIP_PREFIX_CLS,
  SpreadSheet,
} from '@antv/s2';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Drawer } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { MOBILE_DRAWER_WIDTH } from '../../common/constant/options';
import type { TooltipRenderProps } from './interface';
import { TooltipContext } from './context';
import { TooltipComponent } from './index';
import './style.less';

export class CustomTooltip extends BaseTooltip {
  root: Root;

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
      this.unmount();
    }

    this.root ??= createRoot(this.container!);
    this.root.render(
      this.isMobileDevice() ? (
        <Drawer
          className={`${MOBILE_TOOLTIP_PREFIX_CLS}-drawer`}
          title={cell?.getActualText()}
          open={this.visible}
          closeIcon={<LeftOutlined />}
          placement="right"
          width={MOBILE_DRAWER_WIDTH}
          onClose={() => {
            this.hide();
          }}
        >
          <TooltipContext.Provider value={this.isMobileDevice()}>
            <TooltipComponent {...tooltipProps} content={content} />
          </TooltipContext.Provider>
        </Drawer>
      ) : (
        <TooltipComponent {...tooltipProps} content={content} />
      ),
    );
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

  private unmount() {
    this.root?.unmount();
  }
}
