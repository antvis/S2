import type { Node } from '@antv/s2';
import { getStrategySheetTooltipClsName as tooltipCls } from '@antv/s2';
import cls from 'classnames';
import { isFunction } from 'lodash';
import React from 'react';
import type { CustomTooltipProps } from './interface';

import './index.less';

export const StrategySheetColCellTooltip: React.FC<CustomTooltipProps> = ({
  cell,
  label,
}) => {
  const meta = cell.getMeta() as Node;

  // 趋势分析表叶子节点显示是指标标题, tooltip 中没必要再显示了
  if (meta.isLeaf && meta.level !== 0) {
    return null;
  }

  const cellName = meta.spreadsheet.dataSet.getFieldName(meta.field!);
  const customLabel = isFunction(label) ? label(cell, cellName) : label;
  const name = customLabel ?? cellName;

  return (
    <div className={cls(tooltipCls(), tooltipCls('col'))}>
      <span className={tooltipCls('name')}>{name}</span>
      <span className={tooltipCls('value')}>{meta.value}</span>
    </div>
  );
};
