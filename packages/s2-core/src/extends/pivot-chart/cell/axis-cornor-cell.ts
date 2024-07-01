import {
  CellBorderPosition,
  CellClipBox,
  CellType,
  CornerCell,
} from '@antv/s2';
import { AxisCellType } from '../constant';

export class AxisCornerCell extends CornerCell {
  public get cellType() {
    return AxisCellType.AXIS_CORNER_CELL as unknown as CellType;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [
      CellBorderPosition.TOP,
      CellBorderPosition.BOTTOM,
      CellBorderPosition.LEFT,
    ];
  }

  protected isBolderText(): boolean {
    return false;
  }

  public getMaxTextWidth(): number {
    const { width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    return width;
  }

  protected getTreeIconWidth() {
    return 0;
  }

  protected initCell(): void {
    this.drawBackgroundShape();
    this.drawTextShape();
    this.drawBorders();
  }
}
