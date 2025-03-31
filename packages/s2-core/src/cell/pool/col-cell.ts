import { uniqBy } from 'lodash';
import { ColCell } from '../col-cell';
import { BaseCellPool } from './base';

export class ColCellPool extends BaseCellPool<ColCell> {
  release(cell: ColCell) {
    this.pool = uniqBy([...this.pool, cell], (c: ColCell) => c.getMeta().id);
  }
}
