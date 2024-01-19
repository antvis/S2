import { i18n, Node } from '@antv/s2';
import cls from 'classnames';
import React from 'react';
import { getStrategySheetTooltipClsName as tooltipCls } from '@antv/s2-shared';
import { isFunction } from 'lodash';
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
