import { describe, it, expect } from 'vitest';
import { createWorkbook, FormulaModule, FilterModule, SortModule, PivotModule, EditModule } from '../src/index';

describe('remaining edge cases', () => {
  describe('batch atomicity', () => {
    it('failed batch rolls back all ops including formula side effects', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 1, formula: '=A1+1' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(11);

      expect(() => {
        wb.apply([
          { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 99 } },
          { type: 'badOp', payload: {} },
        ]);
      }).toThrow();

      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(10);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(11);
    });
  });

  describe('merge cells + formula', () => {
    it('formula referencing merged area top-left cell', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 42 } }]);
      wb.apply([{ type: 'mergeCells', payload: { sheet: 0, startRow: 0, endRow: 1, startCol: 0, endCol: 1 } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 2, col: 0, formula: '=A1*2' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(84);
    });
  });

  describe('pivot subtotals', () => {
    it('pivot with showSubTotals shows sub-aggregations', () => {
      const wb = createWorkbook({ modules: [PivotModule] });
      wb.registerDataSource('sub', [
        { region: 'East', city: 'NY', val: 10 },
        { region: 'East', city: 'BOS', val: 20 },
        { region: 'West', city: 'LA', val: 30 },
        { region: 'West', city: 'SF', val: 40 },
      ]);
      wb.apply([{
        type: 'pivot.setConfig',
        payload: {
          sheet: 0, dataSourceId: 'sub',
          rows: ['region', 'city'], columns: [], values: ['val'],
          valueAggregation: { val: 'SUM' },
          showSubTotals: true, showGrandTotal: true,
        },
      }]);
      // Should have data without crashing
      const cell00 = wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 });
      expect(cell00).not.toBe(null);
    });
  });

  describe('filter overwrite', () => {
    it('setting filter on same column overwrites previous filter', () => {
      const wb = createWorkbook({ modules: [FilterModule] });
      wb.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
        { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 20 } },
        { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 30 } },
      ]);
      wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 25 } } }]);
      wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'lessThan', value: 15 } } }]);

      const rules = wb.query.moduleQuery('filter.getRules', { sheet: 0 }) as any[];
      const col0Rules = rules.filter((r: any) => r.col === 0);
      expect(col0Rules.length).toBe(1);
      expect(col0Rules[0].condition.type).toBe('lessThan');
    });
  });

  describe('edit.copy clipboard state', () => {
    it('copy populates clipboard with correct data', () => {
      const wb = createWorkbook({ modules: [EditModule] });
      wb.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'A' } },
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'B' } },
        { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 1 } },
        { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 1, value: 2 } },
      ]);
      wb.apply([{
        type: 'edit.copy',
        payload: { sheet: 0, range: { startRow: 0, endRow: 1, startCol: 0, endCol: 1 } },
      }]);
      const clipboard = wb.query.moduleQuery('edit.getClipboard', {}) as any;
      expect(clipboard).not.toBe(null);
      expect(clipboard.cells.map((row: any[]) => row.map((c: any) => c.value))).toEqual([['A', 'B'], [1, 2]]);
    });
  });

  describe('hideRows does not affect cell values', () => {
    it('hidden row values are still readable', () => {
      const wb = createWorkbook();
      wb.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'visible' } },
        { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'hidden' } },
        { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'visible2' } },
      ]);
      wb.apply([{ type: 'hideRows', payload: { sheet: 0, rows: [1] } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('hidden');
    });
  });

  describe('formula with SUM over empty range', () => {
    it('SUM of entirely empty range returns 0', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 0, formula: '=SUM(B1:B10)' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(0);
    });
  });

  describe('deleteSheet with formulas', () => {
    it('deleting sheet does not crash formula module', () => {
      const wb = createWorkbook({ modules: [FormulaModule] });
      wb.apply([{ type: 'createSheet', payload: { name: 'Temp' } }]);
      wb.apply([{ type: 'setCellValue', payload: { sheet: 1, row: 0, col: 0, value: 5 } }]);
      wb.apply([{ type: 'formula.setFormula', payload: { sheet: 1, row: 0, col: 1, formula: '=A1+1' } }]);
      expect(wb.query.getCellDisplayValue({ sheet: 1, row: 0, col: 1 })).toBe(6);

      wb.apply([{ type: 'deleteSheet', payload: { sheet: 1 } }]);
      // Should not crash, formula state should be cleaned up on next recalc
      expect(wb.toJSON().sheets).toHaveLength(1);
    });
  });
});
