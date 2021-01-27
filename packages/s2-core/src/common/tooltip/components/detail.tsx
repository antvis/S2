import * as React from 'react';
import { HtmlIcon } from '../../icons';
import { DetailProps, ListItem } from '../interface';

const LIST_CLASS = 'eva-facet-tooltip-list';
const LIST_ITEM_CLASS = 'eva-facet-tooltip-list-item';
const LIST_ITEM_KEY_CLASS = 'eva-facet-tooltip-list-item-key';
const LIST_ITEM_VAL_CLASS = 'eva-facet-tooltip-list-item-val';
const HIGHLIGHT_CLASS = 'eva-facet-tooltip-highlight';

export class TooltipDetail extends React.PureComponent<DetailProps> {
  render(): JSX.Element {
    const { list } = this.props;
    return (
      <div className={LIST_CLASS}>
        {list.map((listItem: ListItem, index: number) => {
          const { name, value, icon } = listItem;
          // const htmlIcon = icon ? <HtmlIcon type={icon} width={10} height={10}/> : null;
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
