import {
  ColCell,
  type ColHeaderConfig,
  drawCustomContent,
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
export class StrategySheetColCell extends ColCell {
  constructor(
    meta: Node,
    spreadsheet: SpreadSheet,
    headerConfig: ColHeaderConfig,
  ) {
    super(meta, spreadsheet, headerConfig);
  }

  public drawTextShape() {
    const meta = this.getMeta();
    const value = safeJsonParse<MultiData>(meta?.value);

    if (!isArray(value)) {
      return super.drawTextShape();
    }

    const { formattedValue } = this.getFormattedFieldValue();
    const displayValues =
      formattedValue !== meta?.value ? [[formattedValue]] : [value];

    drawCustomContent(
      this,
      {
        values: displayValues,
      },
      false,
    );
  }
}
