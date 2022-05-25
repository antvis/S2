import React from 'react';
import { TOOLTIP_PREFIX_CLS } from '@antv/s2';
import type { TooltipInfosProps } from '../interface';

export const TooltipInfos: React.FC<TooltipInfosProps> = (props) => {
  const { infos = '' } = props;

  return <div className={`${TOOLTIP_PREFIX_CLS}-infos`}>{infos}</div>;
};
