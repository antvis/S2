import type { Point } from '@antv/g-canvas';
import type { Condition, IconTheme, MappingResult, TextTheme } from '../common';
import { RowCell } from './row-cell';

export class SeriesNumberCell extends RowCell {
  protected initCell(): void {
    this.drawBackgroundShape();
    this.drawRectBorder();
    this.drawTextShape();
  }

  protected getTextStyle(): TextTheme {
    return this.getStyle()?.seriesText;
  }

  protected getTextPosition(): Point {
    return super.getTextPosition();
  }

  protected getActionIconsCount(): number {
    return 0;
  }

  public getIconStyle(): IconTheme {
    return undefined;
  }

  protected drawResizeAreaInLeaf(): void {}

  public update() {}

  public findFieldCondition(): Condition | undefined {
    return undefined;
  }

  public mappingValue(): MappingResult | undefined {
    return undefined;
  }
}
