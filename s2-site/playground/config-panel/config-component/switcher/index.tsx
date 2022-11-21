import { Switch as AntdSwitch } from 'antd';
import React from 'react';
import { BaseComponent } from '../base';

export class Switcher extends BaseComponent {
  renderContent() {
    const { config, onChange, disable } = this.props;
    const { attributeId, defaultChecked } = config;

    return (
      <AntdSwitch
        size="small"
        disabled={disable}
        defaultChecked={defaultChecked}
        onChange={(checked) => onChange({ [attributeId]: checked })}
      />
    );
  }
}
