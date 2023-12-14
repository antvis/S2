import { DataCell, drawObjectText } from '@antv/s2';

/**
 * Cell for panelGroup area
 * -------------------------------------
 * | measure1 measure2  measure3 |
 * | measure1 measure2  measure3 |
 * --------------------------------------
 */
export class StrategySheetDataCell extends DataCell {
  public drawTextShape() {
    if (this.isMultiData()) {
      return drawObjectText(this);
    }

    super.drawTextShape();
  }
}
