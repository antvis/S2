import React from 'react';
import { InfosProps } from '@/common/interface';
import { TOOLTIP_CLASS_PRE } from '../constant';

const Infos = (props: InfosProps) => {
  const { infos = '' } = props;

  return <div className={`${TOOLTIP_CLASS_PRE}-infos`}>{infos}</div>;
};

export default Infos;
