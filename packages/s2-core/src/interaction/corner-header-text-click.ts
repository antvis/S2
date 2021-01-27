import { Event, Point } from '@antv/g-canvas';
import * as _ from '@antv/util';
import { isMobile } from '../utils/is-mobile';
import { measureTextWidth } from '../utils/text';
import { getCellPadding } from '../facet/header/util';
import { HoverInteraction } from './hover-interaction';

/**
 * Click corner header text to full expand(remove 「...」)
 */
export class CornerHeaderTextClick extends HoverInteraction {
  private targetPoint: Point;

  protected getStarEvent(): string {
    return isMobile() ? 'touchstart' : 'mousedown';
  }

  protected getEndEvent(): string {
    return isMobile() ? 'touchend' : 'mouseup';
  }

  protected start(ev: Event) {
    this.targetPoint = _.get(ev, 'target.cfg.startPoint');
  }

  protected end(ev: Event) {
    if (this.targetPoint !== _.get(ev, 'target.cfg.startPoint')) {
      return;
    }
    const cornerExpand = this.spreadsheet.store.get('cornerExpand') || {};
    const appendInfo = _.get(ev.target, 'attrs.appendInfo', {});
    const text = _.get(ev.target, 'attrs.text', '');
    const label = _.get(ev.target, 'attrs.appendInfo.cellData.label', '');

    // 是行头title 且 有收起。或者之前点击过
    if (
      appendInfo.isCornerHeaderText &&
      (text.includes('..') || cornerExpand[label])
    ) {
      const labelWidth = Math.ceil(
        measureTextWidth(label, _.get(this.spreadsheet, 'theme.header.text')),
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
  }
}
