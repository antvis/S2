import { TooltipNameTipsOptions } from '@/common/interface';
import * as React from 'react';
import { TOOLTIP_CLASS_PRE } from '../constant';

const SimpleTips = (props: TooltipNameTipsOptions) => {
  const { tips = '', name = '' } = props;

  return (
    <>
      {name && <div className={`${TOOLTIP_CLASS_PRE}-name`}>{name}</div>}
      {tips && <div className={`${TOOLTIP_CLASS_PRE}-tips`}>{tips}</div>}
    </>
  );
};

export default SimpleTips;
