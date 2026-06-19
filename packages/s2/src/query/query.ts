import type { WorkbookModel } from '../core/model';
import type { CellState } from '../core/types';
import type { ModuleQueryDef } from '../module/types';
import { ChangeSet } from './changeset';

type ModuleQueryEntry = { handler: (state: unknown, params: Record<string, unknown>, model: WorkbookModel) => unknown; getState: () => unknown };

export class QueryLayer {
  private readonly model: WorkbookModel;
  private readonly cache = new Map<string, unknown>();
  private readonly changeSet = new ChangeSet();
  private readonly moduleQueries = new Map<string, ModuleQueryEntry>();

  constructor(model: WorkbookModel) {
    this.model = model;
  }

  registerModuleQuery(name: string, handler: (state: unknown, params: Record<string, unknown>, model: WorkbookModel) => unknown, getState: () => unknown): void {
    this.moduleQueries.set(name, { handler, getState });
  }

  moduleQuery(name: string, params: Record<string, unknown> = {}): unknown {
    const entry = this.moduleQueries.get(name);
    if (!entry) throw new Error(`Unknown query: "${name}"`);
    return entry.handler(entry.getState(), params, this.model);
  }

  tryModuleQuery(name: string, params: Record<string, unknown> = {}): unknown | undefined {
    const entry = this.moduleQueries.get(name);
    if (!entry) return undefined;
    return entry.handler(entry.getState(), params, this.model);
  }

  getCellDisplayValue(addr: { sheet: number; row: number; col: number }): string | number | boolean | null {
    const key = `display:${addr.sheet}:${addr.row}:${addr.col}`;
    if (!this.changeSet.isCellDirty(addr.sheet, addr.row, addr.col) && this.cache.has(key)) {
      return this.cache.get(key) as string | number | boolean | null;
    }
    const cell = this.model.getCell(addr.sheet, addr.row, addr.col);
    const value = this.resolveDisplayValue(cell);
    this.cache.set(key, value);
    return value;
  }

  getCellRawValue(addr: { sheet: number; row: number; col: number }): CellState | undefined {
    return this.model.getCell(addr.sheet, addr.row, addr.col);
  }

  getMerges(sheet: number): import('../core/types').MergeRange[] {
    return this.model.getSheet(sheet)?.merges ?? [];
  }

  queryRange(params: { sheet: number; range: { startRow: number; endRow: number; startCol: number; endCol: number } }): (string | number | boolean | null)[][] {
    const { sheet, range } = params;
    const result: (string | number | boolean | null)[][] = [];
    for (let row = range.startRow; row <= range.endRow; row++) {
      const rowData: (string | number | boolean | null)[] = [];
      for (let col = range.startCol; col <= range.endCol; col++) {
        rowData.push(this.getCellDisplayValue({ sheet, row, col }));
      }
      result.push(rowData);
    }
    return result;
  }

  markDirty(sheet: number, row: number, col: number): void {
    this.changeSet.markCell(sheet, row, col);
  }

  markSheetDirty(): void {
    this.changeSet.markSheetStructure();
    this.cache.clear();
  }

  invalidateAll(): void {
    this.cache.clear();
    this.changeSet.clear();
  }

  private resolveDisplayValue(cell: CellState | undefined): string | number | boolean | null {
    if (!cell) return null;
    if (cell.computedValue !== undefined) return cell.computedValue;
    return cell.value ?? null;
  }
}
