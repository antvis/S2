import { ListItem, TooltipHeadInfo } from '@/common/interface';
import * as React from 'react';
import { TOOLTIP_PREFIX_CLS } from '@/common/tooltip/constant';

const TooltipHeadInfo = (props: TooltipHeadInfo) => {
  const { rows = [], cols = [] } = props;

  return (
    <div className={`${TOOLTIP_PREFIX_CLS}-head-info-list`}>
      {cols.map((item: ListItem) => item.value)?.join('/')}
      {cols.length > 0 && rows.length > 0 && '，'}
      {rows.map((item: ListItem) => item.value)?.join('/')}
    </div>
  );
};

export default TooltipHeadInfo;
