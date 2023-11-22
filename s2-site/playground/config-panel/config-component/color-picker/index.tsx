import { Popover } from 'antd';
import React from 'react';
import { ChromePicker } from 'react-color';
import { BaseComponent } from '../base';
import './index.less';

export class ColorPicker extends BaseComponent {
  renderContent() {
    const { config, onChange, attributes } = this.props;
    const { defaultColor, attributeId } = config;
    const color = attributes?.themeColor?.hex || defaultColor;
    const content = (
      <ChromePicker
        color={color}
        onChangeComplete={(value: string) => {
          onChange?.({ [attributeId]: value });
        }}
      />
    );

    return (
      <Popover content={content} placement="bottom">
        <div style={{ backgroundColor: color }} className="color-block" />
      </Popover>
    );
  }
}
