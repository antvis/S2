import React from 'react';
import cls from 'classnames';
import { first, get, isEmpty, last } from 'lodash';
import { isUpDataValue } from '@antv/s2';
import { CustomTooltipProps } from './interface';
import styles from './index.module.less';

export const DataTooltip: React.FC<CustomTooltipProps> = ({
  cell,
  defaultTooltipShowOptions,
  valuesConfig,
}) => {
  const meta = cell.getMeta();
  const currentRow = last(defaultTooltipShowOptions.data.headInfo.rows);
  const rowName = currentRow.value;
  const [value, ...derivedValues] = first(meta.fieldValue?.values) || [];
  const originalValue = get(meta.fieldValue, valuesConfig?.originalValueField);
  const { placeholder } = meta.spreadsheet.options;

  return (
    <div className={cls(styles.strategySheetTooltip, styles.data)}>
      <div className={styles.header}>
        <span className={styles.label}>{rowName}</span>
        <span>{value ?? placeholder}</span>
      </div>
      <div className={styles.originalValue}>{originalValue ?? placeholder}</div>
      {!isEmpty(derivedValues) && (
        <>
          <div className={styles.divider}></div>
          <ul className={styles.derivedValues}>
            {derivedValues.map((derivedValue, i) => {
              const isUp = isUpDataValue(derivedValue);
              return (
                <li className={styles.value} key={i}>
                  <span className={styles.derivedValueLabel}>
                    {valuesConfig?.fields?.[i + 1]?.label}
                  </span>
                  <span
                    className={cls(styles.derivedValueGroup, {
                      [styles.up]: isUp,
                      [styles.down]: !isUp,
                    })}
                  >
                    <span className={styles.icon}></span>
                    <span className={styles.value}>
                      {derivedValue ?? placeholder}
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
