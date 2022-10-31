import { CellTypes } from '../common/constant';
import type { TextTheme } from '../common/interface';
import { TableDataCell } from './table-data-cell';

export class TableSeriesCell extends TableDataCell {
  public get cellType() {
    // 在行列冻结并且开启序号时
    // 那么在如果行头冻结2列，并且CellTypes设置成以前的RowCell时，【FrozenRowGroup的分割线】和【左上角和左下角的边框样式】样式会混乱
    return CellTypes.DATA_CELL;
  }

  protected getTextStyle(): TextTheme {
    return this.theme.rowCell.seriesText;
  }
}
