// 多选 Select 组件
import { Select as AntdSelect } from 'antd';
import React from 'react';
import { map } from 'lodash';
import { BaseComponent } from '../base';
import './index.less';

const { Option } = AntdSelect;

export class Select extends BaseComponent {
  renderContent() {
    const { config, onChange, disable } = this.props;
    const { attributeId, options, placeholder } = config;
    const defaultValue = map(options, (option) => {
      return option.value;
    });

    return (
      <AntdSelect
        mode="multiple"
        className="playground-select"
        placeholder={placeholder}
        size="small"
        allowClear
        showArrow={true}
        defaultValue={defaultValue}
        disabled={disable}
        onChange={(value) => {
          onChange({ [attributeId]: value });
        }}
      >
        {map(options, (option) => {
          return (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          );
        })}
      </AntdSelect>
    );
  }
}
