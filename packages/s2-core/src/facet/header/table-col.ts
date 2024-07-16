import { ColCell, TableColCell, TableCornerCell } from '../../cell';
import { SERIES_NUMBER_FIELD } from '../../common/constant';
import type { SpreadSheet } from '../../sheet-type';
import type { Node } from '../layout/node';
import { ColHeader } from './col';
import type { ColHeaderConfig } from './interface';

/**
 * Column Header for SpreadSheet
 */
export class TableColHeader extends ColHeader {
  protected getCellInstance(node: Node) {
    const headerConfig = this.getHeaderConfig();
    const { spreadsheet } = headerConfig;
    const { seriesNumberCell, colCell } = spreadsheet.options;

    const args: [Node, SpreadSheet, ColHeaderConfig] = [
      node,
      spreadsheet,
      headerConfig,
    ];

    if (node.field === SERIES_NUMBER_FIELD) {
      return (seriesNumberCell?.(...args) ||
        new TableCornerCell(...args)) as ColCell;
    }

    return colCell?.(...args) || new TableColCell(...args);
  }
}
