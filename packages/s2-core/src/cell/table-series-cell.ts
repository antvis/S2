import { CellTypes } from '../common/constant';
import type { TextTheme } from '../common/interface';
import { TableDataCell } from './table-data-cell';

export class TableSeriesCell extends TableDataCell {
  public get cellType() {
    return CellTypes.ROW_CELL;
  }

  protected getTextStyle(): TextTheme {
    return this.theme.rowCell.seriesText;
  }
}
