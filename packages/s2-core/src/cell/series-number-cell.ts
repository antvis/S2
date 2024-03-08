import type { PointLike } from '@antv/g';
import { CellType } from '../common/constant/interaction';
import type { AreaRange, FormatResult } from '../common/interface';
import { CellBorderPosition, CellClipBox } from '../common/interface/basic';
import { getHorizontalTextIconPosition } from '../utils/cell/cell';
import { adjustTextIconPositionWhileScrolling } from '../utils/cell/text-scrolling';
import { normalizeTextAlign } from '../utils/normalize';
import { HeaderCell } from './header-cell';

export class SeriesNumberCell extends HeaderCell {
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
    const { value } = this.meta;

    return {
      value,
      formattedValue: value,
    };
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    return width;
  }

  protected getTextPosition(): PointLike {
    const { scrollY, viewportHeight } = this.headerConfig;
    const textStyle = this.getTextStyle();
    const { cell } = this.getStyle()!;
    const viewport: AreaRange = {
      start: scrollY!,
      size: viewportHeight,
    };

    const textArea = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    const { textStart } = adjustTextIconPositionWhileScrolling(
      viewport,
      {
        start: textArea.y,
        size: textArea.height,
      },
      {
        align: normalizeTextAlign(textStyle.textBaseline!),
        size: {
          textSize: textStyle.fontSize!,
        },
        padding: {
          start: cell?.padding?.top!,
          end: cell?.padding?.bottom!,
        },
      },
    );

    const { textX } = getHorizontalTextIconPosition({
      bbox: textArea,
      textAlign: textStyle.textAlign!,
      textWidth: this.getActualTextWidth(),
      iconStyle: this.getIconStyle()!,
      groupedIcons: this.groupedIcons,
    });

    return { x: textX, y: textStart };
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
