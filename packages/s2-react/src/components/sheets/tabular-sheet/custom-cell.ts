import { isObject } from 'lodash';
import { DataCell, drawObjectText, drawStringText } from '@antv/s2';
// import { drawObjectText, drawStringText } from '@/utils/text';

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

  // TODO 条件格式
  protected drawTextShape() {
    const { formattedValue: text } = this.getFormattedFieldValue();
    if (isObject(text)) {
      drawObjectText(this);
    } else {
      drawStringText(this);
    }
  }
}
