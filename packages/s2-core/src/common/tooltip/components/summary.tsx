import * as React from 'react';
import { i18n } from '../../i18n';
import { SummaryProps } from '../interface';
import { TOOLTIP_CLASS_PRE } from '../constant';

const Summary = (props: { summaries: SummaryProps[] }) => {
  const { summaries = [] } = props;

  const renderSelected = () => {
    const selectedCount = summaries?.reduce((pre, next) => {
      return pre + next?.selectedData?.length;
    }, 0);

    return (
      <div className={`${TOOLTIP_CLASS_PRE}-summary-item`}>
        <span className={`${TOOLTIP_CLASS_PRE}-bold`}>
          {selectedCount} {i18n('项')}
        </span>{' '}
        {i18n('已选择')}
      </div>
    );
  };

  const renderSummary = () => {
    return summaries?.map((item) => {
      const { selectedData = [], name, value } = item || {};

      return (
        <div key={name} className={`${TOOLTIP_CLASS_PRE}-summary-item`}>
          <span className={`${TOOLTIP_CLASS_PRE}-summary-key`}>
            {name}（{i18n('总和')}
          </span>
          <span
            className={`${TOOLTIP_CLASS_PRE}-summary-val ${TOOLTIP_CLASS_PRE}-bold`}
          >
            {value}
          </span>
        </div>
      );
    });
  };

  return (
    <div className={`${TOOLTIP_CLASS_PRE}-summary`}>
      {renderSelected()}
      {renderSummary()}
    </div>
  );
};

export default Summary;
