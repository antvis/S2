import {
  DataCell,
  drawObjectText,
  type RenderTextShapeOptions,
} from '@antv/s2';

/**
 * Cell for panelGroup area
 * -------------------------------------
 * | label                              |
 * | measureLabel  |  measure | measure |
 * | measureLabel  |  measure | measure |
 * --------------------------------------
 */
export class GridAnalysisSheetDataCell extends DataCell {
  public drawTextShape(options?: RenderTextShapeOptions) {
    if (this.isMultiData()) {
      return drawObjectText(this);
    }

    super.drawTextShape(options);
  }
}
