import type { PointLike } from '@antv/g';
import { CellType } from '../common/constant/interaction';
import type { AreaRange, FormatResult } from '../common/interface';
import { CellBorderPosition, CellClipBox } from '../common/interface/basic';
import type { BaseHeaderConfig } from '../facet/header/interface';
import type { Node } from '../facet/layout/node';
import { getHorizontalTextIconPosition } from '../utils/cell/cell';
import { adjustTextIconPositionWhileScrolling } from '../utils/cell/text-scrolling';
import { normalizeTextAlign } from '../utils/normalize';
import { BaseCell } from './base-cell';

export class SeriesNumberCell extends BaseCell<Node> {
  protected declare headerConfig: BaseHeaderConfig;

  protected handleRestOptions(...[headerConfig]: [BaseHeaderConfig]) {
    this.headerConfig = { ...headerConfig };
  }

  public getHeaderConfig() {
    return this.headerConfig || {};
  }

  public get cellType() {
    return CellType.ROW_CELL;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.LEFT, CellBorderPosition.BOTTOM];
  }

  protected initCell(): void {
    this.drawBackgroundShape();
    this.drawBorders();
    this.drawTextShape();
  }

  protected getBackgroundColor() {
    const { backgroundColor, backgroundColorOpacity } =
      this.getStyle()?.cell || {};

    return {
      backgroundColor,
      backgroundColorOpacity,
      intelligentReverseTextColor: false,
    };
  }

  public update(): void {
    /** 序号单元格暂时没有交互的联动 */
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

  protected findFieldCondition() {
    return undefined;
  }

  protected mappingValue() {
    return undefined;
  }

  protected getIconPosition(): PointLike {
    return { x: 0, y: 0 };
  }
}
