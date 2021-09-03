import { CellTypes } from '@/common/constant';
import { TextTheme } from '@/common/interface';
import { DataCell } from 'src/cell/data-cell';

export class TableRowCell extends DataCell {
  public get cellType() {
    return CellTypes.ROW_CELL;
  }

  protected getTextStyle(): TextTheme {
    return this.theme.rowCell.text;
  }
}
