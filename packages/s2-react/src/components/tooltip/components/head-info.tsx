import React from 'react';
import {
  type TooltipDetailListItem,
  type TooltipHeadInfo,
  TOOLTIP_PREFIX_CLS,
} from '@antv/s2';

export const TooltipHead: React.FC<TooltipHeadInfo> = (props) => {
  const { rows = [], cols = [] } = props;

  return (
    <div className={`${TOOLTIP_PREFIX_CLS}-head-info-list`}>
      {cols.map((item: TooltipDetailListItem) => item.value)?.join('/')}
      {cols.length > 0 && rows.length > 0 && '，'}
      {rows.map((item: TooltipDetailListItem) => item.value)?.join('/')}
    </div>
  );
};
