import {
  i18n,
  Node,
  getStrategySheetTooltipClsName as tooltipCls,
} from '@antv/s2';
import cls from 'classnames';
import { isFunction } from 'lodash';
import React from 'react';
import type { CustomTooltipProps } from './interface';

import './index.less';

export const StrategySheetRowCellTooltip: React.FC<CustomTooltipProps> = ({
  cell,
  label,
}) => {
  const { field, spreadsheet, value, extra } = cell.getMeta() as Node;
  const customLabel = isFunction(label) ? label(cell, value) : label;
  const rowName = customLabel ?? value;
  const description =
    spreadsheet.dataSet.getFieldDescription(field) || extra?.['description'];

  return (
    <div className={cls(tooltipCls(), tooltipCls('row'))}>
      <div className={tooltipCls('value')}>{rowName}</div>
      {description && (
        <div className={tooltipCls('description')}>
          <span className={tooltipCls('description-label')}>
            {i18n('说明')}
          </span>
          <span className={tooltipCls('description-text')}>{description}</span>
        </div>
      )}
    </div>
  );
};
