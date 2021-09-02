import { DataCell } from 'src/cell/data-cell';
import { TextTheme } from '@/common/interface';
import { CellTypes } from '@/common/constant';

export class TableRowCell extends DataCell {
  public get cellType() {
    return CellTypes.DATA_CELL;
  }

  protected getTextStyle(): TextTheme {
    return this.theme.rowCell.text;
  }
}
