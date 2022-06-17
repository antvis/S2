import { i18n, Node } from '@antv/s2';
import cls from 'classnames';
import React from 'react';
import styles from './index.module.less';
import type { CustomTooltipProps } from './interface';

export const RowTooltip: React.FC<CustomTooltipProps> = ({ cell }) => {
  const { field, spreadsheet, value, extra } = cell.getMeta() as Node;

  const description =
    spreadsheet.dataSet.getFieldDescription(field) || extra?.description;

  return (
    <div className={cls(styles.strategySheetTooltip, styles.row)}>
      <div className={styles.value}>{value}</div>
      {description && (
        <div>
          {i18n('说明')}: {description}
        </div>
      )}
    </div>
  );
};
