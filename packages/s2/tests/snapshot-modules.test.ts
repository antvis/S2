import { describe, it, expect } from 'vitest';
import { createWorkbook, FormulaModule, PivotModule, SortModule, FilterModule, EditModule } from '../src/index';

describe('snapshot and module interactions', () => {
  it('snapshot round-trip preserves pivot config and data', () => {
    const wb1 = createWorkbook({ modules: [PivotModule] });
    wb1.registerDataSource('s', [{ a: 'X', b: 10 }, { a: 'Y', b: 20 }]);
    wb1.apply([{ type: 'pivot.setConfig', payload: { sheet: 0, dataSourceId: 's', rows: ['a'], columns: [], values: ['b'], valueAggregation: { b: 'SUM' }, showGrandTotal: false, showSubTotals: false } }]);
    expect(wb1.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(10);

    const json = wb1.toJSON();
    const wb2 = createWorkbook({ modules: [PivotModule], snapshot: json });
    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(10);
    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(20);
  });

  it('snapshot round-trip preserves sort state', () => {
    const wb1 = createWorkbook({ modules: [SortModule] });
    wb1.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 3 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 1 } },
    ]);
    wb1.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } }]);
    const state1 = wb1.query.moduleQuery('sort.getState', { sheet: 0 }) as any;
    expect(state1.sortBy[0].order).toBe('asc');

    const json = wb1.toJSON();
    const wb2 = createWorkbook({ modules: [SortModule], snapshot: json });
    const state2 = wb2.query.moduleQuery('sort.getState', { sheet: 0 }) as any;
    expect(state2).not.toBe(null);
    expect(state2.sortBy[0].order).toBe('asc');
  });

  it('snapshot round-trip preserves filter rules', () => {
    const wb1 = createWorkbook({ modules: [FilterModule] });
    wb1.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
    wb1.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 5 } } }]);
    const rules1 = wb1.query.moduleQuery('filter.getRules', { sheet: 0 }) as any[];
    expect(rules1.length).toBe(1);

    const json = wb1.toJSON();
    const wb2 = createWorkbook({ modules: [FilterModule], snapshot: json });
    const rules2 = wb2.query.moduleQuery('filter.getRules', { sheet: 0 }) as any[];
    expect(rules2.length).toBe(1);
    expect(rules2[0].condition.type).toBe('greaterThan');
  });

  it('edit.paste into formula cell overwrites formula', () => {
    const wb = createWorkbook({ modules: [FormulaModule, EditModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'src' } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 0, formula: '=1+2' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(3);

    wb.apply([{ type: 'edit.copy', payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 } } }]);
    wb.apply([{ type: 'edit.paste', payload: { sheet: 0, row: 1, col: 0 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('src');
    expect(wb.query.moduleQuery('formula.traceFormula', { sheet: 0, row: 1, col: 0 })).toBe(null);
  });

  it('pivot.setConfig on sheet with existing manual data', () => {
    const wb = createWorkbook({ modules: [PivotModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'manual' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 5, value: 'keep' } },
    ]);
    wb.registerDataSource('p', [{ k: 'A', v: 99 }]);
    wb.apply([{ type: 'pivot.setConfig', payload: { sheet: 0, dataSourceId: 'p', rows: ['k'], columns: [], values: ['v'], valueAggregation: { v: 'SUM' }, showGrandTotal: false, showSubTotals: false } }]);

    // Pivot overwrites col 0 but col 5 manual data survives? Actually materializeToModel clears and rewrites.
    // This tests that pivot doesn't crash with pre-existing data.
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(99);
  });

  it('multiple undo past all operations returns to empty state', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1' } }]);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 2 } }]);

    wb.undo();
    wb.undo();
    wb.undo();

    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(null);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(null);
    expect(wb.query.moduleQuery('formula.traceFormula', { sheet: 0, row: 0, col: 1 })).toBe(null);
  });
});
