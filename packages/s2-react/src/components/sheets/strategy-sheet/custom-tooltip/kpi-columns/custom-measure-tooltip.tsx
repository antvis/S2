import cls from 'classnames';
import React from 'react';
import { first } from 'lodash';
import {
  type ViewMeta,
  type MultiData,
  type SimpleDataItem,
  i18n,
} from '@antv/s2';
import type { CustomTooltipProps } from '../interface';
import { KPI_TYPES_CONFIG } from '../../constants/config';
import { getColName, getRowName } from '../../utils';

import styles from '../index.module.less';

export const KpiMeasureTooltip: React.FC<CustomTooltipProps> = ({ cell }) => {
  const meta = cell.getMeta() as ViewMeta;
  const metaFieldValue = meta.fieldValue as unknown as MultiData<
    SimpleDataItem[][]
  >;

  if (!metaFieldValue) {
    return null;
  }

  const rowName = getRowName(meta);
  const colName = getColName(meta);
  const [value] = first(metaFieldValue?.values) || [metaFieldValue];
  const kpiConfig = KPI_TYPES_CONFIG[metaFieldValue?.kpiType as string];

  return (
    <div className={cls(styles.strategySheetTooltip, styles.kpiMeasure)}>
      <div className={styles.title}>{colName}</div>
      <div className={styles.content}>
        <li className={styles.item}>
          <span className={styles.label}>{i18n('时间')}</span>
          <span className={styles.value}>{colName}</span>
        </li>
        <li className={styles.item}>
          <span className={styles.label}>{i18n('指标')}</span>
          <span className={styles.value}>{rowName}</span>
        </li>
        <li className={styles.item}>
          <span className={styles.label}>{i18n('目标值')}</span>
          <span className={styles.value}>{value}</span>
        </li>
      </div>
      <div className={styles.divider} />
      <pre className={styles.desc}>{kpiConfig?.desc}</pre>
    </div>
  );
};
