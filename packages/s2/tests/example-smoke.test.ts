import { describe, it, expect } from 'vitest';
import { createWorkbook } from '../src/workbook';
import { EditModule } from '../src/modules/edit';
import { FormulaModule } from '../src/modules/formula';
import { SortModule } from '../src/modules/sort';
import { FilterModule } from '../src/modules/filter';
import { FreezeModule } from '../src/modules/freeze';
import { ConditionalFormatModule } from '../src/modules/conditional-format';
import { FormatModule } from '../src/modules/format';

describe('example smoke tests', () => {
  it('spreadsheet - plain data', () => {
    const wb = createWorkbook();
    const ops: any[] = [];
    for (let r = 0; r < 10; r++)
      for (let c = 0; c < 5; c++)
        ops.push({ type: 'setCellValue', payload: { sheet: 0, row: r, col: c, value: `R${r}C${c}` } });
    wb.apply(ops);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('R0C0');
  });

  it('formula', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 200 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 2, col: 0, formula: '=SUM(A1:A2)' } },
    ]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(300);
  });

  it('sort', () => {
    const wb = createWorkbook({ modules: [SortModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 3 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 1 } },
      { type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } },
    ]);
    // just verify no crash
    expect(true).toBe(true);
  });

  it('filter', () => {
    const wb = createWorkbook({ modules: [FilterModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 20 } },
      { type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 15 } } },
    ]);
    expect(true).toBe(true);
  });

  it('conditional format', () => {
    const wb = createWorkbook({ modules: [ConditionalFormatModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } },
      { type: 'conditionalFormat.addRule', payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 10, startCol: 0, endCol: 0 },
        rule: { type: 'greaterThan', value: 50 },
        style: { backgroundColor: '#ff0000' },
      }},
    ]);
    expect(true).toBe(true);
  });

  it('format', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1234.5 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: new Date(2023, 0, 15), autoFormat: true } },
      { type: 'format.setPreset', payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 }, preset: { kind: 'number', decimal: 2, group: true } } },
    ]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('1,234.50');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('2023-01-15');
  });
});
