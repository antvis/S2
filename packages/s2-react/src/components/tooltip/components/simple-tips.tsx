import React from 'react';
import { type TooltipNameTipsOptions, TOOLTIP_PREFIX_CLS } from '@antv/s2';

export const TooltipSimpleTips: React.FC<TooltipNameTipsOptions> = React.memo(
  (props) => {
    const { tips = '', name = '' } = props;

    return (
      <>
        {name && <div className={`${TOOLTIP_PREFIX_CLS}-name`}>{name}</div>}
        {tips && <div className={`${TOOLTIP_PREFIX_CLS}-tips`}>{tips}</div>}
      </>
    );
  },
);

TooltipSimpleTips.displayName = 'TooltipSimpleTips';
