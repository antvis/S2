import { i18n, Node } from '@antv/s2';
import cls from 'classnames';
import React from 'react';
import { getTooltipClsName as tooltipCls } from '../utils';
import type { CustomTooltipProps } from './interface';

import './index.less';

export const RowTooltip: React.FC<CustomTooltipProps> = ({ cell }) => {
  const { field, spreadsheet, value, extra } = cell.getMeta() as Node;

  const description =
    spreadsheet.dataSet.getFieldDescription(field) || extra?.description;

  return (
    <div className={cls(tooltipCls(), tooltipCls('row'))}>
      <div className={tooltipCls('value')}>{value}</div>
      {description && (
        <div>
          {i18n('说明')}: {description}
        </div>
      )}
    </div>
  );
};
