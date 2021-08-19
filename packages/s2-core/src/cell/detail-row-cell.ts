import { get } from 'lodash';
import { DataCell } from 'src/cell/data-cell';
import { renderText } from '../utils/g-renders';
import { isMobile } from '../utils/is-mobile';
import { getEllipsisText, getTextPosition } from '../utils/text';
export class DetailRowCell extends DataCell {
  protected drawTextShape() {
    const { x, y, height, width } = this.getContentAreaBBox();
    const { formattedValue: text } = this.getData();
    const textStyle = this.theme.rowCell?.bolderText;
    const padding = this.theme.rowCell?.cell?.padding;

    const ellipsisText = getEllipsisText(
      `${text || '-'}`,
      width - padding?.left - padding?.right,
      textStyle,
    );
    const cellBoxCfg = {
      x,
      y,
      height,
      width,
      textAlign: textStyle.textAlign,
      textBaseline: textStyle.textBaseline,
      padding,
    };
    const position = getTextPosition(cellBoxCfg);
    this.textShape = renderText(
      [this.textShape],
      position.x,
      position.y,
      ellipsisText,
      textStyle,
      this,
    );
  }
}
