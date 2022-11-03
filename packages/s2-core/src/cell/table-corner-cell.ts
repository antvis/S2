import { get } from 'lodash';
import { getBorderPositionAndStyle } from '../utils/cell/cell';
import { CellBorderPosition } from '../common/interface';
import { renderLine } from '../utils/g-renders';
import { TableColCell } from './table-col-cell';

export class TableCornerCell extends TableColCell {
  public getStyle(name?: string) {
    return name ? get(this.theme, name) : get(this.theme, 'cornerCell');
  }

  protected showSortIcon() {
    return false;
  }

  protected drawLeftBorder() {
    const { position, style } = getBorderPositionAndStyle(
      CellBorderPosition.LEFT,
      this.getCellArea(),
      this.getStyle().cell,
    );
    renderLine(this, position, style!);
  }

  protected drawBorders() {
    super.drawBorders();
    if (this.meta.colIndex === 0) {
      this.drawLeftBorder();
    }
  }
}
