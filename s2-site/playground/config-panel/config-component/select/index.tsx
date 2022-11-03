// 多选 Select 组件
import { Select as AntdSelect } from 'antd';
import React from 'react';
import { map } from 'lodash';
import { BaseComponent } from '../base';
import './index.less';

const { Option } = AntdSelect;

export class Select extends BaseComponent {
  renderContent() {
    const { config, onChange } = this.props;
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
        onChange={(value) => {
          onChange({ [attributeId]: value });
        }}
      >
        {map(options, (option, idx) => {
          return (
            <Option key={`${idx}`} value={option.value}>
              {option.label}
            </Option>
          );
        })}
      </AntdSelect>
    );
  }
}
