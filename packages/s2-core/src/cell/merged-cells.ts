import { renderPolygon } from 'src/utils/g-renders';
import { getPolygonPoints } from 'src/utils/interactions/merge-cell';
import { BaseCell } from 'src/cell/base-cell';
import { Cell } from 'src/common/interface/interaction';
import { DataItem } from 'src/common/interface/S2DataConfig';

/**
 * Cell for panelGroup area
 */
export class MergedCells extends BaseCell<DataItem> {

  protected cells: Cell[]; 

  protected initCell() {
   
   
    this.drawBackgroundShape();
    // this.drawStateShapes();
    // this.drawTextShape();
    // 更新选中状态
    this.update();
  }

  public update() {}

  /**
   * Draw merged cells background
   */
  protected drawBackgroundShape() {
    const allPoints = getPolygonPoints(this.cells);
    const cellTheme = this.theme.view.cell;
    this.backgroundShape = renderPolygon(
      allPoints,
      cellTheme.borderColor[0],
      cellTheme.backgroundColor,
      cellTheme.borderWidth[0],
      this,
    );
  }

  handleRestOptions(...options: Cell[][]) {
    this.cells = options[0];
  }
}
