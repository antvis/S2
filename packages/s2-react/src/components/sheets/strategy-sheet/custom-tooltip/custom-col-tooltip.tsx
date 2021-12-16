import React from 'react';
import cls from 'classnames';
import { CustomTooltipProps } from './interface';
import styles from './index.module.less';

export const ColTooltip: React.FC<CustomTooltipProps> = ({ cell }) => {
  const meta = cell.getMeta();
  const cellName = meta.spreadsheet.dataSet.getFieldName(meta.field);
  return (
    <div className={cls(styles.strategySheetTooltip, styles.col)}>
      <span className={styles.name}>{cellName}</span>
      <span className={styles.col}>{meta.value}</span>
    </div>
  );
};
