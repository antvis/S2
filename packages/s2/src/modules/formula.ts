import type { WorkbookModel } from '../core/model';
import type { ModuleDefinition } from '../module/types';
import type { Operation } from '../operation/types';

interface CellRef {
  sheet: number;
  row: number;
  col: number;
}

interface FormulaEntry {
  ref: CellRef;
  formula: string;
  dependencies: CellRef[];
}

interface FormulaState {
  formulas: Map<string, FormulaEntry>;
  dependents: Map<string, Set<string>>; // cellKey → formula keys that depend on it
}

function cellKey(sheet: number, row: number, col: number): string {
  return `${sheet}:${row}:${col}`;
}

function parseFormula(formula: string, sheet: number): { dependencies: CellRef[]; evaluate: (getValue: (ref: CellRef) => number) => number } {
  // Simple formula parser supporting: =A1, =A1+B1, =SUM(A1:A10), =AVG(A1:A10), =MIN(...), =MAX(...), =COUNT(...)
  const expr = formula.startsWith('=') ? formula.slice(1) : formula;

  // Match function calls: SUM(A1:B10), AVG(A1:A5), etc.
  const funcMatch = expr.match(/^(SUM|AVG|AVERAGE|MIN|MAX|COUNT)\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/i);
  if (funcMatch) {
    const fn = funcMatch[1]!.toUpperCase();
    const startCol = colLabelToIndex(funcMatch[2]!);
    const startRow = parseInt(funcMatch[3]!, 10) - 1;
    const endCol = colLabelToIndex(funcMatch[4]!);
    const endRow = parseInt(funcMatch[5]!, 10) - 1;

    const deps: CellRef[] = [];
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        deps.push({ sheet, row: r, col: c });
      }
    }

    const evaluate = (getValue: (ref: CellRef) => number): number => {
      const values = deps.map(getValue);
      switch (fn) {
        case 'SUM': return values.reduce((a, b) => a + b, 0);
        case 'AVG':
        case 'AVERAGE': return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        case 'MIN': return values.length > 0 ? Math.min(...values) : 0;
        case 'MAX': return values.length > 0 ? Math.max(...values) : 0;
        case 'COUNT': return values.length;
        default: return 0;
      }
    };

    return { dependencies: deps, evaluate };
  }

  // Match simple arithmetic: A1*1.1, A1+B1, A1-B1, A1/B1
  const tokens = tokenizeArithmetic(expr, sheet);
  if (tokens) {
    return tokens;
  }

  // Single cell reference: A1, B2, etc.
  const singleRef = parseCellRef(expr, sheet);
  if (singleRef) {
    return {
      dependencies: [singleRef],
      evaluate: (getValue) => getValue(singleRef),
    };
  }

  // Constant number
  const num = parseFloat(expr);
  if (!isNaN(num)) {
    return { dependencies: [], evaluate: () => num };
  }

  return { dependencies: [], evaluate: () => NaN };
}

function tokenizeArithmetic(expr: string, sheet: number): { dependencies: CellRef[]; evaluate: (getValue: (ref: CellRef) => number) => number } | null {
  // Tokenize into numbers, cell refs, and operators (+, -, *, /)
  const tokenRegex = /([A-Z]+\d+)|(\d+\.?\d*)|([+\-*/])/gi;
  const tokens: { type: 'ref' | 'num' | 'op'; value: string; ref?: CellRef }[] = [];
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = tokenRegex.exec(expr)) !== null) {
    if (match.index !== lastIndex) return null; // unexpected characters
    lastIndex = tokenRegex.lastIndex;

    if (match[1]) {
      const ref = parseCellRef(match[1], sheet);
      if (!ref) return null;
      tokens.push({ type: 'ref', value: match[1], ref });
    } else if (match[2]) {
      tokens.push({ type: 'num', value: match[2] });
    } else if (match[3]) {
      tokens.push({ type: 'op', value: match[3] });
    }
  }

  if (lastIndex !== expr.length || tokens.length < 3) return null;

  const deps = tokens.filter((t) => t.type === 'ref').map((t) => t.ref!);

  const evaluate = (getValue: (ref: CellRef) => number): number => {
    // Convert tokens to values
    const values: number[] = [];
    const ops: string[] = [];

    for (const token of tokens) {
      if (token.type === 'ref') {
        values.push(getValue(token.ref!));
      } else if (token.type === 'num') {
        values.push(parseFloat(token.value));
      } else if (token.type === 'op') {
        ops.push(token.value);
      }
    }

    // Evaluate with operator precedence: * / first, then + -
    // First pass: * and /
    let i = 0;
    while (i < ops.length) {
      if (ops[i] === '*' || ops[i] === '/') {
        const left = values[i]!;
        const right = values[i + 1]!;
        const result = ops[i] === '*' ? left * right : (right !== 0 ? left / right : NaN);
        values.splice(i, 2, result);
        ops.splice(i, 1);
      } else {
        i++;
      }
    }

    // Second pass: + and -
    let result = values[0]!;
    for (let j = 0; j < ops.length; j++) {
      if (ops[j] === '+') result += values[j + 1]!;
      else if (ops[j] === '-') result -= values[j + 1]!;
    }

    return result;
  };

  return { dependencies: deps, evaluate };
}

