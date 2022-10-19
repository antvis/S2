import { BaseTooltip, isMobile, SpreadSheet } from '@antv/s2';
import React from 'react';
import ReactDOM from 'react-dom';
import { Drawer } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { MOBILE_DRAWER_WIDTH } from '../../common/constant/options';
import type { TooltipRenderProps } from './interface';
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
    const cell = this.spreadsheet.getCell(showOptions?.event?.target);
    // 优先级: 方法级 > 配置级, 兼容 content 为空字符串的场景
    const content = showOptions?.content ?? contentFromOptions;

    const tooltipProps: TooltipRenderProps = {
      ...showOptions,
      cell,
      content,
    };

    if (showOptions?.options?.forceRender) {
      this.unmountComponentAtNode();
    }

    ReactDOM.render(
      isMobile(this.spreadsheet.options?.device) ? (
        <Drawer
          title={cell?.getActualText()}
          visible={this.visible}
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
      ),
      this.container,
    );
  }

  hide() {
    super.hide();
    if (this.container) {
      this.renderContent();
    }
  }

  destroy() {
    super.destroy();
    this.unmountComponentAtNode();
  }

  private unmountComponentAtNode() {
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container);
    }
  }
}
