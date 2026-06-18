import { describe, it, expect } from 'vitest';
import { createWorkbook, allModules, FormulaModule, PivotModule, SortModule, FilterModule, FreezeModule, EditModule, ConditionalFormatModule } from '../src/index';

describe('last corners', () => {
  it('undo past importCSV restores previous data', () => {
    const wb = createWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'original' } }]);
    wb.importCSV('A,B\n1,2', 0);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('A');

    // importCSV generates a batch of ops — undo should restore
    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('original');
  });

  it('conditional format on empty cells does not crash', () => {
    const wb = createWorkbook({ modules: [ConditionalFormatModule] });
    wb.apply([{
      type: 'conditionalFormat.addRule',
      payload: { sheet: 0, range: { startRow: 0, endRow: 10, startCol: 0, endCol: 5 }, rule: { type: 'greaterThan', value: 0 }, style: { bold: true } },
    }]);
    const style = wb.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 0 });
    expect(style).toBe(null); // empty cell doesn't match greaterThan 0
  });

  it('multiple sheets each with own freeze config', () => {
    const wb = createWorkbook({ modules: [FreezeModule] });
    wb.apply([{ type: 'createSheet', payload: { name: 'S2' } }]);
    wb.apply([{ type: 'freeze.set', payload: { sheet: 0, frozenRows: 1, frozenCols: 0 } }]);
    wb.apply([{ type: 'freeze.set', payload: { sheet: 1, frozenRows: 0, frozenCols: 2 } }]);

    const c0 = wb.query.moduleQuery('freeze.getConfig', { sheet: 0 }) as any;
    const c1 = wb.query.moduleQuery('freeze.getConfig', { sheet: 1 }) as any;
    expect(c0.frozenRows).toBe(1);
    expect(c0.frozenCols).toBe(0);
    expect(c1.frozenRows).toBe(0);
    expect(c1.frozenCols).toBe(2);
  });

  it('formula SUM across 0 and negative values', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: -10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 0 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 5 } },
    ]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 3, col: 0, formula: '=SUM(A1:A3)' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(-5);
  });

  it('allModules workbook can do everything', () => {
    const wb = createWorkbook({ modules: allModules });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 42 } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*2' } }]);
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } }]);
    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 0 } } }]);
    wb.apply([{ type: 'freeze.set', payload: { sheet: 0, frozenRows: 1, frozenCols: 1 } }]);
    wb.apply([{ type: 'conditionalFormat.addRule', payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 }, rule: { type: 'greaterThan', value: 0 }, style: { bold: true } } }]);

    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(42);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(84);

    // Undo everything
    for (let i = 0; i < 6; i++) wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(null);
  });
});
