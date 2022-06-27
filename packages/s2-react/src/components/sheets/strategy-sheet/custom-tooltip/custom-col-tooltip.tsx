import cls from 'classnames';
import React from 'react';
import { getTooltipClsName as tooltipCls } from '../utils';
import type { CustomTooltipProps } from './interface';

import './index.less';

export const ColTooltip: React.FC<CustomTooltipProps> = ({ cell }) => {
  const meta = cell.getMeta();

  // 趋势分析表叶子节点显示是指标标题, tooltip 中没必要再显示了
  if (meta.isLeaf && meta.level !== 0) {
    return null;
  }

  const cellName = meta.spreadsheet.dataSet.getFieldName(meta.field);

  return (
    <div className={cls(tooltipCls(), tooltipCls('col'))}>
      <span className={tooltipCls('name')}>{cellName}</span>
      <span className={tooltipCls('value')}>{meta.value}</span>
    </div>
  );
};
