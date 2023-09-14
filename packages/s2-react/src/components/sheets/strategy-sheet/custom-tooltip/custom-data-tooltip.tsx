import {
  i18n,
  getEmptyPlaceholder,
  isUpDataValue,
  type MultiData,
  type SimpleDataItem,
  type ViewMeta,
  isUnchangedValue,
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
  showOriginalValue: showOriginalValueFromTooltip,
  renderDerivedValue,
}) => {
  const meta = cell.getMeta() as ViewMeta;
  const metaFieldValue = meta?.fieldValue as MultiData<SimpleDataItem[][]>;

  const rowDescription = getRowDescription(meta);
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

  const { placeholder, style } = meta.spreadsheet.options;
  const valuesCfg = style.cellCfg?.valuesCfg;

  const [value, ...derivedValues] = first(metaFieldValue?.values) || [
    metaFieldValue,
  ];
  const [originalValue, ...derivedOriginalValues] = first(
    get(metaFieldValue, valuesCfg?.originalValueField) as SimpleDataItem[][],
  ) || [value];

  const emptyPlaceholder = getEmptyPlaceholder(meta, placeholder);
  const showOriginalValue =
    valuesCfg?.showOriginalValue || showOriginalValueFromTooltip;

  return (
    <div className={cls(tooltipCls(), tooltipCls('data'))}>
      <div className={tooltipCls('header')}>
        <span className={'header-label'}>{rowName}</span>
        <span>{value ?? emptyPlaceholder}</span>
      </div>
      {showOriginalValue && (
        <div className={tooltipCls('original-value')}>
          {isNil(originalValue) ? emptyPlaceholder : originalValue}
        </div>
      )}
      {!isEmpty(derivedValues) && (
        <>
          <div className={tooltipCls('divider')} />
          <ul className={tooltipCls('derived-values')}>
            {derivedValues.map((derivedValue: SimpleDataItem, i) => {
              const isUnchanged = isUnchangedValue(
                derivedValue,
                value as SimpleDataItem,
              );
              const isUp =
                !isUnchanged && isUpDataValue(derivedValue as string);
              const isDown = !isUnchanged && !isUp;
              const originalDerivedValue = derivedOriginalValues[
                i
              ] as SimpleDataItem;

              return (
                <li className="derived-value-item" key={i}>
                  <span className="derived-value-label">
                    {derivedLabels[i]}
                  </span>
                  <span
                    className={cls('derived-value-group', {
                      'derived-value-trend-up': isUp,
                      'derived-value-trend-down': isDown,
                    })}
                  >
                    {!isUnchanged && (
                      <span className="derived-value-trend-icon"></span>
                    )}
                    {renderDerivedValue?.(
                      derivedValue,
                      originalDerivedValue,
                      cell,
                    ) ?? (
                      <span className="derived-value-content">
                        {derivedValue ?? emptyPlaceholder}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {rowDescription && (
        <div className={tooltipCls('description')}>
          {i18n('说明')}: {rowDescription}
        </div>
      )}
    </div>
  );
};

StrategySheetDataTooltip.defaultProps = {
  showOriginalValue: false,
};
