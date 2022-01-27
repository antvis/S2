import { drawObjectText } from '@antv/s2';
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

  protected getValues() {
    const fieldValue = this.getMeta()?.value;
    try {
      return [JSON.parse(fieldValue)];
    } catch {
      return null;
    }
  }

  protected drawTextShape() {
    const values = this.getValues();
    if (isArray(values)) {
      drawObjectText(this, { values }, true);
    } else {
      super.drawTextShape();
    }
  }
}
