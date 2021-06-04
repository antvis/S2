import { drawObjectText, drawStringText } from '@/utils/text';
import { isObject } from 'lodash';
import { DataCell } from '@/cell/data-cell';

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
    const { formattedValue: text } = this.getData();
    if (isObject(text)) {
      drawObjectText(this);
    } else {
      drawStringText(this);
    }
  }
}
