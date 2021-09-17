import React from 'react';
import { DEFAULT_ICON_PROPS } from '@/common/constant/tooltip';
import { IconProps } from '@/common/interface/tooltip';
import { getIcon, HtmlIcon } from '@/common/icons';

export const Icon = (props: IconProps) => {
  const { icon, ...styles } = props;

  if (getIcon(icon as string)) {
    const type = icon as string;

    return <HtmlIcon type={type} {...DEFAULT_ICON_PROPS} {...styles} />;
  }
  const Component = icon as React.ComponentClass;
  return icon && <Component {...DEFAULT_ICON_PROPS} {...styles} />;
};
