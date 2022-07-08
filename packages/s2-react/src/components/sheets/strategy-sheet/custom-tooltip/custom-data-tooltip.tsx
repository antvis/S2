import {
  i18n,
  getEmptyPlaceholder,
  isUpDataValue,
  type MultiData,
  type SimpleDataItem,
  type ViewMeta,
} from '@antv/s2';
import cls from 'classnames';
import { first, get, isEmpty, isFunction, isNil } from 'lodash';
import React from 'react';
import { getStrategySheetTooltipClsName as tooltipCls } from '@antv/s2-shared';
import { getLeafColNode, getRowName, getRowDescription } from '../utils';
import type { CustomTooltipProps } from './interface';

import './index.less';

export const StrategySheetDataTooltip: React.FC<CustomTooltipProps> = ({
  cell,
  label,
}) => {
  const meta = cell.getMeta() as ViewMeta;
  const metaFieldValue = meta?.fieldValue as MultiData<SimpleDataItem[][]>;

  const rowDiscription = getRowDescription(meta);
  const defaultRowName = getRowName(meta);
  const customLabel = isFunction(label) ? label(cell, defaultRowName) : label;
  const rowName = customLabel ?? defaultRowName;
  const leftColNode = getLeafColNode(meta);

  const [, ...derivedLabels] = React.useMemo(() => {
    try {
      return JSON.parse(leftColNode?.value);
    } catch {
      return [];
    }
  }, [leftColNode?.value]);

  const [value, ...derivedValues] = first(metaFieldValue?.values) || [
    metaFieldValue,
  ];

  const { placeholder, style } = meta.spreadsheet.options;
  const emptyPlaceholder = getEmptyPlaceholder(meta, placeholder);
  const valuesCfg = style.cellCfg?.valuesCfg;
  const originalValue = get(metaFieldValue, valuesCfg?.originalValueField);

  return (
    <div className={cls(tooltipCls(), tooltipCls('data'))}>
      <div className={tooltipCls('header')}>
        <span className={'header-label'}>{rowName}</span>
        <span>{value ?? emptyPlaceholder}</span>
      </div>
      <div className={tooltipCls('original-value')}>
        {isNil(originalValue?.[0]?.[0])
          ? emptyPlaceholder
          : originalValue?.[0]?.[0]}
      </div>
      {!isEmpty(derivedValues) && (
        <>
          <div className={tooltipCls('divider')} />
          <ul className={tooltipCls('derived-values')}>
            {derivedValues.map((derivedValue, i) => {
              const isNormal = isNil(derivedValue) || derivedValue === '';
              const isUp = isUpDataValue(derivedValue as string);
              const isDown = !isNormal && !isUp;

              return (
                <li className="derived-value-item" key={i}>
                  <span className="derived-value-label">
                    {derivedLabels[i]}
                  </span>
                  <span
                    className={cls('derived-value-group', {
                      ['derived-value-trend-up']: isUp,
                      ['derived-value-trend-down']: isDown,
                    })}
                  >
                    {!isNormal && (
                      <span className="derived-value-trend-icon"></span>
                    )}
                    <span className="derived-value-content">
                      {derivedValue ?? emptyPlaceholder}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {rowDiscription && (
        <div>
          {i18n('说明')}: {rowDiscription}
        </div>
      )}
    </div>
  );
};
