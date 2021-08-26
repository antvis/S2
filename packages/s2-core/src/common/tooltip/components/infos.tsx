import React from 'react';
import { InfosProps } from '@/common/interface';
import { TOOLTIP_PREFIX_CLS } from '../constant';

const Infos = (props: InfosProps) => {
  const { infos = '' } = props;

  return <div className={`${TOOLTIP_PREFIX_CLS}-infos`}>{infos}</div>;
};

export default Infos;
