import { i18n } from '@antv/s2';
import cls from 'classnames';
import React from 'react';
import styles from './index.module.less';
import { CustomTooltipProps } from './interface';

export const RowTooltip: React.FC<CustomTooltipProps> = ({ cell }) => {
  const { field, spreadsheet, value, extra } = cell.getMeta();

  const description = React.useMemo(() => {
    // 如果是自定义树, 描述信息在每一个节点上
    return spreadsheet.dataSet.getFieldDescription(field) || extra?.description;
  }, [extra?.description, field, spreadsheet.dataSet]);

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
