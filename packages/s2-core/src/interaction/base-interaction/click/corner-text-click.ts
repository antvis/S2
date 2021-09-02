import { InterceptType, S2Event } from '@/common/constant';
import { measureTextWidth } from '@/utils/text';
import { Event } from '@antv/g-canvas';
import { BaseEvent, BaseEventImplement } from '@/interaction/base-event';
import { CellAttrs } from '@/common/interface/basic';
import { Node } from '@/facet/layout/node';

/**
 * Click corner header text to full expand(remove 「...」)
 */
export class CornerTextClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindCornerClick();
  }

  private bindCornerClick() {
    this.spreadsheet.on(S2Event.CORNER_CELL_CLICK, (event: Event) => {
      if (this.interaction.intercept.has(InterceptType.CLICK)) {
        return;
      }
      const cornerExpand = this.spreadsheet.store.get('cornerExpand') || {};
      const { text = '', appendInfo } =
        (event.target?.attrs as CellAttrs<Node>) || {};
      const label = appendInfo?.cellData?.label || '';

      const isExpanded = cornerExpand[label];
      // 是行头title 且 有收起。或者之前点击过
      if (
        appendInfo?.isCornerHeaderText &&
        (text.includes('..') || isExpanded)
      ) {
        const labelWidth = this.getLabelWidth(label);
        this.spreadsheet.store.set('cornerExpand', {
          [label]: !isExpanded ? labelWidth : null,
        });
        this.spreadsheet.render(false);
      }
    });
  }

  private getLabelWidth(label: string) {
    const {
      text: textTheme,
      cell: cornerCellTheme,
    } = this.spreadsheet?.theme?.cornerCell;
    const labelWidth = Math.ceil(measureTextWidth(label, textTheme));
    const { left: leftPadding, right: rightPadding } = cornerCellTheme.padding;
    return labelWidth + leftPadding + rightPadding;
  }
}
