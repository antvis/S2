import { ListItem, TooltipDetailProps } from '@/common/interface';
import React from 'react';
import { HtmlIcon } from '@/common/icons';
import { TOOLTIP_PREFIX_CLS } from '@/common/tooltip/constant';

const TooltipDetail = (props: TooltipDetailProps) => {
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
              {icon ? <HtmlIcon type={icon} width={8} height={7} /> : null}{' '}
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TooltipDetail;
