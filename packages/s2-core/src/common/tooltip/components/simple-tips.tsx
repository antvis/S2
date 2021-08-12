import { TooltipTipsOptions } from '@/common/interface';
import * as React from 'react';
import { TOOLTIP_CLASS_PRE } from '../constant';

const SimpleTips = (props: TooltipTipsOptions) => {
  const { tips = '' } = props;

  return <div className={`${TOOLTIP_CLASS_PRE}-tips`}>{tips}</div>;
};

export default SimpleTips;
