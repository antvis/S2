import React from 'react';
import cls from 'classnames';
import { find, first, get, isEmpty, isNil } from 'lodash';
import { isUpDataValue, MultiData } from '@antv/s2';
import { CustomTooltipProps } from './interface';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './index.module.less';

export const DataTooltip: React.FC<CustomTooltipProps> = ({ cell }) => {
  const meta = cell.getMeta();

  const currentRow = React.useMemo(
    () =>
      find(meta.spreadsheet.getRowNodes(), {
        rowIndex: meta.rowIndex,
      }),
    [meta],
  );

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

  const rowName = meta.spreadsheet.dataSet.getFieldName(
    currentRow?.valueFiled || currentRow?.value,
  );

  const [value, ...derivedValues] = first(
    (meta.fieldValue as MultiData)?.values,
  ) || [meta.fieldValue];

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
              const isNormal = isNil(derivedValue);
              const isUp = isUpDataValue(derivedValue);
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
