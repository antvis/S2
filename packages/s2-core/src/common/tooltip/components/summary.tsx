import * as React from 'react';
import { i18n } from '../../i18n';
import { SummaryProps } from '../interface';
import { TOOLTIP_CLASS_PRE } from '../constant';

const Summary = (props: SummaryProps) => {
  const { selectedData = [], name, value } = props;

  return (
    selectedData.length > 1 && (
      <div className={`${TOOLTIP_CLASS_PRE}-summary`}>
        <div className={`${TOOLTIP_CLASS_PRE}-summary-item`}>
          <span className={`${TOOLTIP_CLASS_PRE}-bold`}>
            {selectedData.length} {i18n('项')}
          </span>{' '}
          {i18n('已选择')}
        </div>
        <div className={`${TOOLTIP_CLASS_PRE}-summary-item`}>
          <span className={`${TOOLTIP_CLASS_PRE}-summary-key`}>
            {name}（{i18n('总和')}）
          </span>
          <span
            className={`${TOOLTIP_CLASS_PRE}-summary-val ${TOOLTIP_CLASS_PRE}-bold`}
          >
            {value}
          </span>
        </div>
      </div>
    )
  );
};

export default Summary;
