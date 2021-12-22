import { get } from 'lodash';
import { getBorderPositionAndStyle } from 'src/utils/cell/cell';
import { CellBorderPosition } from 'src/common/interface';
import { renderLine } from 'src/utils/g-renders';
import { TableColCell } from './table-col-cell';

export class TableCornerCell extends TableColCell {
  public getStyle(name?: string) {
    return name ? this.theme[name] : get(this, 'theme.cornerCell');
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
    renderLine(this, position, style);
  }

  protected drawBorders() {
    super.drawBorders();
    if (this.meta.colIndex === 0) {
      this.drawLeftBorder();
    }
  }
}
