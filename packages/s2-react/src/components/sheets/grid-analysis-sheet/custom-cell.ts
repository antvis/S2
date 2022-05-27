import { isObject } from 'lodash';
import { DataCell, drawObjectText } from '@antv/s2';

/**
 * Cell for panelGroup area
 * -------------------------------------
 * | label                              |
 * | measureLabel  |  measure | measure |
 * | measureLabel  |  measure | measure |
 * --------------------------------------
 */
export class CustomCell extends DataCell {
  /**
   * Render cell main text
   */

  protected drawTextShape() {
    if (isObject(this.getMeta().fieldValue)) {
      drawObjectText(this);
    } else {
      super.drawTextShape();
    }
  }
}
