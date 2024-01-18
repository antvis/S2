import React from 'react';
import { i18n, TOOLTIP_PREFIX_CLS } from '@antv/s2';

interface TooltipDescriptionProps {
  description: React.ReactNode;
}

export const TooltipDescription: React.FC<TooltipDescriptionProps> = React.memo(
  ({ description }) => (
    <>
      {description && (
        <div className={`${TOOLTIP_PREFIX_CLS}-description`}>
          {i18n('说明')}
          {description}
        </div>
      )}
    </>
  ),
);

TooltipDescription.displayName = 'TooltipDescription';
