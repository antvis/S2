import React from 'react';
import { ListItem, TooltipHeadInfo, TOOLTIP_PREFIX_CLS } from '@antv/s2';

export const TooltipHead = (props: TooltipHeadInfo) => {
  const { rows = [], cols = [] } = props;

  return (
    <div className={`${TOOLTIP_PREFIX_CLS}-head-info-list`}>
      {cols.map((item: ListItem) => item.value)?.join('/')}
      {cols.length > 0 && rows.length > 0 && '，'}
      {rows.map((item: ListItem) => item.value)?.join('/')}
    </div>
  );
};
