import React from 'react';
import cls from 'classnames';
import { first, get, isEmpty, last } from 'lodash';
import { isUpDataValue, MultiData } from '@antv/s2';
import { CustomTooltipProps } from './interface';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './index.module.less';

export const DataTooltip: React.FC<CustomTooltipProps> = ({
  cell,
  defaultTooltipShowOptions,
}) => {
  const meta = cell.getMeta();
  const currentRow = last(defaultTooltipShowOptions.data?.headInfo?.rows);
  const rowName = currentRow?.value;
  const [value, ...derivedValues] =
    first((meta.fieldValue as MultiData)?.values) || [];
  const { placeholder, style } = meta.spreadsheet.options;
  const valuesCfg = style.cellCfg?.valuesCfg;
  const originalValue = get(meta.fieldValue, valuesCfg?.originalValueField);

  return (
    <div className={cls(styles.strategySheetTooltip, styles.data)}>
      <div className={styles.header}>
        <span className={styles.label}>{rowName}</span>
        <span>{value ?? placeholder}</span>
      </div>
      <div className={styles.originalValue}>
        {originalValue?.[0]?.[0] || placeholder}
      </div>
      {!isEmpty(derivedValues) && (
        <>
          <div className={styles.divider}></div>
          <ul className={styles.derivedValues}>
            {derivedValues.map((derivedValue, i) => {
              const isUp = isUpDataValue(derivedValue);
              return (
                <li className={styles.value} key={i}>
                  <span className={styles.derivedValueLabel}>
                    {valuesCfg?.fieldLabels?.[0][i + 1]}
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
