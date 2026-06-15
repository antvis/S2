import { describe, it, expect } from 'vitest';
import { createWorkbook, FormulaModule } from '../src/index';

function createFormulaWorkbook() {
  return createWorkbook({ modules: [FormulaModule] });
}

describe('FormulaModule', () => {
  it('should compute simple cell reference =B1', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 42 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 2, formula: '=B1' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(42);
  });

  it('should compute arithmetic =B1*1.1', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 100 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 1, formula: '=B1*1.1' } },
    ]);
    const result = workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 }) as number;
    expect(Math.abs(result - 110)).toBeLessThan(0.001);
  });

  it('should compute =A1+B1', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 20 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 2, formula: '=A1+B1' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(30);
  });

  it('should compute =A1-B1', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 50 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 20 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 2, formula: '=A1-B1' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(30);
  });

  it('should respect operator precedence =A1+B1*2', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 5 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 2, formula: '=A1+B1*2' } },
    ]);
    // 10 + 5*2 = 20, not (10+5)*2=30
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(20);
  });

  it('should compute SUM(A1:A5)', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 20 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 30 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 40 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 4, col: 0, value: 50 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 5, col: 0, formula: '=SUM(A1:A5)' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 5, col: 0 })).toBe(150);
  });

  it('should compute AVG(A1:A4)', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 20 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 30 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 40 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 4, col: 0, formula: '=AVG(A1:A4)' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 4, col: 0 })).toBe(25);
  });

  it('should compute MIN and MAX', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 5 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 99 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 3 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 3, col: 0, formula: '=MIN(A1:A3)' } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 4, col: 0, formula: '=MAX(A1:A3)' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(3);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 4, col: 0 })).toBe(99);
  });

  it('should compute COUNT', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 2 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 3 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 3, col: 0, formula: '=COUNT(A1:A3)' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(3);
  });

  it('should auto-recalculate when dependency changes', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 20 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 2, col: 0, formula: '=SUM(A1:A2)' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(30);

    // Change A1
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(120);
  });

  it('should support chained formulas (A3=SUM(A1:A2), A4=A3*2)', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 5 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 10 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 2, col: 0, formula: '=SUM(A1:A2)' } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 3, col: 0, formula: '=A3*2' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(15);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(30);

    // Change A1 → cascading recalc
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 20 } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(30);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(60);
  });

  it('should undo formula', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
    ]);
    workbook.apply([
      { type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 0, formula: '=A1*2' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(20);

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(null);
  });

  it('should reject formula operations when module not registered', () => {
    const workbook = createWorkbook();
    expect(() => {
      workbook.apply([
        { type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 0, formula: '=1+1' } },
      ]);
    }).toThrow('Unknown operation');
  });

  it('should clear formula when setCellValue overwrites a formula cell', () => {
    const workbook = createFormulaWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 0, formula: '=A1*2' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(20);

    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 99 } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(99);

    const formula = workbook.query.moduleQuery('formula.getFormula', { sheet: 0, row: 1, col: 0 });
    expect(formula).toBeNull();

    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 50 } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(99);
  });
});
