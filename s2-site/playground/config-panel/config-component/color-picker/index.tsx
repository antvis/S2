import React from 'react';
import { ChromePicker } from 'react-color';
import { Dropdown } from 'antd';
import { BaseComponent } from '../base';
import './index.less';

export class ColorPicker extends BaseComponent {
  renderContent() {
    const { config, onChange, attributes } = this.props;
    const { defaultColor, attributeId } = config;
    const color = attributes?.themeColor?.hex || defaultColor;
    const overlay = () => {
      return (
        <ChromePicker
          color={color}
          onChangeComplete={(value: any) => onChange({ [attributeId]: value })}
        />
      );
    };

    return (
      <Dropdown overlay={overlay} placement="bottom">
        <div style={{ backgroundColor: color }} className="color-block" />
      </Dropdown>
    );
  }
}
