import React, { PureComponent } from 'react';
import { Collapse as AntdCollapse } from 'antd';
import { map } from 'lodash';
import { AttributeTree } from '../../attribute-tree';
import { AttributeTreeProps } from '../../types';
import './index.less';

interface Props extends AttributeTreeProps {
  type: string;
  displayName: string;
  children: any[];
}

export class Collapse extends PureComponent<Props> {
  renderPanel = (childrenConfig: any) => {
    return map(childrenConfig, (childConfig, idx) => {
      return (
        <AntdCollapse.Panel key={`${idx}`} header={childConfig.displayName}>
          {map(childConfig.children, (childConfigItem, idx) => {
            return (
              <AttributeTree
                {...this.props}
                key={`${idx}`}
                config={childConfigItem}
              />
            );
          })}
        </AntdCollapse.Panel>
      );
    });
  };
  render() {
    const { config } = this.props;
    return (
      <div className="playground-collapse">
        <AntdCollapse expandIconPosition="right" bordered={false} ghost={true}>
          {this.renderPanel(config.children)}
        </AntdCollapse>
      </div>
    );
  }
}
