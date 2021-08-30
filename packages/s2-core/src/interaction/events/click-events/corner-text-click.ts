import { InterceptEventType, S2Event } from '@/common/constant';
import { getCellPadding } from '@/facet/header/util';
import { isMobile } from '@/utils/is-mobile';
import { measureTextWidth } from '@/utils/text';
import { Event } from '@antv/g-canvas';
import { get } from 'lodash';
import { BaseEvent, BaseEventImplement } from '../base-event';

/**
 * Click corner header text to full expand(remove 「...」)
 */
export class CornerTextClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindCornerClick();
  }

  private bindCornerClick() {
    this.spreadsheet.on(S2Event.CORNER_CELL_CLICK, (ev: Event) => {
      if (this.interaction.interceptEvent.has(InterceptEventType.CLICK)) {
        return;
      }
      const cornerExpand = this.spreadsheet.store.get('cornerExpand') || {};
      const appendInfo = get(ev.target, 'attrs.appendInfo', {});
      const text = get(ev.target, 'attrs.text', '');
      const label = get(ev.target, 'attrs.appendInfo.cellData.label', '');
      // 是行头title 且 有收起。或者之前点击过
      if (
        appendInfo.isCornerHeaderText &&
        (text.includes('..') || cornerExpand[label])
      ) {
        const labelWidth = Math.ceil(
          measureTextWidth(
            label,
            get(this.spreadsheet, 'theme.cornerCell.text'),
          ),
        );
        const padding = getCellPadding();
        const { left, right } = padding;

        if (cornerExpand[label]) {
          this.spreadsheet.store.set('cornerExpand', {
            [label]: null,
          });
        } else {
          this.spreadsheet.store.set('cornerExpand', {
            [label]: labelWidth + left + right,
          });
        }
        this.spreadsheet.render(false);
      }
    });
  }

  protected getStarEvent(): string {
    return isMobile() ? 'touchstart' : 'mousedown';
  }

  protected getEndEvent(): string {
    return isMobile() ? 'touchend' : 'mouseup';
  }
}
