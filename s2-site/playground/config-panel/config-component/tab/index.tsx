import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { map } from 'lodash';
import { AttributeTree } from '../../attribute-tree';
import { AttributeTreeProps } from '../../types';
import './index.less';

export class Tab extends PureComponent<AttributeTreeProps> {
  renderTabPane = (childrenConfig) => {
    return map(childrenConfig, (configItem, idx) => {
      return (
        <Tabs.TabPane tab={configItem.displayName} key={`${idx}`}>
          {map(configItem.children, (childConfigItem, idx) => {
            return (
              <AttributeTree
                {...this.props}
                key={`${idx}`}
                config={childConfigItem}
              />
            );
          })}
        </Tabs.TabPane>
      );
    });
  };
  render() {
    const { config } = this.props;
    return (
      <Tabs className="flex-tabs">{this.renderTabPane(config.children)}</Tabs>
    );
  }
}
