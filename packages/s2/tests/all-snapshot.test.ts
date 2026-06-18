import { describe, it, expect } from 'vitest';
import { createWorkbook, FormulaModule, FilterModule, SortModule, FreezeModule, ConditionalFormatModule, PivotModule } from '../src/index';

describe('all module snapshot round-trips', () => {
  it('freeze config survives snapshot', () => {
    const wb1 = createWorkbook({ modules: [FreezeModule] });
    wb1.apply([{ type: 'freeze.set', payload: { sheet: 0, frozenRows: 3, frozenCols: 2 } }]);
    const cfg1 = wb1.query.moduleQuery('freeze.getConfig', { sheet: 0 }) as any;
    expect(cfg1.frozenRows).toBe(3);

    const wb2 = createWorkbook({ modules: [FreezeModule], snapshot: wb1.toJSON() });
    const cfg2 = wb2.query.moduleQuery('freeze.getConfig', { sheet: 0 }) as any;
    expect(cfg2).not.toBe(null);
    expect(cfg2.frozenRows).toBe(3);
    expect(cfg2.frozenCols).toBe(2);
  });

  it('conditional format rules survive snapshot', () => {
    const wb1 = createWorkbook({ modules: [ConditionalFormatModule] });
    wb1.apply([{
      type: 'conditionalFormat.addRule',
      payload: { sheet: 0, range: { startRow: 0, endRow: 5, startCol: 0, endCol: 0 }, rule: { type: 'greaterThan', value: 10 }, style: { bold: true } },
    }]);
    const rules1 = wb1.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as any[];
    expect(rules1.length).toBe(1);

    const wb2 = createWorkbook({ modules: [ConditionalFormatModule], snapshot: wb1.toJSON() });
    const rules2 = wb2.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as any[];
    expect(rules2.length).toBe(1);
    expect(rules2[0].rule.type).toBe('greaterThan');
  });

  it('formula + sort + filter all survive snapshot together', () => {
    const wb1 = createWorkbook({ modules: [FormulaModule, SortModule, FilterModule] });
    wb1.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 20 } },
    ]);
    wb1.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 2, col: 0, formula: '=SUM(A1:A2)' } }]);
    wb1.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'desc' }] } }]);
    wb1.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 5 } } }]);

    const json = wb1.toJSON();
    const wb2 = createWorkbook({ modules: [FormulaModule, SortModule, FilterModule], snapshot: json });

    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(30);
    const sort = wb2.query.moduleQuery('sort.getState', { sheet: 0 }) as any;
    expect(sort.sortBy[0].order).toBe('desc');
    const filters = wb2.query.moduleQuery('filter.getRules', { sheet: 0 }) as any[];
    expect(filters.length).toBe(1);

    // Formula still responds to changes
    wb2.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } }]);
    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(120);
  });
});
