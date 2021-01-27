import BaseSpreadsheet from '../sheet-type/base-spread-sheet';
import { renderLine, renderRect } from '../utils/g-renders';
import { BaseCell } from '.';
import { PlaceHolderMeta } from '../common/interface';
import { merge } from 'lodash';
export class DataPlaceHolderCell extends BaseCell<PlaceHolderMeta> {
  constructor(meta: PlaceHolderMeta, spreadsheet: BaseSpreadsheet) {
    super(meta, spreadsheet);
  }

  protected initCell() {
    this.initBackgroundShape();
    this.initBorderShape();
    this.initTextShape();
  }

  setMeta(viewMeta: PlaceHolderMeta) {
    super.setMeta(viewMeta);
    this.initCell();
  }

  protected getPlaceHolderText() {
    return '...';
  }

  protected initTextShape() {
    const { x, y, height, width } = this.meta;
    let textStyle = this.spreadsheet.theme.view.text;
    const textFill = textStyle.fill;
    const padding = this.spreadsheet.theme.view.cell.padding;
    textStyle = merge({}, textStyle, {
      textAlign: 'end',
    });
    const text = this.getPlaceHolderText();

    this.addShape('text', {
      attrs: {
        x: x + width - padding[1],
        y: y + height / 2,
        text,
        ...textStyle,
        fill: textFill,
      },
    });
  }

  /**
   * Draw cell background
   */
  protected initBackgroundShape() {
    const { x, y, height, width } = this.meta;

    const bgColor = this.theme.view.cell.backgroundColor;
    const stroke = 'transparent';
    this.backgroundShape = renderRect(
      x,
      y,
      width,
      height,
      bgColor,
      stroke,
      this,
    );
  }

  /**
   * Render cell border controlled by verticalBorder & horizontalBorder
   * @private
   */
  protected initBorderShape() {
    const { x, y, height, width } = this.meta;
    const borderColor = this.theme.view.cell.borderColor;
    const borderWidth = this.theme.view.cell.borderWidth;

    // horizontal border
    renderLine(x, y, x + width, y, borderColor[0], borderWidth[0], this);

    // vertical border
    renderLine(
      x + width,
      y,
      x + width,
      y + height,
      borderColor[1],
      borderWidth[1],
      this,
    );
  }

  public update() {}
}
