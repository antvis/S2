import React, { PureComponent } from 'react';
import { AttributeTreeProps } from '../../types';
import './index.less';

export abstract class BaseComponent extends PureComponent<AttributeTreeProps> {
  abstract renderContent(): React.ReactElement | React.ReactElement[];

  render() {
    const { config } = this.props;
    const { displayName } = config;

    return (
      <div className="attr-component">
        {displayName}
        {this.renderContent()}
      </div>
    );
  }
}
