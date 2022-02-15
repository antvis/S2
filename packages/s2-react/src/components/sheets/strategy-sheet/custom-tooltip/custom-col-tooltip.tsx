import React from 'react';
import cls from 'classnames';
import { CustomTooltipProps } from './interface';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './index.module.less';

export const ColTooltip: React.FC<CustomTooltipProps> = ({ cell }) => {
  const meta = cell.getMeta();

  // 趋势分析表叶子节点显示是指标标题, tooltip 中没必要再显示了
  if (meta.isLeaf && meta.level !== 0) {
    return null;
  }

  const cellName = meta.spreadsheet.dataSet.getFieldName(meta.field);

  return (
    <div className={cls(styles.strategySheetTooltip, styles.col)}>
      <span className={styles.name}>{cellName}</span>
      <span className={styles.col}>{meta.value}</span>
    </div>
  );
};
