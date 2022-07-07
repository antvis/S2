import { i18n, Node } from '@antv/s2';
import cls from 'classnames';
import React from 'react';
import { getStrategySheetTooltipClsName as tooltipCls } from '@antv/s2-shared';
import type { CustomTooltipProps } from './interface';

import './index.less';

export const StrategySheetRowTooltip: React.FC<CustomTooltipProps> = ({
  cell,
  label,
}) => {
  const { field, spreadsheet, value, extra } = cell.getMeta() as Node;
  const rowName = label ?? value;
  const description =
    spreadsheet.dataSet.getFieldDescription(field) || extra?.description;

  return (
    <div className={cls(tooltipCls(), tooltipCls('row'))}>
      <div className={tooltipCls('value')}>{rowName}</div>
      {description && (
        <div>
          {i18n('说明')}: {description}
        </div>
      )}
    </div>
  );
};
