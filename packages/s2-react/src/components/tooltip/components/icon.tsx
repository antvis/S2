import React from 'react';
import { IconProps, getIcon } from '@antv/s2';
import { TOOLTIP_DEFAULT_ICON_PROPS } from '../constants';
import { HtmlIcon } from '@/common/icons';
import { ReactElement } from '@/common/react-element';

export const Icon = (props: IconProps) => {
  const { icon, ...attrs } = props;

  if (!icon) {
    return null;
  }

  if (getIcon(icon as string)) {
    const name = icon as string;

    return <HtmlIcon name={name} {...TOOLTIP_DEFAULT_ICON_PROPS} {...attrs} />;
  }
  return (
    <ReactElement content={icon} {...TOOLTIP_DEFAULT_ICON_PROPS} {...attrs} />
  );
};
