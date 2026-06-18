import { describe, it, expect } from 'vitest';
import { createWorkbook, FormulaModule, PivotModule, SortModule, FilterModule, EditModule } from '../src/index';

describe('dark corners', () => {
  it('formula on pivot sheet survives pivot.clearConfig undo', () => {
    const wb = createWorkbook({ modules: [PivotModule, FormulaModule] });
    wb.registerDataSource('d', [{ x: 'A', v: 10 }, { x: 'B', v: 20 }]);
    wb.apply([{ type: 'pivot.setConfig', payload: { sheet: 0, dataSourceId: 'd', rows: ['x'], columns: [], values: ['v'], valueAggregation: { v: 'SUM' }, showGrandTotal: false, showSubTotals: false } }]);
    // Add formula on a cell outside pivot area
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 5, formula: '=A1+A2' } }]);
    const before = wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 5 });

    wb.apply([{ type: 'pivot.clearConfig', payload: { sheet: 0 } }]);
    wb.undo();

    // Pivot data and formula should both be restored
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(10);
    const trace = wb.query.moduleQuery('formula.traceFormula', { sheet: 0, row: 0, col: 5 }) as any;
    expect(trace).not.toBe(null);
  });

  it('sort.set then deleteRows then undo both', () => {
    const wb = createWorkbook({ modules: [SortModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 30 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 20 } },
    ]);
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } }]);
    wb.apply([{ type: 'deleteRows', payload: { sheet: 0, index: 1, count: 1 } }]);

    wb.undo(); // undo deleteRows
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(10);

    wb.undo(); // undo sort
    const sortState = wb.query.moduleQuery('sort.getState', { sheet: 0 });
    expect(sortState).toBe(null);
  });

  it('edit.paste writes correct values', () => {
    const wb = createWorkbook({ modules: [EditModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'X' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'Y' } },
    ]);
    wb.apply([{ type: 'edit.copy', payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 1 } } }]);
    wb.apply([{ type: 'edit.paste', payload: { sheet: 0, row: 2, col: 0 } }]);

    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('X');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 2, col: 1 })).toBe('Y');
  });

  it('edit.paste undo removes pasted values', () => {
    const wb = createWorkbook({ modules: [EditModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Z' } }]);
    wb.apply([{ type: 'edit.copy', payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 } } }]);
    wb.apply([{ type: 'edit.paste', payload: { sheet: 0, row: 1, col: 0 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('Z');

    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(null);
  });

  it('large batch: 500 setCellValue in one apply', () => {
    const wb = createWorkbook();
    const ops = [];
    for (let i = 0; i < 500; i++) {
      ops.push({ type: 'setCellValue', payload: { sheet: 0, row: i, col: 0, value: i } });
    }
    wb.apply(ops);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(0);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 499, col: 0 })).toBe(499);

    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(null);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 499, col: 0 })).toBe(null);
  });

  it('filter include with no matching values hides all rows', () => {
    const wb = createWorkbook({ modules: [FilterModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 2 } },
    ]);
    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'include', values: [999] } } }]);
    // Should not crash
    wb.apply([{ type: 'filter.clear', payload: { sheet: 0, col: 0 } }]);
  });

  it('formula constant expression =5+3', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 0, formula: '=5+3' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(8);
  });

  it('exportCSV handles boolean and null values', () => {
    const wb = createWorkbook();
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: true } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: false } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 2, value: 0 } },
    ]);
    const csv = wb.exportCSV(0);
    expect(csv).toContain('true');
    expect(csv).toContain('false');
    expect(csv).toContain('0');
  });
});
