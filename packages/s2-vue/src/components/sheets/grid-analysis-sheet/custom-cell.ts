import { DataCell, drawCustomContent } from '@antv/s2';

/**
 * Cell for panelGroup area
 * -------------------------------------
 * | label                              |
 * | measureLabel  |  measure | measure |
 * | measureLabel  |  measure | measure |
 * --------------------------------------
 */
export class GridAnalysisSheetDataCell extends DataCell {
  public drawTextShape() {
    if (this.isMultiData()) {
      return drawCustomContent(this);
    }

    super.drawTextShape();
  }
}
