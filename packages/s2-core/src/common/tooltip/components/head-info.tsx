import * as React from 'react';
import { ListItem, HeadInfo } from '../interface';
import { HEAD_INFO_CLASS } from '../constant';

export class TooltipHeadInfo extends React.PureComponent<HeadInfo, {}> {
  render(): JSX.Element {
    const { rows = [], cols = [] } = this.props;

    return (
      <div className={HEAD_INFO_CLASS}>
        {cols.map((item: ListItem) => item.value)?.join('/')}
        {cols.length > 0 && rows.length > 0 && '，'}
        {rows.map((item: ListItem) => item.value)?.join('/')}
      </div>
    );
  }
}
