import {
  TOOLTIP_PREFIX_CLS,
  i18n,
  isMobile,
  type TooltipSummaryProps,
} from '@antv/s2';
import cls from 'classnames';
import { size, sumBy } from 'lodash';
import React from 'react';
import { useSpreadSheetInstance } from '../../../context/SpreadSheetContext';

export const TooltipSummary: React.FC<TooltipSummaryProps> = React.memo(
  (props) => {
    const { summaries = [] } = props;
    const s2 = useSpreadSheetInstance();
    const isMobileDevice = isMobile(s2?.options?.device);

    const renderSelected = () => {
      const count = sumBy(summaries, (item) => size(item?.selectedData));

      return (
        <div
          className={`${TOOLTIP_PREFIX_CLS}-summary-item`}
          style={isMobileDevice ? { marginBottom: '6px' } : {}}
        >
          <span className={`${TOOLTIP_PREFIX_CLS}-selected`}>
            {count} {i18n('项')}
          </span>
          {i18n('已选择')}
        </div>
      );
    };

    const renderSummary = () =>
      summaries?.map((item) => {
        const { name = '', value } = item || {};

        if (!name && !value) {
          return;
        }

        return (
          <div
            key={`${name}-${value}`}
            className={`${TOOLTIP_PREFIX_CLS}-summary-item`}
          >
            {name ? (
              <span className={`${TOOLTIP_PREFIX_CLS}-summary-key`}>
                {name}
                {i18n('总和')}
              </span>
            ) : (
              <span className={`${TOOLTIP_PREFIX_CLS}-summary-key`}>
                &nbsp;
              </span>
            )}
            <span
              className={cls(
                `${TOOLTIP_PREFIX_CLS}-summary-val`,
                `${TOOLTIP_PREFIX_CLS}-bold`,
              )}
            >
              {value ?? '-'}
            </span>
          </div>
        );
      });

    return (
      <div className={`${TOOLTIP_PREFIX_CLS}-summary`}>
        {renderSelected()}
        {renderSummary()}
      </div>
    );
  },
);

TooltipSummary.displayName = 'TooltipSummary';
