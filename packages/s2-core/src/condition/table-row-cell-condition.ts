import { CellCondition } from './cell-condition';

export class TableRowCellCondition extends CellCondition {
  protected getTextStyle() {
    return this.theme.rowCell.text;
  }

  protected getCellStyle() {
    return this.theme.rowCell.cell;
  }
}
