import React from 'react';
import { TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { TooltipInfosProps } from '../interface';

export const TooltipInfos = (props: TooltipInfosProps) => {
  const { infos = '' } = props;

  return <div className={`${TOOLTIP_PREFIX_CLS}-infos`}>{infos}</div>;
};
