import React, { PureComponent } from 'react';
import {
  map,
  camelCase,
  filter,
  get,
  forEach,
  includes,
  isEmpty,
} from 'lodash';
import configComponents from './config-component';
import { AttributeTreeProps, AttributeComponentProps } from './types';

function titleCase(type: string) {
  const s = camelCase(type);

  return s ? `${s[0].toUpperCase()}${s.substring(1)}` : s;
}

export class AttributeTree extends PureComponent<AttributeTreeProps> {
  renderChildren = (children: AttributeTreeProps['config']['children']) => {
    return map(children, (child, idx) => {
      return (
        <AttributeTree
          {...this.props}
          key={`${child.displayName}-${idx}`}
          config={child}
        />
      );
    });
  };

  getStatus = (
    config: AttributeComponentProps,
    relations: any,
    attributes: object,
  ) => {
    const filterRelations = filter(
      relations,
      (relation) => relation.toAttributeId === config?.attributeId,
    );
    const status: string[] = [];

    forEach(filterRelations, ({ fromAttributeId, value, operator, action }) => {
      const fromAttributeValue = get(attributes, fromAttributeId);

      if (operator === 'EQUAL' && fromAttributeValue === value) {
        status.push(action);
      } else if (operator === 'EMPTY' && isEmpty(fromAttributeValue)) {
        status.push(action);
      }
    });

    return status;
  };

  render() {
    const { config, relations, attributes } = this.props;
    const componentStatus = this.getStatus(config, relations, attributes);
    const disable = includes(componentStatus, 'disable');
    const Component = configComponents[titleCase(config.type)];

    return (
      <Component {...this.props} disable={disable}>
        {this.renderChildren(config.children)}
      </Component>
    );
  }
}
