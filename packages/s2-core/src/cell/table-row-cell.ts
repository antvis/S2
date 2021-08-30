import { DataCell } from 'src/cell/data-cell';
import { TableRowCellCondition } from '../condition/table-row-cell-condition';

export class TableRowCell extends DataCell {
  protected drawConditionsShapes() {
    const { spreadsheet, meta, theme } = this;
    const { conditions } = this.spreadsheet.options;
    this.cellCondition = new TableRowCellCondition(
      spreadsheet,
      meta,
      theme,
      conditions,
    );
    this.add(this.cellCondition);
  }
}
