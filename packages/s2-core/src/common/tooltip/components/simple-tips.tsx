import { TooltipNameTipsOptions } from '@/common/interface';
import * as React from 'react';
import { TOOLTIP_PREFIX_CLS } from '@/common/tooltip/constant';

const SimpleTips = (props: TooltipNameTipsOptions) => {
  const { tips = '', name = '' } = props;

  return (
    <>
      {name && <div className={`${TOOLTIP_PREFIX_CLS}-name`}>{name}</div>}
      {tips && <div className={`${TOOLTIP_PREFIX_CLS}-tips`}>{tips}</div>}
    </>
  );
};

export default SimpleTips;
