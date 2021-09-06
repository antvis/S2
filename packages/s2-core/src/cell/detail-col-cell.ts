import { ColCell } from '@/cell/col-cell';
import { renderText } from '@/utils/g-renders';
import { get } from 'lodash';
import { EXTRA_FIELD } from '../common/constant';
import { renderDetailTypeSortIcon } from '../facet/layout/util/add-detail-type-sort-icon';
import { getEllipsisText, getTextPosition } from '../utils/text';

export class DetailColCell extends ColCell {
  protected drawTextShape() {
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

    const textStyle = get(this, 'theme.colCell.bolderText');
    const padding = get(this, 'theme.colCell.cell.padding');
    const iconSize = get(this, 'theme.colCell.icon.size');
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

  protected getColResizeAreaKey(): string {
    return EXTRA_FIELD;
  }
}
