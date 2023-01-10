import type { PointLike } from '@antv/g';
import type {
  TextTheme,
  FormatResult,
  Condition,
  MappingResult,
} from '../common/interface';
import { CellBorderPosition, CellClipBox } from '../common/interface/basic';
import { CellTypes } from '../common/constant/interaction';
import type { Node } from '../facet/layout/node';
import type { BaseHeaderConfig } from '../facet/header/interface';
import { getTextAndFollowingIconPosition } from '../utils/cell/cell';
import { getAdjustPosition } from '../utils/text-absorption';
import { BaseCell } from './base-cell';

export class SeriesNumberCell extends BaseCell<Node> {
  protected declare headerConfig: BaseHeaderConfig;

  protected handleRestOptions(...[headerConfig]: [BaseHeaderConfig]) {
    this.headerConfig = { ...headerConfig };
  }

  public get cellType(): CellTypes {
    return CellTypes.ROW_CELL;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.LEFT, CellBorderPosition.BOTTOM];
  }

  protected initCell(): void {
    this.drawBackgroundShape();
    this.drawBorders();
    this.drawTextShape();
  }

  protected getBackgroundColor(): {
    backgroundColor: string | undefined;
    backgroundColorOpacity: number | undefined;
  } {
    const { backgroundColor, backgroundColorOpacity } =
      this.getStyle()?.cell || {};

    return { backgroundColor, backgroundColorOpacity };
  }

  public update(): void {
    /** 序号单元格暂时没有交互的联动 */
  }

  protected getTextStyle(): TextTheme {
    return this.getStyle()?.seriesText!;
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
    const textArea = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    const { scrollY, viewportHeight: height } = this.headerConfig;

    const { fontSize } = this.getTextStyle();
    const textY = getAdjustPosition(
      textArea.y,
      textArea.height,
      scrollY!,
      height,
      fontSize!,
    );
    const textX = getTextAndFollowingIconPosition(
      textArea,
      this.getTextStyle(),
      0,
      this.getIconStyle(),
      0,
    ).text.x;

    return { x: textX, y: textY };
  }

  protected findFieldCondition(): Condition | undefined {
    return undefined;
  }

  protected mappingValue(): MappingResult | undefined {
    return undefined;
  }
}
