import type { Condition, MappingResult, TextTheme } from '../common';
import { RowCell } from './row-cell';

export class SeriesNumberCell extends RowCell {
  protected initCell(): void {
    this.drawBackgroundShape();
    this.drawRectBorder();
    this.drawTextShape();
  }

  protected getTextStyle(): TextTheme {
    const style = super.getTextStyle();
    return { ...style, textAlign: 'center' };
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
