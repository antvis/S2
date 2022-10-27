import React from 'react';
import { Radio as AntdRadio, type RadioChangeEvent } from 'antd';
import { map } from 'lodash';
import { BaseComponent } from '../base';

export class Radio extends BaseComponent {
  renderContent() {
    const { config, onChange, disable } = this.props;
    const { attributeId, options, defaultValue } = config;

    return (
      <AntdRadio.Group
        defaultValue={defaultValue}
        size="small"
        disabled={disable}
        onChange={(e: RadioChangeEvent) =>
          onChange({ [attributeId]: e.target.value })
        }
      >
        {map(options, (option, idx) => {
          return (
            <AntdRadio.Button key={`${idx}`} value={option.value}>
              {option.label}
            </AntdRadio.Button>
          );
        })}
      </AntdRadio.Group>
    );
  }
}
