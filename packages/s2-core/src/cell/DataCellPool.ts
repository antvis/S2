import { DataCell } from './data-cell';

export class DataCellPool {
  static pool: DataCell[] = [];

  static acquire(): DataCell | undefined {
    return DataCellPool.pool.shift();
  }

  static release(cell: DataCell) {
    DataCellPool.pool.push(cell);
  }
}
