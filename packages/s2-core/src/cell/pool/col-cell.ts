import { ColCell } from '../col-cell';
import { BaseCellPool } from './base';

export class ColCellPool extends BaseCellPool<ColCell> {
  private readonly cellIdPool = new Set<string>();

  acquire(): ColCell | undefined {
    const cell = super.acquire();

    if (cell) {
      this.cellIdPool.delete(cell.getMeta().id);
    }

    return cell;
  }

  release(cell: ColCell): void {
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
