import {
  CellTypes,
  getBulletRangeColor,
  i18n,
  transformRatioToPercent,
  type BulletValue,
  type MultiData,
  type ViewMeta,
} from '@antv/s2';
import cls from 'classnames';
import React from 'react';
import type { CustomTooltipProps } from '../interface';
import {
  getColName,
  getRowName,
  getTooltipClsName as tooltipCls,
} from '../../utils';

import '../index.less';
import type { StrategySheetProps } from '../..';

export interface KpiBulletTooltipProps extends CustomTooltipProps {
  description?: StrategySheetProps['bulletTooltipDescription'];
}

export const KpiBulletTooltip: React.FC<KpiBulletTooltipProps> = (props) => {
  const { cell, description } = props;
  const meta = cell.getMeta() as ViewMeta;
  const bulletValue = meta.fieldValue as unknown as MultiData<BulletValue>;

  if (!bulletValue) {
    return null;
  }

  const { target, measure } = bulletValue?.values || {};
  // 目标百分比
  const targetPercent = transformRatioToPercent(target);
  // 当前百分比
  const currentPercent = transformRatioToPercent(measure);

  // 当前子弹图进度颜色
  const bulletStyle = cell.getStyle(CellTypes.DATA_CELL).miniChart.bullet;
  const currentLegendColor = getBulletRangeColor(
    measure,
    target,
    bulletStyle?.rangeColors,
  );

  const rowName = getRowName(meta);
  const colName = getColName(meta);

  return (
    <div className={cls(tooltipCls(), tooltipCls('bullet'))}>
      <div className={tooltipCls('title')}>{rowName}</div>
      <div className={tooltipCls('content')}>
        <li className={cls('tooltip-bullet-item', 'bullet-current-item')}>
          <span className="tooltip-bullet-item-label">
            <span
              className="bullet-item-legend"
              style={{
                backgroundColor: currentLegendColor,
              }}
            />
            {colName}
          </span>
          <span className="tooltip-bullet-item-value">{currentPercent}</span>
        </li>
        <li className={cls('tooltip-bullet-item', 'bullet-target-item')}>
          <span className="tooltip-bullet-item-label">
            <span className="bullet-item-legend" />
            {i18n('目标值')}
          </span>
          <span className="tooltip-bullet-item-value">{targetPercent}</span>
        </li>
      </div>
      <div className={tooltipCls('divider')} />
      {description?.(cell) ?? (
        <ul className={tooltipCls('desc')}>
          <li>指标目标字段的净增目标完成度，净增目标完成度=净增值/净增目标</li>
          <li>绿色：实际完成度落后时间进度 10%（包含）以内或超出时间进度</li>
          <li>黄色：实际完成度慢于时间进度 10%-20%</li>
          <li>红色：实际完成度慢于时间进度 20% 以上li或者为负数</li>
        </ul>
      )}
    </div>
  );
};
