import React from 'react';
import {
  type TooltipDetailListItem,
  type TooltipHeadInfo,
  TOOLTIP_PREFIX_CLS,
  i18n,
} from '@antv/s2';

export const TooltipHead: React.FC<TooltipHeadInfo> = React.memo((props) => {
  const { rows = [], cols = [] } = props;

  return (
    <div className={`${TOOLTIP_PREFIX_CLS}-head-info-list`}>
<<<<<<< HEAD
      {cols.map((item: TooltipDetailListItem) => item.value)?.join(` / `)}
      {cols.length > 0 && rows.length > 0 && '，'}
      {rows.map((item: TooltipDetailListItem) => item.value)?.join(` / `)}
=======
      {cols.map((item: TooltipDetailListItem) => item.value)?.join('/')}
      {cols.length > 0 && rows.length > 0 && i18n('，')}
      {rows.map((item: TooltipDetailListItem) => item.value)?.join('/')}
>>>>>>> origin/master
    </div>
  );
});

TooltipHead.displayName = 'TooltipHead';
