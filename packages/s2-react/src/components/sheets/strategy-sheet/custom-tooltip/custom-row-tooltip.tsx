import React from 'react';
import cls from 'classnames';
import { CustomTooltipProps } from './interface';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './index.module.less';
import { i18n } from '@/common/i18n';

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
