import { isObject } from 'lodash';
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
export class CustomCell extends DataCell {
  public drawTextShape(options?: RenderTextShapeOptions) {
    if (isObject(this.getMeta().fieldValue)) {
      drawObjectText(this);
    } else {
      super.drawTextShape(options);
    }
  }
}
