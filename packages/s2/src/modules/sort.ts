import type { WorkbookModel } from '../core/model';
import type { ModuleDefinition } from '../module/types';
import type { Operation } from '../operation/types';

interface SortCriterion {
  col: number;
  order: 'asc' | 'desc';
}

interface SortConfig {
  sheet: number;
  sortBy: SortCriterion[];
}

interface SortState {
  configs: Map<number, SortConfig>; // sheet -> config
  rowOrder: Map<number, number[]>; // sheet -> sorted row indices
}

function computeRowOrder(model: WorkbookModel, config: SortConfig): number[] {
  const sheet = model.getSheet(config.sheet);
  if (!sheet) return [];

  // Find max row
  let maxRow = 0;
  for (const [row] of sheet.cells) {
    if (row > maxRow) maxRow = row;
  }

  // Row 0 is header, sort rows 1..maxRow
  const rows: number[] = [];
  for (let i = 1; i <= maxRow; i++) {
    rows.push(i);
  }

  rows.sort((a, b) => {
    for (const criterion of config.sortBy) {
      const cellA = model.getCell(config.sheet, a, criterion.col);
      const cellB = model.getCell(config.sheet, b, criterion.col);
      const valA = cellA?.computedValue ?? cellA?.value ?? null;
      const valB = cellB?.computedValue ?? cellB?.value ?? null;

      let cmp = 0;
      if (valA === null && valB === null) cmp = 0;
      else if (valA === null) cmp = -1;
      else if (valB === null) cmp = 1;
      else if (typeof valA === 'number' && typeof valB === 'number') cmp = valA - valB;
      else cmp = String(valA).localeCompare(String(valB));

      if (cmp !== 0) return criterion.order === 'asc' ? cmp : -cmp;
    }
    return a - b; // stable: preserve original order
  });

  return rows;
}

export const SortModule: ModuleDefinition = {
  name: 'sort',

  state: (): SortState => ({ configs: new Map(), rowOrder: new Map() }),

  operations: {
    'sort.set': {
      meta: { affectLayout: true, undoable: true },
      execute(this: { state: SortState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, sortBy } = payload as { sheet: number; sortBy: SortCriterion[] };
        const oldConfig = this.state.configs.get(sheet);
        const oldSortBy = oldConfig ? [...oldConfig.sortBy] : [];

        if (sortBy.length === 0) {
          this.state.configs.delete(sheet);
          this.state.rowOrder.delete(sheet);
        } else {
          const config: SortConfig = { sheet, sortBy };
          this.state.configs.set(sheet, config);
          this.state.rowOrder.set(sheet, computeRowOrder(model, config));
        }

        return [{ type: 'sort.set', payload: { sheet, sortBy: oldSortBy } }];
      },
    },
    'sort.clear': {
      meta: { affectLayout: true, undoable: true },
      execute(this: { state: SortState }, _model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet } = payload as { sheet: number };
        const oldConfig = this.state.configs.get(sheet);
        const oldSortBy = oldConfig ? [...oldConfig.sortBy] : [];

        this.state.configs.delete(sheet);
        this.state.rowOrder.delete(sheet);

        if (oldSortBy.length > 0) {
          return [{ type: 'sort.set', payload: { sheet, sortBy: oldSortBy } }];
        }
        return [];
      },
    },
  },

  queries: {
    'sort.getState': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const sortState = state as SortState;
      const { sheet } = params as { sheet: number };
      const config = sortState.configs.get(sheet);
      return config ? { sortBy: config.sortBy } : null;
    },
    'sort.getRowOrder': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const sortState = state as SortState;
      const { sheet } = params as { sheet: number };
      return sortState.rowOrder.get(sheet) ?? null;
    },
  },

  lifecycle: {
    onOperationApplied(this: { state: SortState }, ops: Operation[], model: WorkbookModel) {
      for (const op of ops) {
        if (op.type === 'setCellValue' || op.type === 'restoreCell') {
          const { sheet } = op.payload as { sheet: number };
          const config = this.state.configs.get(sheet);
          if (config) {
            this.state.rowOrder.set(sheet, computeRowOrder(model, config));
          }
          break;
        }
      }
    },
  },
};
