import React from 'react';
import cls from 'classnames';
import { first, get, isEmpty, last } from 'lodash';
import { EMPTY_PLACEHOLDER } from '@antv/s2';
import { isUpDerivedValue } from '../../../../utils/strategy';
import { CustomTooltipProps } from './interface';
import styles from './index.module.less';

export const DataTooltip: React.FC<CustomTooltipProps> = ({
  cell,
  detail,
  valuesConfig,
}) => {
  const meta = cell.getMeta();
  const currentRow = last(detail.data.headInfo.rows);
  const rowName = currentRow.value;
  const [value, ...derivedValues] = first(meta.fieldValue?.values) || [];
  const originalValue = get(meta.fieldValue, valuesConfig?.originalValueKey);

  return (
    <div className={cls(styles.strategySheetTooltip, styles.data)}>
      <div className={styles.header}>
        <span className={styles.label}>{rowName}</span>
        <span>{value ?? EMPTY_PLACEHOLDER}</span>
      </div>
      <div className={styles.originalValue}>
        {originalValue ?? EMPTY_PLACEHOLDER}
      </div>
      {!isEmpty(derivedValues) && (
        <>
          <div className={styles.divider}></div>
          <ul className={styles.derivedValues}>
            {derivedValues.map((derivedValue, i) => {
              const isUp = isUpDerivedValue(derivedValue);
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
                      {derivedValue ?? EMPTY_PLACEHOLDER}
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
