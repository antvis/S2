import * as React from 'react';
import { HtmlIcon } from '../../icons';
import { DetailProps, ListItem } from '../interface';
import {
  LIST_CLASS,
  LIST_ITEM_CLASS,
  LIST_ITEM_KEY_CLASS,
  LIST_ITEM_VAL_CLASS,
  HIGHLIGHT_CLASS,
} from '../constant';

export class TooltipDetail extends React.PureComponent<DetailProps, {}> {
  render(): JSX.Element {
    const { list } = this.props;
    return (
      <div className={LIST_CLASS}>
        {list.map((listItem: ListItem, index: number) => {
          const { name, value, icon } = listItem;

          return (
            <div key={index} className={LIST_ITEM_CLASS}>
              <span className={LIST_ITEM_KEY_CLASS}>{name}</span>
              <span className={`${LIST_ITEM_VAL_CLASS} ${HIGHLIGHT_CLASS}`}>
                {icon ? <HtmlIcon type={icon} width={8} height={7} /> : null}{' '}
                {value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}
