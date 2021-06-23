import * as React from 'react';
import { TipsProps } from '@/common/interface';
import { TOOLTIP_CLASS_PRE } from '../constant';

const SimpleTips = (props: TipsProps) => {
  const { tips = '' } = props;

  return <div className={`${TOOLTIP_CLASS_PRE}-tips`}>{tips}</div>;
};

export default SimpleTips;
