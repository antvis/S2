import { TOOLTIP_PREFIX_CLS, type TooltipNameTipsOptions } from '@antv/s2';
import React from 'react';

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
