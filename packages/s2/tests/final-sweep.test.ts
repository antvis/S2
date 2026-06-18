import { describe, it, expect } from 'vitest';
import { createWorkbook, FormulaModule, PivotModule, SortModule, FilterModule, EditModule, FreezeModule } from '../src/index';

describe('final sweep', () => {
  it('pivot.drill undo restores non-pivot cells', () => {
    const wb = createWorkbook({ modules: [PivotModule, FormulaModule] });
    wb.registerDataSource('d', [{ x: 'A', v: 10 }, { x: 'B', v: 20 }]);
    wb.apply([{ type: 'pivot.setConfig', payload: { sheet: 0, dataSourceId: 'd', rows: ['x'], columns: [], values: ['v'], valueAggregation: { v: 'SUM' }, showGrandTotal: false, showSubTotals: false } }]);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 5, value: 'extra' } }]);

    wb.apply([{ type: 'pivot.drill', payload: { sheet: 0, dimension: 'x', value: 'A' } }]);
    wb.undo();

    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 5 })).toBe('extra');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(10);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(20);
  });

  it('undo createSheet removes it, redo brings it back', () => {
    const wb = createWorkbook();
    wb.apply([{ type: 'createSheet', payload: { name: 'New' } }]);
    expect(wb.toJSON().sheets).toHaveLength(2);

    wb.undo();
    expect(wb.toJSON().sheets).toHaveLength(1);

    wb.redo();
    expect(wb.toJSON().sheets).toHaveLength(2);
    expect(wb.toJSON().sheets[1].name).toBe('New');
  });

  it('renameSheet undo/redo cycle', () => {
    const wb = createWorkbook();
    expect(wb.toJSON().sheets[0].name).toBe('Sheet1');

    wb.apply([{ type: 'renameSheet', payload: { sheet: 0, name: 'Renamed' } }]);
    expect(wb.toJSON().sheets[0].name).toBe('Renamed');

    wb.undo();
    expect(wb.toJSON().sheets[0].name).toBe('Sheet1');

    wb.redo();
    expect(wb.toJSON().sheets[0].name).toBe('Renamed');
  });

  it('toJSON + createWorkbook snapshot round-trip preserves formulas', () => {
    const wb1 = createWorkbook({ modules: [FormulaModule] });
    wb1.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 7 } }]);
    wb1.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*3' } }]);
    expect(wb1.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(21);

    const json = wb1.toJSON();
    const wb2 = createWorkbook({ modules: [FormulaModule], snapshot: json });
    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(21);

    // Changing dependency in wb2 should trigger recalc
    wb2.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(30);
  });

  it('toJSON + snapshot preserves cell styles', () => {
    const wb1 = createWorkbook();
    wb1.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'styled' } }]);
    wb1.apply([{ type: 'setCellStyle', payload: { sheet: 0, row: 0, col: 0, style: { bold: true } } }]);

    const json = wb1.toJSON();
    const wb2 = createWorkbook({ snapshot: json });
    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('styled');
    const raw = wb2.query.getCellRawValue({ sheet: 0, row: 0, col: 0 }) as any;
    expect(raw.style?.bold).toBe(true);
  });

  it('filter.set then sort.set then undo both in order', () => {
    const wb = createWorkbook({ modules: [FilterModule, SortModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 3 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 1 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 2 } },
    ]);
    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 1 } } }]);
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } }]);

    wb.undo(); // undo sort
    expect(wb.query.moduleQuery('sort.getState', { sheet: 0 })).toBe(null);
    const filters1 = wb.query.moduleQuery('filter.getRules', { sheet: 0 }) as any[];
    expect(filters1.length).toBe(1);

    wb.undo(); // undo filter
    const filters2 = wb.query.moduleQuery('filter.getRules', { sheet: 0 }) as any[];
    expect(filters2.length).toBe(0);
  });

  it('edit.paste overwrites existing data and undo restores it', () => {
    const wb = createWorkbook({ modules: [EditModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'src' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'existing' } },
    ]);
    wb.apply([{ type: 'edit.copy', payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 } } }]);
    wb.apply([{ type: 'edit.paste', payload: { sheet: 0, row: 1, col: 0 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('src');

    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('existing');
  });
});
