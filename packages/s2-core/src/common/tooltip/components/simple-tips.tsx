import { TooltipTipsOptions } from '@/common/interface';
import * as React from 'react';
import { TOOLTIP_PREFIX_CLS } from '../constant';

const SimpleTips = (props: TooltipTipsOptions) => {
  const { tips = '' } = props;

  return <div className={`${TOOLTIP_PREFIX_CLS}-tips`}>{tips}</div>;
};

export default SimpleTips;
