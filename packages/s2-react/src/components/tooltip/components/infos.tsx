import React from 'react';
import { TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { InfosProps } from '../interface';

export const Infos = (props: InfosProps) => {
  const { infos = '' } = props;

  return <div className={`${TOOLTIP_PREFIX_CLS}-infos`}>{infos}</div>;
};
