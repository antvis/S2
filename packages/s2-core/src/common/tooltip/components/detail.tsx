import * as React from 'react';
import { HtmlIcon } from '../../icons';
import { DetailProps, ListItem } from '@/common/interface';
import { TOOLTIP_CLASS_PRE } from '../constant';

const TooltipDetail = (props: DetailProps) => {
  const { list = [] } = props;

  return (
    <div className={`${TOOLTIP_CLASS_PRE}-detail-list`}>
      {list.map((listItem: ListItem, idx) => {
        const { name, value, icon } = listItem;

        return (
          <div
            key={`${value}-${idx}`}
            className={`${TOOLTIP_CLASS_PRE}-detail-item`}
          >
            <span className={`${TOOLTIP_CLASS_PRE}-detail-item-key`}>
              {name}
            </span>
            <span
              className={`${TOOLTIP_CLASS_PRE}-detail-item-val ${TOOLTIP_CLASS_PRE}-highlight`}
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
