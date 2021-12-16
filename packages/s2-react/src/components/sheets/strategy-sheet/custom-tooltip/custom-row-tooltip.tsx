import React from 'react';
import cls from 'classnames';
import { CustomTooltipProps } from './interface';
import styles from './index.module.less';
import { i18n } from '@/common/i18n';

export const RowTooltip: React.FC<CustomTooltipProps> = ({ cell }) => {
  const meta = cell.getMeta();
  return (
    <div className={cls(styles.strategySheetTooltip, styles.row)}>
      <div className={styles.value}>{meta.value}</div>
      <div>{i18n('说明')}: 暂无说明</div>
    </div>
  );
};
