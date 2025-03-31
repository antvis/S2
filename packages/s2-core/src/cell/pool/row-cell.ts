import { uniqBy } from 'lodash';
import { RowCell } from '../row-cell';
import { BaseCellPool } from './base';

export class RowCellPool extends BaseCellPool<RowCell> {
  release(cell: RowCell) {
    this.pool = uniqBy([...this.pool, cell], (c: RowCell) => c.getMeta().id);
  }
}
