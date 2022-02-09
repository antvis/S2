import { drawObjectText, safeJsonParse } from '@antv/s2';
import { ColCell, Node, SpreadSheet, ColHeaderConfig } from '@antv/s2';
import { isArray } from 'lodash';

/**
 * Cell for StrategySheet
 * -------------------------------------
 * |       root label      |
 * | label1 label2  label3 |
 * --------------------------------------
 */
export class CustomColCell extends ColCell {
  constructor(
    meta: Node,
    spreadsheet: SpreadSheet,
    headerConfig: ColHeaderConfig,
  ) {
    super(meta, spreadsheet, headerConfig);
  }

  protected drawTextShape() {
    const fieldValue = this.getMeta()?.value;
    const values = safeJsonParse(fieldValue);
    if (isArray(values)) {
      drawObjectText(this, { values: [values] }, true);
    } else {
      super.drawTextShape();
    }
  }
}
