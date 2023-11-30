import type { Node } from '../layout/node';
import { FrozenRowCell, RowCell } from '../../cell';
import { BaseFrozenRowHeader } from './base-frozen-row';

export class PivotRowHeader extends BaseFrozenRowHeader {
  protected createCellInstance(item: Node): RowCell {
    const { spreadsheet, scrollY } = this.headerConfig;
    const frozenRow = this.isFrozenRow(item);
    return new FrozenRowCell(
      item,
      spreadsheet,
      {
        ...this.headerConfig,
        scrollY: frozenRow ? 0 : scrollY,
      },
      frozenRow,
    );
  }
}
