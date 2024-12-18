import {
  TOOLTIP_PREFIX_CLS,
  i18n,
  type TooltipDetailListItem,
  type TooltipHeadInfo,
} from '@antv/s2';
import React from 'react';

export const TooltipHead: React.FC<TooltipHeadInfo> = React.memo((props) => {
  const { rows = [], cols = [] } = props;

  return (
    <div className={`${TOOLTIP_PREFIX_CLS}-head-info-list`}>
      {cols.map((item: TooltipDetailListItem) => item.value)?.join('/')}
      {cols.length > 0 && rows.length > 0 && i18n('，')}
      {rows.map((item: TooltipDetailListItem) => item.value)?.join('/')}
    </div>
  );
});

TooltipHead.displayName = 'TooltipHead';
