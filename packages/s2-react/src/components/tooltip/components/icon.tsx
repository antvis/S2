import React from 'react';
import { DEFAULT_ICON_PROPS, IconProps, getIcon } from '@antv/s2';
import { HtmlIcon } from '@/common/icons';

export const Icon = (props: IconProps) => {
  const { icon, ...attrs } = props;

  if (!icon) {
    return null;
  }

  if (getIcon(icon as string)) {
    const name = icon as string;

    return <HtmlIcon name={name} {...DEFAULT_ICON_PROPS} {...attrs} />;
  }
  const Component = icon as React.ComponentClass;
  return <Component {...DEFAULT_ICON_PROPS} {...attrs} />;
};
