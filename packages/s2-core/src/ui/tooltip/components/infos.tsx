import React from 'react';
import { InfosProps } from '@/common/interface';
import { TOOLTIP_PREFIX_CLS } from '@/common/constant/tooltip';

export const Infos = (props: InfosProps) => {
  const { infos = '' } = props;

  return <div className={`${TOOLTIP_PREFIX_CLS}-infos`}>{infos}</div>;
};
