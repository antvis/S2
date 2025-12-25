import { DataCell } from '../data-cell';
import { BaseCellPool } from './base';

export class DataCellPool extends BaseCellPool<DataCell> {
  release(cell: DataCell) {
    if (!cell.getRenderer()) {
      this.pool.push(cell);
    } else {
      cell.destroy();
    }
  }
}
