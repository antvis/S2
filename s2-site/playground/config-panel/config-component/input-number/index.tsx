import React from 'react';
import { InputNumber as AntdInputNumber } from 'antd';
import { BaseComponent } from '../base';
import './index.less';

export class InputNumber extends BaseComponent {
  renderContent() {
    const { config, onChange, disable } = this.props;
    const { attributeId, defaultValue, step, min } = config;

    return (
      <div>
        <AntdInputNumber
          disabled={disable}
          defaultValue={defaultValue}
          step={step || 1}
          onChange={(value) => onChange({ [attributeId]: value })}
          size="small"
          className="input-number"
          min={min}
        />
      </div>
    );
  }
}
