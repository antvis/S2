import React, { PureComponent } from 'react';
import { Collapse as AntdCollapse } from 'antd';
import { map } from 'lodash';
import { AttributeTree } from '../../attribute-tree';
import { AttributeTreeProps, AttributeComponentProps } from '../../types';
import './index.less';

export class Collapse extends PureComponent<AttributeTreeProps> {
  renderPanel = (childrenConfig: AttributeComponentProps[]) => {
    return map(childrenConfig, (childConfig, idx) => {
      const { displayName, children } = childConfig;

      return (
        <AntdCollapse.Panel key={`${displayName}-${idx}`} header={displayName}>
          {map(children, (childConfigItem, idx) => {
            return (
              <AttributeTree
                {...this.props}
                key={`${childConfigItem.displayName}-${idx}`}
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
