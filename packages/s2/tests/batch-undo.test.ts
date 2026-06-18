import { describe, it, expect } from 'vitest';
import { createWorkbook, FormulaModule, EditModule, SortModule, FilterModule } from '../src/index';

describe('batch undo correctness', () => {
  it('batch setCellValue on same cell: undo restores first value', () => {
    const wb = createWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'first' } }]);
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'A' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'B' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'C' } },
    ]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('C');

    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('first');
  });

  it('batch delete + write same cell: undo restores original', () => {
    const wb = createWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'orig' } }]);
    wb.apply([
      { type: 'deleteCellValue', payload: { sheet: 0, row: 0, col: 0 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'new' } },
    ]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('new');

    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('orig');
  });

  it('batch with formula + value on different cells: undo both', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*2' } },
    ]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(20);

    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(null);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(null);
  });

  it('importCSV undo restores all previous cells', () => {
    const wb = createWorkbook();
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'A' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'B' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 1 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 1, value: 2 } },
    ]);
    wb.importCSV('X,Y,Z\n10,20,30', 0);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('X');

    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('A');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe('B');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(1);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(2);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(null);
  });

  it('importCSV undo + redo round-trip', () => {
    const wb = createWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'before' } }]);
    wb.importCSV('after\n1', 0);
    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('before');
    wb.redo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('after');
  });

  it('batch sort.set + filter.set: undo restores both', () => {
    const wb = createWorkbook({ modules: [SortModule, FilterModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 5 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 10 } },
    ]);
    // Single batch with both sort and filter — unusual but valid
    wb.apply([
      { type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'desc' }] } },
    ]);
    wb.apply([
      { type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 3 } } },
    ]);

    wb.undo();
    wb.undo();
    expect(wb.query.moduleQuery('sort.getState', { sheet: 0 })).toBe(null);
    expect((wb.query.moduleQuery('filter.getRules', { sheet: 0 }) as any[]).length).toBe(0);
  });
});
