import { DataCell } from 'src/cell/data-cell';
import { TableDataCellCondition } from '../condition/table-data-celll-condition';

export class TableDataCell extends DataCell {
  protected drawConditionsShapes() {
    const { spreadsheet, meta, theme } = this;
    const { conditions } = this.spreadsheet.options;
    this.cellCondition = new TableDataCellCondition(
      spreadsheet,
      meta,
      theme,
      conditions,
    );
    this.add(this.cellCondition);
  }
}
