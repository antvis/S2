import { DataCell, type RenderTextShapeOptions } from '@antv/s2';

export class ChartSheetDataCell extends DataCell {
  public drawTextShape(options?: RenderTextShapeOptions) {
    if (this.isMultiData()) {
      return null;
    }

    super.drawTextShape(options);
  }
}
