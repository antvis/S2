import { ColCell } from '@/cell/col-cell';
import { renderText } from '@/utils/g-renders';
import { get } from 'lodash';
import { EXTRA_FIELD } from '../common/constant';
import { renderDetailTypeSortIcon } from '../facet/layout/util/add-detail-type-sort-icon';
import { getEllipsisText, getTextPosition } from '../utils/text';

export class TableColCell extends ColCell {
  protected getStyle() {
    return get(this, 'theme.colCell');
  }

  protected drawCellText() {
    const { spreadsheet } = this.headerConfig;
    const {
      label,
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      key,
    } = this.meta;
    const content = label;

    const style = this.getStyle();
    const textStyle = get(style, 'bolderText');
    const padding = get(style, 'cell.padding');
    const iconSize = get(style, 'icon.size');
    const rightPadding = padding?.right + iconSize;
    const leftPadding = padding?.left;

    const textAlign = get(textStyle, 'textAlign');
    const textBaseline = get(textStyle, 'textBaseline');

    const cellBoxCfg = {
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      textAlign,
      textBaseline,
      padding: {
        left: leftPadding,
        right: rightPadding,
      },
    };
    const position = getTextPosition(cellBoxCfg);

    const textX = position.x;
    const textY = position.y;

    const text = getEllipsisText(
      content,
      cellWidth - leftPadding - rightPadding,
      textStyle,
    );

    this.textShape = renderText(
      this,
      [this.textShape],
      textX,
      textY,
      text,
      {
        textAlign,
        ...textStyle,
      },
      { cursor: 'pointer' },
    );

    renderDetailTypeSortIcon(
      this,
      spreadsheet,
      x + cellWidth - iconSize,
      textY,
      key,
    );
  }

  protected getColHotSpotKey(): string {
    return EXTRA_FIELD;
  }
}
