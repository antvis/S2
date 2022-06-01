import { getIcon, TooltipIconProps } from '@antv/s2';
import React from 'react';
import { HtmlIcon } from '../../../common/icons';
import { ReactElement } from '../../../common/react-element';

export const TooltipIcon: React.FC<TooltipIconProps> = (props) => {
  const { icon, ...attrs } = props;

  if (!icon) {
    return null;
  }

  if (getIcon(icon as string)) {
    const name = icon as string;

    return <HtmlIcon name={name} {...attrs} />;
  }
  return <ReactElement content={icon} {...attrs} />;
};
