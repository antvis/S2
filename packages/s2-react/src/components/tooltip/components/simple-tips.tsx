import React from 'react';
import { TooltipNameTipsOptions, TOOLTIP_PREFIX_CLS } from '@antv/s2';

export const SimpleTips = (props: TooltipNameTipsOptions) => {
  const { tips = '', name = '' } = props;

  return (
    <>
      {name && <div className={`${TOOLTIP_PREFIX_CLS}-name`}>{name}</div>}
      {tips && <div className={`${TOOLTIP_PREFIX_CLS}-tips`}>{tips}</div>}
    </>
  );
};
