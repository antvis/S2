import { DataCell } from '@/cell/data-cell';
import { CellTypes } from '@/common/constant';
import { TextTheme } from '@/common/interface';

export class TableRowCell extends DataCell {
  public get cellType() {
    return CellTypes.ROW_CELL;
  }

  protected getTextStyle(): TextTheme {
    return this.theme.rowCell.text;
  }

  protected drawBorderShape() {
    super.drawBorderShape();
    if (this.meta.colIndex === 0) {
      this.drawLeftBorder();
    }
  }
}
