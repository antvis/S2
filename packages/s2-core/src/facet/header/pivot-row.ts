import type { Node } from '../layout/node';
import { RowCell } from '../../cell/row-cell';
import { BaseFrozenRowHeader } from './base-frozen-row';

export class PivotRowHeader extends BaseFrozenRowHeader {
  public createCellInstance(node: Node): RowCell {
    const { spreadsheet, scrollY } = this.headerConfig;
    const frozenRow = this.isFrozenRow(node);

    return new RowCell(
      node,
      spreadsheet,
      {
        ...this.headerConfig,
        scrollY: frozenRow ? 0 : scrollY,
      },
      frozenRow,
    );
  }
}
