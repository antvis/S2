import { getEllipsisText } from '../utils/text';
import { renderRect } from '../utils/g-renders';
import { DEFAULT_PADDING, EXTRA_FIELD, ICON_RADIUS } from '../common/constant';
import { addDetailTypeSortIcon } from '../facet/layout/util/add-detail-type-sort-icon';
import { DefaultTheme } from '../theme';
import { ColCell } from '.';
/**
 * Create By Bruce Too
 * On 2019-11-04
 */
export class DetailColCell extends ColCell {
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
    // 列头默认粗体
    const textStyle = DefaultTheme.header.bolderText;

    const extraPadding = DEFAULT_PADDING * 2 + ICON_RADIUS * 2;
    const text = getEllipsisText(content, cellWidth - extraPadding, textStyle);
    // ListSheet's text always stay in right
    const textX = x + cellWidth - extraPadding;

    const textY = y + cellHeight / 2;
    this.addShape('text', {
      attrs: {
        x: textX,
        y: textY,
        textAlign: 'end',
        text,
        ...textStyle,
        cursor: 'pointer',
      },
    });

    addDetailTypeSortIcon(
      this,
      spreadsheet,
      textX + DEFAULT_PADDING,
      textY,
      key,
    );
  }

  protected drawRectBackground() {
    const { x, y, width: cellWidth, height: cellHeight } = this.meta;
    renderRect(
      x,
      y,
      cellWidth,
      cellHeight,
      DefaultTheme.header.cell.backgroundColor,
      'rgba(0,0,0,0)',
      this,
    );
  }

  protected getColHotSpotKey(): string {
    return EXTRA_FIELD;
  }
}
