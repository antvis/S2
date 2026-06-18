import { describe, it, expect } from 'vitest';
import { createWorkbook, FormulaModule, FilterModule, SortModule } from '../src/index';

describe('formula undo/redo deep tests', () => {
  it('undo formula.setFormula restores previous plain value', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 42 } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 0, formula: '=1+2' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(3);

    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(42);
    const trace = wb.query.moduleQuery('formula.traceFormula', { sheet: 0, row: 0, col: 0 });
    expect(trace).toBe(null);
  });

  it('redo after undo restores formula', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*5' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(50);

    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(null);

    wb.redo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(50);
    const trace = wb.query.moduleQuery('formula.traceFormula', { sheet: 0, row: 0, col: 1 }) as any;
    expect(trace).not.toBe(null);
    expect(trace.formula).toBe('=A1*5');
  });

  it('multiple formulas: delete one, undo restores it, others unaffected', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 20 } },
    ]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 0, formula: '=A1+1' } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 1, formula: '=B1+1' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(11);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(21);

    // Delete formula at B2
    wb.apply([{ type: 'deleteCellValue', payload: { sheet: 0, row: 1, col: 1 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(null);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(11); // A2 unaffected

    // Undo — B2 formula should come back
    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(21);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(11);
  });

  it('overwrite formula with setValue, undo, then change dependency', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 5 } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*10' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(50);

    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 999 } }]);
    wb.undo(); // restore formula
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(50);

    // Change dependency — formula should update
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 7 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(70);
  });

  it('formula.clearFormula then undo restores formula', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 3 } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1+7' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(10);

    wb.apply([{ type: 'formula.clearFormula', payload: { sheet: 0, row: 0, col: 1 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(null);

    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(10);
    const trace = wb.query.moduleQuery('formula.traceFormula', { sheet: 0, row: 0, col: 1 }) as any;
    expect(trace.formula).toBe('=A1+7');
  });

  it('chain A→B→C: delete B formula, undo, C still updates via B', () => {
    const wb = createWorkbook({ modules: [FormulaModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 2 } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*3' } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 2, formula: '=B1+1' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(7); // 2*3+1

    // Overwrite B1
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 100 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(101); // 100+1

    // Undo — B1 formula restored
    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(6); // 2*3
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(7); // 6+1

    // Change A1 — whole chain updates
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(30); // 10*3
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(31); // 30+1
  });
});
