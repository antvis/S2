import { describe, it, expect } from 'vitest';
import { createWorkbook, FormulaModule, FilterModule, SortModule, FreezeModule, ConditionalFormatModule } from '../src/index';

describe('MCP-discovered bug regressions', () => {
  describe('deleteSheet undo restores to original position', () => {
    it('undo deleteSheet should restore sheet at original index', () => {
      const wb = createWorkbook();
      wb.apply([{ type: 'createSheet', payload: { name: 'A' } }]);
      wb.apply([{ type: 'createSheet', payload: { name: 'B' } }]);
      // sheets: [Sheet1, A, B]
      expect(wb.toJSON().sheets.map((s: any) => s.name)).toEqual(['Sheet1', 'A', 'B']);

      wb.apply([{ type: 'deleteSheet', payload: { sheet: 1 } }]);
      // sheets: [Sheet1, B]
      expect(wb.toJSON().sheets.map((s: any) => s.name)).toEqual(['Sheet1', 'B']);

      wb.undo();
      // sheets should be [Sheet1, A, B] — not [Sheet1, B, A]
      expect(wb.toJSON().sheets.map((s: any) => s.name)).toEqual(['Sheet1', 'A', 'B']);
    });

    it('undo deleteSheet preserves sheet data', () => {
      const wb = createWorkbook();
      wb.apply([{ type: 'createSheet', payload: { name: 'Data' } }]);
      wb.apply([{ type: 'setCellValue', payload: { sheet: 1, row: 0, col: 0, value: 'keep' } }]);
      wb.apply([{ type: 'deleteSheet', payload: { sheet: 1 } }]);
      wb.undo();
      expect(wb.query.getCellDisplayValue({ sheet: 1, row: 0, col: 0 })).toBe('keep');
    });
  });

  describe('operations on non-existent sheet do not pollute undo stack', () => {
    it('setCellValue on non-existent sheet returns empty inverse', () => {
      const wb = createWorkbook();
      wb.apply([{ type: 'setCellValue', payload: { sheet: 99, row: 0, col: 0, value: 'ghost' } }]);
      // should not be undoable (empty inverse)
      expect(wb.canUndo()).toBe(false);
    });

    it('deleteCellValue on non-existent sheet returns empty inverse', () => {
      const wb = createWorkbook();
      wb.apply([{ type: 'deleteCellValue', payload: { sheet: 99, row: 0, col: 0 } }]);
      expect(wb.canUndo()).toBe(false);
    });
  });

  describe('row/column operations trigger formula recalculation', () => {
    it('deleteRows triggers formula recalc', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
        { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 20 } },
      ]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1+A2' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(30);

      // Delete row 1 (value 20). A2 becomes empty. Formula should recalc to 10+0=10.
      wb.apply([{ type: 'deleteRows', payload: { sheet: 0, index: 1, count: 1 } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(10);
    });

    it('insertRows triggers formula recalc', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 5 } },
        { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 15 } },
      ]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 2, col: 0, formula: '=A1+A2' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(20);

      wb.apply([{ type: 'insertRows', payload: { sheet: 0, index: 1, count: 1 } }]);
      // After inserting a row, formula at row 3 now. Should recalculate.
      const result = wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 });
      expect(typeof result).toBe('number');
    });
  });

  describe('formula getValue treats non-numeric cells as 0', () => {
    it('SUM with mixed string and number cells', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
        { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'hello' } },
        { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 20 } },
      ]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 3, col: 0, formula: '=SUM(A1:A3)' } }]);
      // "hello" should be treated as 0, so SUM = 10 + 0 + 20 = 30
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(30);
    });

    it('AVG with empty cells', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
        // row 1 is empty
        { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 20 } },
      ]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 3, col: 0, formula: '=AVG(A1:A3)' } }]);
      // AVG(10, 0, 20) = 10
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(10);
    });

    it('arithmetic with string cell returns 0 not NaN', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'text' } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 0, formula: '=A1*2' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(0);
    });
  });

  describe('formula chain recalculation', () => {
    it('A→B→C chain updates correctly', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*2' } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 2, formula: '=B1+5' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(25);

      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 50 } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(100);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(105);
    });
  });

  describe('deleteCellValue clears formula', () => {
    it('delete cell with formula removes it from recalc', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*3' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(30);

      wb.apply([{ type: 'deleteCellValue', payload: { sheet: 0, row: 0, col: 1 } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(null);

      // Changing A1 should not resurrect the deleted formula
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 99 } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(null);
    });
  });

  describe('restoreCell re-registers formula in FormulaModule state', () => {
    it('undo setCellValue that overwrote a formula restores the formula', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*3' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(30);

      // Overwrite formula cell with plain value
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 999 } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(999);
      expect(wb.query.moduleQuery('formula.traceFormula', { sheet: 0, row: 0, col: 1 })).toBe(null);

      // Undo — formula should be fully restored including in FormulaModule state
      wb.undo();
      const rawCell = wb.query.getCellRawValue({ sheet: 0, row: 0, col: 1 });
      expect(rawCell?.formula).toBe('=A1*3');
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(30);
      const trace = wb.query.moduleQuery('formula.traceFormula', { sheet: 0, row: 0, col: 1 }) as any;
      expect(trace).not.toBe(null);
      expect(trace.formula).toBe('=A1*3');

      // Changing dependency should still update the restored formula
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 20 } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(60);
    });
  });
});
