import * as React from 'react';
import { ListItem, HeadInfo } from '@/common/interface';
import { TOOLTIP_CLASS_PRE } from '../constant';

const TooltipHeadInfo = (props: HeadInfo) => {
  const { rows = [], cols = [] } = props;

  return (
    <div className={`${TOOLTIP_CLASS_PRE}-head-info-list`}>
      {cols.map((item: ListItem) => item.value)?.join('/')}
      {cols.length > 0 && rows.length > 0 && '，'}
      {rows.map((item: ListItem) => item.value)?.join('/')}
    </div>
  );
};

export default TooltipHeadInfo;
