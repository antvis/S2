import { CellBorderPosition, CellClipBox, CornerCell } from '@antv/s2';
import { AxisCellType } from './cell-type';

export class AxisCornerCell extends CornerCell {
  public get cellType() {
    return AxisCellType.AXIS_CORNER_CELL as any;
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

  protected getInteractedCells() {
    return this.spreadsheet.interaction?.getCells([
      AxisCellType.AXIS_CORNER_CELL as any,
    ]);
  }

  protected initCell(): void {
    this.drawBackgroundShape();
    this.drawTextShape();
    this.drawBorders();
    this.update();
  }
}