function parseCellRef(str: string, sheet: number): CellRef | null {
  const match = str.match(/^([A-Z]+)(\d+)$/i);
  if (!match) return null;
  const col = colLabelToIndex(match[1]!);
  const row = parseInt(match[2]!, 10) - 1;
  return { sheet, row, col };
}

function colLabelToIndex(label: string): number {
  let result = 0;
  for (let i = 0; i < label.length; i++) {
    result = result * 26 + (label.charCodeAt(i) - 64);
  }
  return result - 1;
}

function recalculate(state: FormulaState, model: WorkbookModel): void {
  // Rebuild dependents index
  state.dependents.clear();
  for (const [key, entry] of state.formulas) {
    addDependents(state, key, entry.dependencies);
  }

  const sorted = topologicalSort(state.formulas);
  const getValue = (ref: CellRef): number => {
    const cell = model.getCell(ref.sheet, ref.row, ref.col);
    if (!cell) return 0;
    if (cell.computedValue !== undefined && cell.computedValue !== null) return Number(cell.computedValue);
    if (cell.value !== undefined && cell.value !== null) return Number(cell.value);
    return 0;
  };
  for (const entry of sorted) {
    const parsed = parseFormula(entry.formula, entry.ref.sheet);
    const result = parsed.evaluate(getValue);
    const cell = model.getCell(entry.ref.sheet, entry.ref.row, entry.ref.col);
    model.setCell(entry.ref.sheet, entry.ref.row, entry.ref.col, {
      ...cell,
      formula: entry.formula,
      computedValue: result,
    });
  }
}

function recalcDirty(state: FormulaState, model: WorkbookModel, dirtyCells: Set<string>): void {
  if (dirtyCells.size === 0) return;
  const affected = new Set<string>();
  const queue = [...dirtyCells];
  while (queue.length > 0) {
    const key = queue.pop()!;
    const deps = state.dependents.get(key);
    if (!deps) continue;
    for (const fk of deps) {
      if (!affected.has(fk)) {
        affected.add(fk);
        queue.push(fk);
      }
    }
  }
  if (affected.size === 0) return;

  const entries = [...affected].map((k) => state.formulas.get(k)).filter(Boolean) as FormulaEntry[];
  const subMap = new Map<string, FormulaEntry>();
  for (const e of entries) subMap.set(cellKey(e.ref.sheet, e.ref.row, e.ref.col), e);
  const sorted = topologicalSort(subMap);

  const getValue = (ref: CellRef): number => {
    const cell = model.getCell(ref.sheet, ref.row, ref.col);
    if (!cell) return 0;
    if (cell.computedValue !== undefined && cell.computedValue !== null) return Number(cell.computedValue);
    if (cell.value !== undefined && cell.value !== null) return Number(cell.value);
    return 0;
  };
  for (const entry of sorted) {
    const parsed = parseFormula(entry.formula, entry.ref.sheet);
    const result = parsed.evaluate(getValue);
    const cell = model.getCell(entry.ref.sheet, entry.ref.row, entry.ref.col);
    model.setCell(entry.ref.sheet, entry.ref.row, entry.ref.col, {
      ...cell,
      formula: entry.formula,
      computedValue: result,
    });
  }
}

function addDependents(state: FormulaState, formulaKey: string, deps: CellRef[]): void {
  for (const dep of deps) {
    const depKey = cellKey(dep.sheet, dep.row, dep.col);
    if (!state.dependents.has(depKey)) state.dependents.set(depKey, new Set());
    state.dependents.get(depKey)!.add(formulaKey);
  }
}

function removeDependents(state: FormulaState, formulaKey: string, deps: CellRef[]): void {
  for (const dep of deps) {
    const depKey = cellKey(dep.sheet, dep.row, dep.col);
    state.dependents.get(depKey)?.delete(formulaKey);
  }
}

