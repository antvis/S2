import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { map } from 'lodash';
import { AttributeTree } from '../../attribute-tree';
import { AttributeTreeProps, AttributeComponentProps } from '../../types';
import './index.less';

export class Tab extends PureComponent<AttributeTreeProps> {
  renderTabPane = (childrenConfig: AttributeComponentProps[]) => {
    return map(childrenConfig, (configItem, idx) => {
      const { displayName, children } = configItem;

      return (
        <Tabs.TabPane tab={displayName} key={`${displayName}-${idx}`}>
          {map(children, (childConfigItem, idx) => {
            return (
              <AttributeTree
                {...this.props}
                key={`${childConfigItem.displayName}-${idx}`}
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
