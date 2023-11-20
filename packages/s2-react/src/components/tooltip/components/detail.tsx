import React from 'react';
import {
  type TooltipDetailListItem,
  type TooltipDetailProps,
  TOOLTIP_PREFIX_CLS,
} from '@antv/s2';
import { TooltipIcon } from './icon';

export const TooltipDetail: React.FC<TooltipDetailProps> = React.memo(
  (props: TooltipDetailProps) => {
    const { list = [] } = props;

    return (
      <div className={`${TOOLTIP_PREFIX_CLS}-detail-list`}>
        {list?.map((listItem: TooltipDetailListItem, idx) => {
          const { name, value, icon } = listItem;

          return (
            <div
              key={`${value}-${idx}`}
              className={`${TOOLTIP_PREFIX_CLS}-detail-item`}
            >
              <span className={`${TOOLTIP_PREFIX_CLS}-detail-item-key`}>
                {name}
              </span>
              <span
                className={`${TOOLTIP_PREFIX_CLS}-detail-item-val ${TOOLTIP_PREFIX_CLS}-highlight`}
              >
                {icon && (
                  <TooltipIcon
                    icon={icon as React.ReactNode}
                    width={8}
                    height={7}
                  />
                )}
                {value}
              </span>
            </div>
          );
        })}
      </div>
    );
  },
);

TooltipDetail.displayName = 'TooltipDetail';
