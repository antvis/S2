import type { WorkbookModel } from '../core/model';
import type { ModuleDefinition } from '../module/types';
import type { Operation } from '../operation/types';

interface FilterRule {
  col: number;
  condition: FilterCondition;
}

interface FilterCondition {
  type: 'include' | 'exclude' | 'greaterThan' | 'lessThan' | 'between' | 'contains';
  values?: (string | number | boolean)[];
  value?: number;
  min?: number;
  max?: number;
  text?: string;
}

interface FilterState {
  filters: Map<number, FilterRule[]>; // sheet -> rules
  hiddenRows: Map<number, Set<number>>; // sheet -> hidden row indices
}

function evaluateCondition(cellValue: unknown, condition: FilterCondition): boolean {
  if (cellValue === null || cellValue === undefined) return false;
  switch (condition.type) {
    case 'include':
      return condition.values?.includes(cellValue as string | number | boolean) ?? false;
    case 'exclude':
      return !(condition.values?.includes(cellValue as string | number | boolean) ?? false);
    case 'greaterThan':
      return Number(cellValue) > (condition.value ?? 0);
    case 'lessThan':
      return Number(cellValue) < (condition.value ?? 0);
    case 'between':
      const num = Number(cellValue);
      return num >= (condition.min ?? -Infinity) && num <= (condition.max ?? Infinity);
    case 'contains':
      return String(cellValue).includes(condition.text ?? '');
  }
}

function recomputeHiddenRows(state: FilterState, model: WorkbookModel, sheet: number): void {
  const rules = state.filters.get(sheet);
  if (!rules || rules.length === 0) {
    state.hiddenRows.delete(sheet);
    return;
  }

  const sheetState = model.getSheet(sheet);
  if (!sheetState) return;

  const hidden = new Set<number>();
  // Find max row with data
  let maxRow = 0;
  for (const [row] of sheetState.cells) {
    if (row > maxRow) maxRow = row;
  }

  // Row 0 is usually header, start from row 1
  for (let row = 1; row <= maxRow; row++) {
    for (const rule of rules) {
      const cell = model.getCell(sheet, row, rule.col);
      const value = cell?.computedValue ?? cell?.value ?? null;
      if (!evaluateCondition(value, rule.condition)) {
        hidden.add(row);
        break;
      }
    }
  }

  state.hiddenRows.set(sheet, hidden);
}

export const FilterModule: ModuleDefinition = {
  name: 'filter',

  state: (): FilterState => ({ filters: new Map(), hiddenRows: new Map() }),

  operations: {
    'filter.set': {
      meta: {
        affectLayout: true, undoable: true,
        description: 'Set a filter rule on a column',
        inputSchema: {
          type: 'object',
          properties: { sheet: { type: 'number' }, col: { type: 'number' }, condition: { type: 'object' } },
          required: ['sheet', 'col', 'condition'],
        },
      },
      execute(this: { state: FilterState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, col, condition } = payload as { sheet: number; col: number; condition: FilterCondition };
        const oldRules = this.state.filters.get(sheet);
        const oldRulesCopy = oldRules ? [...oldRules] : [];

        let rules = this.state.filters.get(sheet);
        if (!rules) {
          rules = [];
          this.state.filters.set(sheet, rules);
        }

        // Replace existing rule for same col, or add new
        const idx = rules.findIndex((r) => r.col === col);
        if (idx >= 0) {
          rules[idx] = { col, condition };
        } else {
          rules.push({ col, condition });
        }

        recomputeHiddenRows(this.state, model, sheet);

        return [{ type: 'filter.restore', payload: { sheet, rules: oldRulesCopy } }];
      },
    },
    'filter.clear': {
      meta: {
        affectLayout: true, undoable: true,
        description: 'Clear filter rules on a sheet (optionally for a specific column)',
        inputSchema: {
          type: 'object',
          properties: { sheet: { type: 'number' }, col: { type: 'number' } },
          required: ['sheet'],
        },
      },
      execute(this: { state: FilterState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, col } = payload as { sheet: number; col?: number };
        const oldRules = this.state.filters.get(sheet);
        const oldRulesCopy = oldRules ? [...oldRules] : [];

        if (col !== undefined) {
          const rules = this.state.filters.get(sheet);
          if (rules) {
            const idx = rules.findIndex((r) => r.col === col);
            if (idx >= 0) rules.splice(idx, 1);
            if (rules.length === 0) this.state.filters.delete(sheet);
          }
        } else {
          this.state.filters.delete(sheet);
        }

        recomputeHiddenRows(this.state, model, sheet);

        return [{ type: 'filter.restore', payload: { sheet, rules: oldRulesCopy } }];
      },
    },
    'filter.restore': {
      meta: { affectLayout: true, undoable: true },
      execute(this: { state: FilterState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, rules } = payload as { sheet: number; rules: FilterRule[] };
        const oldRules = this.state.filters.get(sheet);
        const oldRulesCopy = oldRules ? [...oldRules] : [];

        if (rules.length === 0) {
          this.state.filters.delete(sheet);
        } else {
          this.state.filters.set(sheet, [...rules]);
        }

        recomputeHiddenRows(this.state, model, sheet);

        return [{ type: 'filter.restore', payload: { sheet, rules: oldRulesCopy } }];
      },
    },
  },

  queries: {
    'filter.getVisibleRows': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const filterState = state as FilterState;
      const { sheet, maxRow } = params as { sheet: number; maxRow?: number };
      const hidden = filterState.hiddenRows.get(sheet);
      if (!hidden || hidden.size === 0) return null; // null = all visible
      const visible: number[] = [];
      const max = maxRow ?? 1000;
      for (let i = 0; i <= max; i++) {
        if (!hidden.has(i)) visible.push(i);
      }
      return visible;
    },
    'filter.isRowHidden': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const filterState = state as FilterState;
      const { sheet, row } = params as { sheet: number; row: number };
      return filterState.hiddenRows.get(sheet)?.has(row) ?? false;
    },
    'filter.getHiddenRows': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const filterState = state as FilterState;
      const { sheet } = params as { sheet: number };
      return filterState.hiddenRows.get(sheet) ?? null;
    },
    'filter.getRules': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const filterState = state as FilterState;
      const { sheet } = params as { sheet: number };
      return filterState.filters.get(sheet) ?? [];
    },
  },

  lifecycle: {
    onOperationApplied(this: { state: FilterState }, ops: Operation[], model: WorkbookModel) {
      // Recompute hidden rows when cell values change
      const dirtySheets = new Set<number>();
      for (const op of ops) {
        if (op.type === 'setCellValue' || op.type === 'restoreCell') {
          dirtySheets.add((op.payload as { sheet: number }).sheet);
        }
      }
      for (const sheet of dirtySheets) {
        if (this.state.filters.has(sheet)) {
          recomputeHiddenRows(this.state, model, sheet);
        }
      }
    },
  },
};