function topologicalSort(formulas: Map<string, FormulaEntry>): FormulaEntry[] {
  const visited = new Set<string>();
  const result: FormulaEntry[] = [];

  function visit(key: string): void {
    if (visited.has(key)) return;
    visited.add(key);
    const entry = formulas.get(key);
    if (!entry) return;
    for (const dep of entry.dependencies) {
      const depKey = cellKey(dep.sheet, dep.row, dep.col);
      visit(depKey);
    }
    result.push(entry);
  }

  for (const [key] of formulas) {
    visit(key);
  }

  return result;
}

export const FormulaModule: ModuleDefinition = {
  name: 'formula',

  state: (): FormulaState => ({ formulas: new Map(), dependents: new Map() }),

  operations: {
    'formula.setFormula': {
      meta: { needReCalc: true, affectLayout: false, undoable: true },
      execute(this: { state: FormulaState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, row, col, formula } = payload as { sheet: number; row: number; col: number; formula: string };
        const key = cellKey(sheet, row, col);
        const oldCell = model.getCell(sheet, row, col);
        const oldFormula = this.state.formulas.get(key);

        const parsed = parseFormula(formula, sheet);
        const oldEntry = this.state.formulas.get(key);
        if (oldEntry) removeDependents(this.state, key, oldEntry.dependencies);
        this.state.formulas.set(key, {
          ref: { sheet, row, col },
          formula,
          dependencies: parsed.dependencies,
        });
        addDependents(this.state, key, parsed.dependencies);

        // Set formula on cell and compute
        model.setCell(sheet, row, col, { formula, computedValue: null });
        recalculate(this.state, model);

        // Inverse
        if (oldFormula) {
          return [{ type: 'formula.setFormula', payload: { sheet, row, col, formula: oldFormula.formula } }];
        }
        return [{ type: 'formula.clearFormula', payload: { sheet, row, col, oldCell } }];
      },
    },
    'formula.clearFormula': {
      meta: { needReCalc: true, affectLayout: false, undoable: true },
      execute(this: { state: FormulaState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, row, col, oldCell } = payload as { sheet: number; row: number; col: number; oldCell?: Record<string, unknown> };
        const key = cellKey(sheet, row, col);
        const existing = this.state.formulas.get(key);
        if (existing) removeDependents(this.state, key, existing.dependencies);
        this.state.formulas.delete(key);

        if (oldCell) {
          model.setCell(sheet, row, col, oldCell as Parameters<WorkbookModel['setCell']>[3]);
        } else {
          model.deleteCell(sheet, row, col);
        }

        if (existing) {
          return [{ type: 'formula.setFormula', payload: { sheet, row, col, formula: existing.formula } }];
        }
        return [];
      },
    },
  },

  queries: {
    'formula.getDependents': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const formulaState = state as FormulaState;
      const { sheet, row, col } = params as { sheet: number; row: number; col: number };
      const key = cellKey(sheet, row, col);
      const dependents: CellRef[] = [];
      for (const [, entry] of formulaState.formulas) {
        if (entry.dependencies.some((d) => d.sheet === sheet && d.row === row && d.col === col)) {
          dependents.push(entry.ref);
        }
      }
      return dependents;
    },
    'formula.getFormula': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const formulaState = state as FormulaState;
      const { sheet, row, col } = params as { sheet: number; row: number; col: number };
      const key = cellKey(sheet, row, col);
      const entry = formulaState.formulas.get(key);
      return entry?.formula ?? null;
    },
  },

  lifecycle: {
    onOperationApplied(this: { state: FormulaState }, ops: Operation[], model: WorkbookModel) {
      const dirtyCells = new Set<string>();
      let fullRecalc = false;
      for (const op of ops) {
        if (op.type === 'setCellValue' || op.type === 'edit.commit') {
          const { sheet, row, col } = op.payload as { sheet: number; row: number; col: number };
          const key = cellKey(sheet, row, col);
          if (this.state.formulas.has(key)) {
            const entry = this.state.formulas.get(key)!;
            removeDependents(this.state, key, entry.dependencies);
            this.state.formulas.delete(key);
          }
          dirtyCells.add(key);
        } else if (op.type === 'restoreCell' || op.type === 'deleteCellValue') {
          fullRecalc = true;
        } else if (op.type === '__undo' || op.type === '__redo') {
          fullRecalc = true;
        }
      }
      if (this.state.formulas.size === 0) return;
      if (fullRecalc) {
        recalculate(this.state, model);
      } else if (dirtyCells.size > 0) {
        recalcDirty(this.state, model, dirtyCells);
      }
    },
  },
};
