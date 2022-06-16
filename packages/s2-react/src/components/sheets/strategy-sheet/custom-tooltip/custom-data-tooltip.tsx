import {
  getEmptyPlaceholder,
  isUpDataValue,
  type MultiData,
  type ViewMeta,
} from '@antv/s2';
import cls from 'classnames';
import { find, first, get, isEmpty, isNil } from 'lodash';
import React from 'react';
import { useRowName } from '../hooks/useRowName';
import styles from './index.module.less';
import type { CustomTooltipProps } from './interface';

export const DataTooltip: React.FC<CustomTooltipProps> = ({ cell }) => {
  const meta = cell.getMeta() as ViewMeta;
  const metaFieldValue = meta?.fieldValue as MultiData;

  const currentLeafCol = React.useMemo(
    () =>
      find(meta.spreadsheet.getColumnNodes(), {
        colIndex: meta.colIndex,
        isLeaf: true,
      }),
    [meta],
  );

  const [, ...derivedLabels] = React.useMemo(() => {
    try {
      return JSON.parse(currentLeafCol.value);
    } catch {
      return [];
    }
  }, [currentLeafCol.value]);

  const rowName = useRowName(meta);

  const [value, ...derivedValues] = first(metaFieldValue?.values) || [
    metaFieldValue,
  ];

  const { placeholder, style } = meta.spreadsheet.options;
  const emptyPlaceholder = getEmptyPlaceholder(meta, placeholder);
  const valuesCfg = style.cellCfg?.valuesCfg;
  const originalValue = get(metaFieldValue, valuesCfg?.originalValueField);

  return (
    <div className={cls(styles.strategySheetTooltip, styles.data)}>
      <div className={styles.header}>
        <span className={styles.label}>{rowName}</span>
        <span>{value ?? emptyPlaceholder}</span>
      </div>
      <div className={styles.originalValue}>
        {isNil(originalValue?.[0]?.[0])
          ? emptyPlaceholder
          : originalValue?.[0]?.[0]}
      </div>
      {!isEmpty(derivedValues) && (
        <>
          <div className={styles.divider} />
          <ul className={styles.derivedValues}>
            {derivedValues.map((derivedValue, i) => {
              const isNormal = isNil(derivedValue);
              const isUp = isUpDataValue(derivedValue as string);
              const isDown = !isNormal && !isUp;

              return (
                <li className={styles.value} key={i}>
                  <span className={styles.derivedValueLabel}>
                    {derivedLabels[i]}
                  </span>
                  <span
                    className={cls(styles.derivedValueGroup, {
                      [styles.up]: isUp,
                      [styles.down]: isDown,
                    })}
                  >
                    {!isNormal && <span className={styles.icon}></span>}
                    <span className={styles.value}>
                      {derivedValue ?? emptyPlaceholder}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};
