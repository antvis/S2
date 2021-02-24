import * as React from 'react';
import { i18n } from '../../i18n';
import { SummaryProps } from '../interface';
import {
  SUMMARY_CLASS,
  SUMMARY_ITEM_CLASS,
  SUMMARY_KEY_CLASS,
  SUMMARY_VAL_CLASS,
  BOLD_CLASS,
} from '../constant';

export class TooltipSummary extends React.PureComponent<SummaryProps, {}> {
  public render(): JSX.Element {
    const { selectedData = [], name, value } = this.props;

    return (
      selectedData.length > 1 && (
        <div className={SUMMARY_CLASS}>
          <div className={SUMMARY_ITEM_CLASS}>
            <span className={BOLD_CLASS}>
              {selectedData.length} {i18n('项')}
            </span>{' '}
            {i18n('已选择')}
          </div>
          <div className={SUMMARY_ITEM_CLASS}>
            <span className={SUMMARY_KEY_CLASS}>
              {name}（{i18n('总和')}）
            </span>
            <span className={`${SUMMARY_VAL_CLASS} ${BOLD_CLASS}`}>
              {value}
            </span>
          </div>
        </div>
      )
    );
  }
}
