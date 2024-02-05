import { CellType } from '../common/constant';
import type { TextTheme } from '../common/interface';
import { TableDataCell } from './table-data-cell';

export class TableSeriesNumberCell extends TableDataCell {
  public get cellType() {
    /*
     * 在行列冻结并且开启序号时
     * 如果行头冻结 2 列，并且 CellTypes 设置成以前的 RowCell 时，【 FrozenRowGroup 的分割线】和【左上角和左下角的边框样式】样式会混乱
     * 因此下层在选择到序号时，需要将 cellType 修改为 RowCell, 保证交互逻辑统一:
     *     packages/s2-core/src/utils/interaction/select-event.ts -> getCellMeta
     */
    return CellType.DATA_CELL;
  }

  protected getTextStyle(): TextTheme {
    const textOverflowStyle = this.getCellTextWordWrapStyle(
      CellType.SERIES_NUMBER_CELL,
    );
    const style = this.theme.rowCell!.seriesText!;

    return {
      ...textOverflowStyle,
      ...style,
    };
  }
}
