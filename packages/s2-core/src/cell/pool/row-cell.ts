import { RowCell } from '../row-cell';
import { BaseCellPool } from './base';

export class RowCellPool extends BaseCellPool<RowCell> {
  private readonly cellIdPool = new Set<string>();

  acquire(): RowCell | undefined {
    const cell = super.acquire();

    if (cell) {
      this.cellIdPool.delete(cell.getMeta().id);
    }

    return cell;
  }

  release(cell: RowCell): void {
    if (cell.getRenderer()) {
      cell.destroy();

      return;
    }

    const cellId = cell.getMeta().id;

    if (this.cellIdPool.has(cellId)) {
      return;
    }

    super.release(cell);
    this.cellIdPool.add(cellId);
  }
}
