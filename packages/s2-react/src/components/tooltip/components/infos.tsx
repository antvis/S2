import React from 'react';
import { InfosProps, TOOLTIP_PREFIX_CLS } from '@antv/s2';

export const Infos = (props: InfosProps) => {
  const { infos = '' } = props;

  return <div className={`${TOOLTIP_PREFIX_CLS}-infos`}>{infos}</div>;
};
