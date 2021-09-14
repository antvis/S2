import * as React from 'react';
import { TooltipNameTipsOptions } from '@/common/interface';
import { TOOLTIP_PREFIX_CLS } from '@/common/constant/tooltip';

export const SimpleTips = (props: TooltipNameTipsOptions) => {
  const { tips = '', name = '' } = props;

  return (
    <>
      {name && <div className={`${TOOLTIP_PREFIX_CLS}-name`}>{name}</div>}
      {(name || tips) && (
        <div className={`${TOOLTIP_PREFIX_CLS}-tips`}>{tips}</div>
      )}
    </>
  );
};
