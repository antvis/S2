import React from 'react';
import { size, reduce } from 'lodash';
import { SummaryProps, TOOLTIP_PREFIX_CLS } from '@antv/s2';
import cls from 'classnames';
import { i18n } from '@/common/i18n';

export const TooltipSummary: React.FC<SummaryProps> = React.memo((props) => {
  const { summaries = [] } = props;

  const renderSelected = () => {
    const count = reduce(
      summaries,
      (pre, next) => pre + size(next?.selectedData),
      0,
    );
    return (
      <div className={`${TOOLTIP_PREFIX_CLS}-summary-item`}>
        <span className={`${TOOLTIP_PREFIX_CLS}-selected`}>
          {count} {i18n('项')}
        </span>
        {i18n('已选择')}
      </div>
    );
  };

  const renderSummary = () => {
    return summaries?.map((item) => {
      const { name = '', value } = item || {};
      if (!name && !value) {
        return;
      }

      return (
        <div
          key={`${name}-${value}`}
          className={`${TOOLTIP_PREFIX_CLS}-summary-item`}
        >
          <span className={`${TOOLTIP_PREFIX_CLS}-summary-key`}>
            {name}（{i18n('总和')})
          </span>
          <span
            className={cls(
              `${TOOLTIP_PREFIX_CLS}-summary-val`,
              `${TOOLTIP_PREFIX_CLS}-bold`,
            )}
          >
            {value}
          </span>
        </div>
      );
    });
  };

  return (
    <div className={`${TOOLTIP_PREFIX_CLS}-summary`}>
      {renderSelected()}
      {renderSummary()}
    </div>
  );
});
