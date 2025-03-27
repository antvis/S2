import { DataCell } from './data-cell';

export class DataCellPool {
  static pool: DataCell[] = [];

  static acquire(): DataCell | undefined {
    return DataCellPool.pool.shift();
  }

  static release(cell: DataCell) {
    if (!cell.getRenderer()) {
      DataCellPool.pool.push(cell);
    } else {
      cell.destroy();
    }
  }
}
