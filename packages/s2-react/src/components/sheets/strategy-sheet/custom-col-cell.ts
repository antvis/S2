import { drawObjectText } from '@antv/s2';
import { ColCell, Node, SpreadSheet, ColHeaderConfig } from '@antv/s2';
import { isArray, split } from 'lodash';

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

  protected safeJsonParse(val: string) {
    try {
      return [JSON.parse(val)];
    } catch (err) {
      return false;
    }
  }

  protected drawTextShape() {
    const fieldValue = this.getMeta()?.value;
    const values = this.safeJsonParse(fieldValue);
    if (isArray(values)) {
      drawObjectText(this, { values }, true);
    } else {
      super.drawTextShape();
    }
  }
}
