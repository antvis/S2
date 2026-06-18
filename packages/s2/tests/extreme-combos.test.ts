import { describe, it, expect } from 'vitest';
import { createWorkbook, FormulaModule, PivotModule, SortModule, FilterModule, FreezeModule, EditModule, ConditionalFormatModule, allModules } from '../src/index';

describe('extreme combos', () => {
  it('snapshot round-trip with ALL modules preserves everything', () => {
    const wb1 = createWorkbook({ modules: [FormulaModule, SortModule, FilterModule, FreezeModule, ConditionalFormatModule] });
    wb1.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 200 } },
    ]);
    wb1.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 2, col: 0, formula: '=SUM(A1:A2)' } }]);
    wb1.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } }]);
    wb1.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 50 } } }]);
    wb1.apply([{ type: 'freeze.set', payload: { sheet: 0, frozenRows: 1, frozenCols: 1 } }]);
    wb1.apply([{ type: 'conditionalFormat.addRule', payload: { sheet: 0, range: { startRow: 0, endRow: 2, startCol: 0, endCol: 0 }, rule: { type: 'greaterThan', value: 150 }, style: { bold: true } } }]);

    const json = wb1.toJSON();
    const wb2 = createWorkbook({ modules: [FormulaModule, SortModule, FilterModule, FreezeModule, ConditionalFormatModule], snapshot: json });

    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(300);
    expect((wb2.query.moduleQuery('sort.getState', { sheet: 0 }) as any).sortBy[0].order).toBe('asc');
    expect((wb2.query.moduleQuery('filter.getRules', { sheet: 0 }) as any[]).length).toBe(1);
    expect((wb2.query.moduleQuery('freeze.getConfig', { sheet: 0 }) as any).frozenRows).toBe(1);
    expect((wb2.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as any[]).length).toBe(1);

    // Formula still works after snapshot
    wb2.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 500 } }]);
    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(700);
  });

  it('rapid undo/redo cycle 20 times', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1+1' } }]);

    for (let i = 0; i < 20; i++) {
      wb.undo();
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(null);
      wb.redo();
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(2);
    }
  });

  it('100 formulas each depending on previous', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    for (let i = 1; i <= 100; i++) {
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: i, col: 0, formula: `=A${i}+1` } }]);
    }
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 100, col: 0 })).toBe(101);

    // Change root
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 0 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 100, col: 0 })).toBe(100);
  });

  it('deleteRows in batch with multiple rows', () => {
    const wb = createWorkbook();
    for (let i = 0; i < 10; i++) {
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: i, col: 0, value: i } }]);
    }
    // Delete rows 3-5 (3 rows)
    wb.apply([{ type: 'deleteRows', payload: { sheet: 0, index: 3, count: 3 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(6);

    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(3);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 5, col: 0 })).toBe(5);
  });

  it('pivot on one sheet, formula on another, independent', () => {
    const wb = createWorkbook({ modules: [PivotModule, FormulaModule] });
    wb.apply([{ type: 'createSheet', payload: { name: 'Formulas' } }]);
    wb.registerDataSource('d', [{ k: 'A', v: 10 }, { k: 'B', v: 20 }]);
    wb.apply([{ type: 'pivot.setConfig', payload: { sheet: 0, dataSourceId: 'd', rows: ['k'], columns: [], values: ['v'], valueAggregation: { v: 'SUM' }, showGrandTotal: false, showSubTotals: false } }]);

    wb.apply([{ type: 'setCellValue', payload: { sheet: 1, row: 0, col: 0, value: 5 } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 1, row: 0, col: 1, formula: '=A1*3' } }]);

    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(10);
    expect(wb.query.getCellDisplayValue({ sheet: 1, row: 0, col: 1 })).toBe(15);

    // Change formula dep — pivot unaffected
    wb.apply([{ type: 'setCellValue', payload: { sheet: 1, row: 0, col: 0, value: 10 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(10);
    expect(wb.query.getCellDisplayValue({ sheet: 1, row: 0, col: 1 })).toBe(30);
  });
});
