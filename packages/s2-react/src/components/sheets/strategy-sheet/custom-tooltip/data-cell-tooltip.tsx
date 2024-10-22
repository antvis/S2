import {
  getEmptyPlaceholder,
  i18n,
  isUnchangedValue,
  isUpDataValue,
  getStrategySheetTooltipClsName as tooltipCls,
  type MultiData,
  type SimpleData,
  type ViewMeta,
} from '@antv/s2';
import cls from 'classnames';
import { first, get, isEmpty, isFunction, isNil } from 'lodash';
import React from 'react';
import type { CustomTooltipProps } from './interface';

import './index.less';

export const StrategySheetDataCellTooltip: React.FC<CustomTooltipProps> =
  React.memo((props) => {
    const {
      cell,
      label,
      showOriginalValue: showOriginalValueFromTooltip = false,
      renderDerivedValue,
    } = props;
    const meta = cell.getMeta() as ViewMeta;
    const { spreadsheet } = meta;
    const metaFieldValue = meta?.fieldValue as MultiData<SimpleData[][]>;

    const rowDescription = spreadsheet.dataSet.getCustomFieldDescription(cell);
    const defaultRowName = spreadsheet.dataSet.getCustomRowFieldName(cell);
    const customLabel = isFunction(label) ? label(cell, defaultRowName) : label;
    const rowName = customLabel ?? defaultRowName;
    const colLeafNode = spreadsheet.facet.getColLeafNodeByIndex(meta.colIndex);

    const [, ...derivedLabels] = React.useMemo(() => {
      try {
        return JSON.parse(colLeafNode?.value!);
      } catch {
        return [];
      }
    }, [colLeafNode?.value]);

    const { placeholder, style } = spreadsheet.options;
    const valuesCfg = style?.dataCell?.valuesCfg;

    const [value, ...derivedValues] = first(metaFieldValue?.values) || [
      metaFieldValue,
    ];
    const [originalValue, ...derivedOriginalValues] = first(
      get(metaFieldValue, valuesCfg?.originalValueField!) as SimpleData[][],
    ) || [value];

    const emptyPlaceholder = getEmptyPlaceholder(meta, placeholder);
    const showOriginalValue =
      valuesCfg?.showOriginalValue || showOriginalValueFromTooltip;

    return (
      <div className={cls(tooltipCls(), tooltipCls('data'))}>
        <div className={tooltipCls('header')}>
          <span className={'header-label'}>{rowName}</span>
          <span>{(value as React.ReactNode) ?? emptyPlaceholder}</span>
        </div>
        {showOriginalValue && (
          <div className={tooltipCls('original-value')}>
            {isNil(originalValue)
              ? emptyPlaceholder
              : (originalValue as React.ReactNode)}
          </div>
        )}
        {!isEmpty(derivedValues) && (
          <>
            <div className={tooltipCls('divider')} />
            <ul className={tooltipCls('derived-values')}>
              {(derivedValues as SimpleData[]).map((derivedValue, i) => {
                const isUnchanged = isUnchangedValue(
                  derivedValue,
                  value as SimpleData,
                );
                const isUp = !isUnchanged && isUpDataValue(derivedValue);
                const isDown = !isUnchanged && !isUp;
                const originalDerivedValue = derivedOriginalValues[
                  i
                ] as SimpleData;

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
            <span className={tooltipCls('description-label')}>
              {i18n('说明')}
            </span>
            <span className={tooltipCls('description-text')}>
              {rowDescription}
            </span>
          </div>
        )}
      </div>
    );
  });

StrategySheetDataCellTooltip.displayName = 'StrategySheetDataCellTooltip';
