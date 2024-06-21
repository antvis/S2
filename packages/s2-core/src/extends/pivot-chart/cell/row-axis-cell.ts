import type { PointLike } from '@antv/g-lite';
import { CellBorderPosition, CellType, HeaderCell } from '@antv/s2';
import { AxisCellType } from '../constant';
import type { RowAxisHeaderConfig } from '../interface';

export class RowAxisCell extends HeaderCell<RowAxisHeaderConfig> {
  public get cellType() {
    return AxisCellType.ROW_AXIS_CELL as unknown as CellType;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.BOTTOM, CellBorderPosition.LEFT];
  }

  protected isBolderText(): boolean {
    return false;
  }

  public getMaxTextWidth(): number {
    return 0;
  }

  protected getTextPosition(): PointLike {
    return {
      x: 0,
      y: 0,
    };
  }

  protected initCell(): void {
    this.drawBackgroundShape();
    // 绘制交互背景
    this.drawInteractiveBgShape();
    // 绘制交互边框
    this.drawInteractiveBorderShape();
    // 绘制单元格文本
    this.drawAxisShape();
    // 绘制字段和 action标记 -- icon 和 action
    this.drawActionAndConditionIcons();
    // 绘制单元格边框
    this.drawBorders();
    // 绘制 resize 热区
    // this.drawResizeAreaInLeaf();
    this.update();
  }

  drawAxisShape() {}
}
