import type { PointLike } from '@antv/g';
import { CellType } from '../common/constant/interaction';
import type { FormatResult } from '../common/interface';
import { CellBorderPosition, CellClipBox } from '../common/interface/basic';
import { RowCell } from './row-cell';

export class SeriesNumberCell extends RowCell {
  public get cellType() {
    return CellType.ROW_CELL;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.LEFT, CellBorderPosition.BOTTOM];
  }

  protected initCell(): void {
    this.drawBackgroundShape();
    this.drawInteractiveBgShape();
    this.drawInteractiveBorderShape();
    this.drawBorders();
    this.drawTextShape();
    this.update();
  }

  public getBackgroundColor() {
    const { backgroundColor, backgroundColorOpacity } =
      this.getCrossBackgroundColor(this.meta.rowIndex);

    return {
      backgroundColor,
      backgroundColorOpacity,
      intelligentReverseTextColor: false,
    };
  }

  protected getTextStyle() {
    const textOverflowStyle = this.getCellTextWordWrapStyle(
      CellType.SERIES_NUMBER_CELL,
    );
    const style = this.getStyle()?.seriesText!;

    return {
      ...textOverflowStyle,
      ...style,
    };
  }

  protected getFormattedFieldValue(): FormatResult {
    const { value, field } = this.meta;
    const formatter = this.spreadsheet.dataSet.getFieldFormatter(field);
    const formattedValue = formatter?.(value, undefined, this.meta) ?? value;

    return {
      value,
      formattedValue,
    };
  }

  public getMaxTextWidth(): number {
    const { width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    return width;
  }

  protected isBolderText() {
    return false;
  }

  public findFieldCondition() {
    return undefined;
  }

  public mappingValue() {
    return undefined;
  }

  public getIconPosition(): PointLike {
    return { x: 0, y: 0 };
  }
}
