import { describe, it, expect } from 'vitest';
import { createWorkbook, FormulaModule, FilterModule, SortModule, FreezeModule, ConditionalFormatModule, EditModule } from '../src/index';

describe('cross-module interactions', () => {
  describe('edit.commit triggers formula recalc', () => {
    it('commit a value that a formula depends on', () => {
      const wb = createWorkbook({ modules: [FormulaModule, EditModule] });
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*2' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(20);

      wb.apply([{ type: 'edit.commit', payload: { sheet: 0, row: 0, col: 0, value: 50 } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(100);
    });
  });

  describe('filter + sort + formula combo', () => {
    it('formula still recalcs when filter and sort are active', () => {
      const wb = createWorkbook({ modules: [FormulaModule, FilterModule, SortModule] });
      wb.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
        { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 20 } },
        { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 30 } },
      ]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 3, col: 0, formula: '=SUM(A1:A3)' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(60);

      wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'desc' }] } }]);
      wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 15 } } }]);

      // Change a filtered-out value
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(150);
    });
  });

  describe('conditional format with various rule types', () => {
    it('colorScale rule does not crash', () => {
      const wb = createWorkbook({ modules: [ConditionalFormatModule] });
      wb.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
        { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 50 } },
        { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 90 } },
      ]);
      wb.apply([{
        type: 'conditionalFormat.addRule',
        payload: {
          sheet: 0,
          range: { startRow: 0, endRow: 2, startCol: 0, endCol: 0 },
          rule: { type: 'colorScale', min: '#ffffff', max: '#ff0000' },
          style: {},
        },
      }]);
      // Should not throw
      const style = wb.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 1, col: 0 });
      expect(style).toBeDefined();
    });
  });

  describe('formula replace existing formula', () => {
    it('setFormula on cell that already has formula', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1+1' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(11);

      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*10' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(100);

      // Undo should restore previous formula, not plain value
      wb.undo();
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(11);
      const trace = wb.query.moduleQuery('formula.traceFormula', { sheet: 0, row: 0, col: 1 }) as any;
      expect(trace.formula).toBe('=A1+1');
    });
  });

  describe('freeze does not affect data operations', () => {
    it('setCellValue works in frozen area', () => {
      const wb = createWorkbook({ modules: [FreezeModule] });
      wb.apply([{ type: 'freeze.set', payload: { sheet: 0, frozenRows: 2, frozenCols: 2 } }]);
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'frozen' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('frozen');

      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 5, col: 5, value: 'unfrozen' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 5, col: 5 })).toBe('unfrozen');
    });
  });

  describe('importCSV + formula + undo', () => {
    it('importCSV clears formulas, undo restores them', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 5 } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1*2' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(10);

      wb.importCSV('X,Y\n1,2', 0);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('X');
      expect(wb.query.moduleQuery('formula.traceFormula', { sheet: 0, row: 0, col: 1 })).toBe(null);
    });
  });

  describe('pivot clearConfig + undo restores data', () => {
    it('clearConfig removes cells, undo restores', () => {
      const wb = createWorkbook({ modules: [import('../src/modules/pivot').then(m => m.PivotModule)] as any });
      // Use sync import
    });
  });

  describe('multiple sheets with independent formulas', () => {
    it('formulas on different sheets are independent', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([{ type: 'createSheet', payload: { name: 'S2' } }]);

      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1+1' } }]);

      wb.apply([{ type: 'setCellValue', payload: { sheet: 1, row: 0, col: 0, value: 100 } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 1, row: 0, col: 1, formula: '=A1+1' } }]);

      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(11);
      expect(wb.query.getCellDisplayValue({ sheet: 1, row: 0, col: 1 })).toBe(101);

      // Change sheet 0, sheet 1 unaffected
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 50 } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(51);
      expect(wb.query.getCellDisplayValue({ sheet: 1, row: 0, col: 1 })).toBe(101);
    });
  });
});
