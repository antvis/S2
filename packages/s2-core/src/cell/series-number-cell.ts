import type { Condition, MappingResult, TextTheme } from '../common';
import { FrozenRowCell } from './frozen-row-cell';

export class SeriesNumberCell extends FrozenRowCell {
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
