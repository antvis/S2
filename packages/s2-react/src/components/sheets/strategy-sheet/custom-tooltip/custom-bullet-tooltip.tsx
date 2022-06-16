import {
  getBulletRangeColor,
  transformRatioToPercent,
  type BulletTheme,
  type BulletValue,
  type MultiData,
  type ViewMeta,
} from '@antv/s2';
import cls from 'classnames';
import React from 'react';
import { useRowName } from '../hooks/useRowName';
import styles from './index.module.less';
import type { CustomTooltipProps } from './interface';

export const BulletTooltip: React.FC<CustomTooltipProps> = ({ cell }) => {
  const meta = cell.getMeta() as ViewMeta;
  const bulletValue = meta.fieldValue as unknown as MultiData<BulletValue>;

  const { target, measure } = bulletValue?.values || {};
  // 目标百分比
  const targetPercent = transformRatioToPercent(target);
  // 当前百分比
  const currentPercent = transformRatioToPercent(measure);

  // 当前子弹图进度颜色
  const bulletStyle = cell.getStyle('bullet') as BulletTheme;
  const currentLegendColor = getBulletRangeColor(
    measure,
    target,
    bulletStyle?.rangeColors,
  );

  const rowName = useRowName(meta);

  return (
    <div className={cls(styles.strategySheetTooltip, styles.bullet)}>
      <div className={styles.title}>{rowName}</div>
      <div className={styles.progress}>
        <li className={cls(styles.item, styles.current)}>
          <span className={styles.label}>
            <span
              className={styles.legend}
              style={{
                backgroundColor: currentLegendColor,
              }}
            />
            实际完成度
          </span>
          <span className={styles.value}>{currentPercent}</span>
        </li>
        <li className={cls(styles.item, styles.target)}>
          <span className={styles.label}>
            <span className={styles.legend} />
            目标值
          </span>
          <span className={styles.value}>{targetPercent}</span>
        </li>
      </div>
      <div className={styles.divider} />
      <ul className={styles.desc}>
        <li>绿色：实际完成度落后时间进度 10%（包含）以内或超出时间进度</li>
        <li>黄色：实际完成度慢于时间进度 10%-20%</li>
        <li>红色：实际完成度慢于时间进度 20% 以上li或者为负数</li>
      </ul>
    </div>
  );
};
