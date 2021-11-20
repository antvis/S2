import React from 'react';
import { ListItem, TooltipDetailProps, TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { Icon } from './icon';

export const TooltipDetail = (props: TooltipDetailProps) => {
  const { list = [] } = props;

  return (
    <div className={`${TOOLTIP_PREFIX_CLS}-detail-list`}>
      {list.map((listItem: ListItem, idx) => {
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
              {icon ? <Icon icon={icon} width={8} height={7} /> : null} {value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
