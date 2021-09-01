import { DataCell } from 'src/cell/data-cell';
import { TextTheme } from '@/common/interface';

export class TableRowCell extends DataCell {
  protected getTextStyle(): TextTheme {
    return this.theme.rowCell.text;
  }
}
