import { CellTypes } from '../common/constant';
import type { TextTheme } from '../common/interface';
import { TableDataCell } from './table-data-cell';

export class TableSeriesCell extends TableDataCell {
  public get cellType() {
    // 在行列冻结并且开启序号时
    // 那么在如果行头冻结2列，并且CellTypes设置成以前的RowCell时，【FrozenRowGroup的分割线】和【左上角和左下角的边框样式】样式会混乱
    // 因此下层在选择到序号时，需要将 cellType 修改为 RowCell, 保证交互逻辑统一:
    //     packages/s2-core/src/utils/interaction/select-event.ts -> getCellMeta
    return CellTypes.DATA_CELL;
  }

  protected getTextStyle(): TextTheme {
    return this.theme.rowCell!.seriesText!;
  }
}
