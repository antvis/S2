import React from 'react';
import { i18n, TOOLTIP_PREFIX_CLS } from '@antv/s2';

interface TooltipDescriptionProps {
  description: string;
}

export const TooltipDescription: React.FC<TooltipDescriptionProps> = ({
  description,
}) => {
  return (
    <>
      {description && (
        <div className={`${TOOLTIP_PREFIX_CLS}-description`}>
          {i18n('说明')}
          {description}
        </div>
      )}
    </>
  );
};
