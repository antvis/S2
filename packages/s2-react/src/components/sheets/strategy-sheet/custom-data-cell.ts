import { isObject } from 'lodash';
import {
  DataCell,
  drawObjectText,
  drawObjecConditionIconShapes,
} from '@antv/s2';

/**
 * Cell for panelGroup area
 * -------------------------------------
 * | measure1 measure2  measure3 |
 * | measure1 measure2  measure3 |
 * --------------------------------------
 */
export class CustomDataCell extends DataCell {
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

  protected drawConditionIconShapes() {
    if (isObject(this.getMeta().fieldValue)) {
      drawObjecConditionIconShapes(this);
    } else {
      super.drawConditionIconShapes();
    }
  }
}
