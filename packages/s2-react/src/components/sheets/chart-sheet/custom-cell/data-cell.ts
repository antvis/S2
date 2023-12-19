import { DataCell } from '@antv/s2';

export class ChartSheetDataCell extends DataCell {
  public drawTextShape() {
    if (this.isMultiData()) {
      return null;
    }

    super.drawTextShape();
  }
}
