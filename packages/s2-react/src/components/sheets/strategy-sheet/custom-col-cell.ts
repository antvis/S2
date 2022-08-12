import {
  ColCell,
  type ColHeaderConfig,
  drawObjectText,
  Node,
  safeJsonParse,
  SpreadSheet,
  type MultiData,
} from '@antv/s2';
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
    const meta = this.getMeta();
    const value = safeJsonParse(meta?.value) as MultiData;

    if (!isArray(value)) {
      return super.drawTextShape();
    }

    const { formattedValue } = this.getFormattedFieldValue();
    const displayValues =
      formattedValue !== meta?.value ? [[formattedValue]] : [value];

    drawObjectText(this, { values: displayValues }, false);
  }
}
