import { type G2Spec } from '@antv/g2';
import { CellBorderPosition, CellClipBox, CellType } from '@antv/s2';
import { AxisCellType } from '../constant';
import { RowAxisCell } from './row-axis-cell';

export class ColAxisCell extends RowAxisCell {
  public get cellType() {
    return AxisCellType.ROW_AXIS_CELL as unknown as CellType;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.BOTTOM, CellBorderPosition.RIGHT];
  }

  getChartOptions(): G2Spec {
    const chartOptions = {
      ...this.getBBoxByType(CellClipBox.PADDING_BOX),
      ...(this.spreadsheet.isValueInCols()
        ? this.getAxisYOptions()
        : this.getAxisXOptions()),
      coordinate: {
        transform: this.spreadsheet.isValueInCols()
          ? [{ type: 'transpose' }]
          : undefined,
      },
      labelAlign: 'horizontal',
    } as G2Spec;

    return chartOptions;
  }
}
