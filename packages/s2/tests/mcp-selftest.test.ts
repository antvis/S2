import { describe, it, expect } from 'vitest';
import { createWorkbook, AgentModule, FormulaModule, PivotModule, FilterModule, SortModule, EditModule, FreezeModule, ConditionalFormatModule } from '../src';

function fullWorkbook() {
  return createWorkbook({
    modules: [PivotModule, FormulaModule, FilterModule, SortModule, EditModule, FreezeModule, ConditionalFormatModule, AgentModule],
  });
}

describe('MCP self-test: combination scenarios', () => {

  it('importCSV clears old data including formulas', () => {
    const wb = fullWorkbook();
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Old' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 20 } },
    ]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 3, col: 0, formula: '=SUM(A2:A3)' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(30);

    wb.importCSV('X,Y\n1,2');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('X');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBeNull();
    expect(wb.agent!.traceFormula({ sheet: 0, row: 3, col: 0 })).toBeNull();
    expect(wb.agent!.getContext().formulaCount).toBe(0);
  });

  it('deleteCellValue clears formula', () => {
    const wb = fullWorkbook();
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 0, formula: '=A1*2' } },
    ]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(20);
    expect(wb.agent!.traceFormula({ sheet: 0, row: 1, col: 0 })).not.toBeNull();

    wb.apply([{ type: 'deleteCellValue', payload: { sheet: 0, row: 1, col: 0 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBeNull();
    expect(wb.agent!.traceFormula({ sheet: 0, row: 1, col: 0 })).toBeNull();
  });

  it('formula chain: A→B→C, modify A propagates to C', () => {
    const wb = fullWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 0, formula: '=A1*2' } }]);
    wb.apply([{ type: 'formula.setFormula', payload: { sheet: 0, row: 2, col: 0, formula: '=A2+5' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(25);

    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 50 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(100);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(105);
  });

  it('sort + filter + conditional format combined', () => {
    const wb = fullWorkbook();
    wb.importCSV('Name,Score\nAlice,95\nBob,60\nCarol,85\nDave,45\nEve,75');

    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 1, order: 'desc' }] } }]);
    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 50 } } }]);
    wb.apply([{ type: 'conditionalFormat.addRule', payload: {
      sheet: 0,
      range: { startRow: 1, endRow: 5, startCol: 1, endCol: 1 },
      rule: { type: 'greaterThan', value: 80 },
      style: { backgroundColor: '#ff0000' },
    } }]);

    const ctx = wb.agent!.getContext();
    expect(ctx.sortState).not.toBeNull();
    expect(ctx.currentFilters.length).toBe(1);

    // Alice (95) and Carol (85) should match conditional format
    const aliceStyle = wb.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 1, col: 1 });
    expect(aliceStyle).toEqual({ backgroundColor: '#ff0000' });
    const bobStyle = wb.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 2, col: 1 });
    expect(bobStyle).toBeNull(); // Bob 60, not > 80
  });

  it('undo chain: sort → filter → undo filter → undo sort', () => {
    const wb = fullWorkbook();
    wb.importCSV('A\n3\n1\n2');
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } }]);
    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 1 } } }]);

    expect(wb.agent!.getContext().currentFilters.length).toBe(1);
    expect(wb.agent!.getContext().sortState).not.toBeNull();

    wb.undo(); // undo filter
    expect(wb.agent!.getContext().currentFilters.length).toBe(0);
    expect(wb.agent!.getContext().sortState).not.toBeNull();

    wb.undo(); // undo sort
    expect(wb.agent!.getContext().sortState).toBeNull();
  });

  it('pivot + drill + undo restores full pivot', () => {
    const wb = fullWorkbook();
    const data = [
      { region: 'East', city: 'SH', sales: 100 },
      { region: 'East', city: 'BJ', sales: 200 },
      { region: 'West', city: 'CD', sales: 150 },
    ];
    wb.registerDataSource('ds', data);
    wb.agent!.callTool('pivot.setConfig', {
      sheet: 0, dataSourceId: 'ds',
      rows: ['region', 'city'], columns: [], values: ['sales'],
      valueAggregation: { sales: 'SUM' },
    });

    const csv1 = wb.exportCSV();
    expect(csv1).toContain('100');
    expect(csv1).toContain('150');

    wb.agent!.callTool('pivot.drill', { sheet: 0, dimension: 'region', value: 'East' });
    const csv2 = wb.exportCSV();
    expect(csv2).toContain('100');
    expect(csv2).toContain('200');
    expect(csv2).not.toContain('150');

    wb.undo(); // undo drill
    const csv3 = wb.exportCSV();
    expect(csv3).toContain('150'); // West data restored
  });

  it('freeze + sort + filter: freeze survives sort/filter changes', () => {
    const wb = fullWorkbook();
    wb.importCSV('H\n1\n2\n3');
    wb.apply([{ type: 'freeze.set', payload: { sheet: 0, frozenRows: 1, frozenCols: 0 } }]);
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'desc' }] } }]);
    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 1 } } }]);

    const freeze = wb.query.moduleQuery('freeze.getConfig', { sheet: 0 });
    expect(freeze).toEqual({ frozenRows: 1, frozenCols: 0 });

    wb.undo(); wb.undo(); wb.undo(); // undo all
    expect(wb.query.moduleQuery('freeze.getConfig', { sheet: 0 })).toBeNull();
  });

  it('multi-sheet: operations on different sheets are independent', () => {
    const wb = fullWorkbook();
    wb.importCSV('A\n1\n2');
    wb.apply([{ type: 'createSheet', payload: { name: 'Sheet2' } }]);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 1, row: 0, col: 0, value: 'B' } }]);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 1, row: 1, col: 0, value: 99 } }]);

    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('A');
    expect(wb.query.getCellDisplayValue({ sheet: 1, row: 0, col: 0 })).toBe('B');
    expect(wb.exportCSV(0)).toContain('A');
    expect(wb.exportCSV(1)).toContain('99');
  });

  it('style + conditional format: explicit style takes priority visually', () => {
    const wb = fullWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 200 } }]);
    wb.apply([{ type: 'conditionalFormat.addRule', payload: {
      sheet: 0,
      range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 },
      rule: { type: 'greaterThan', value: 100 },
      style: { backgroundColor: '#ff0000' },
    } }]);
    wb.apply([{ type: 'setCellStyle', payload: { sheet: 0, row: 0, col: 0, style: { bold: true } } }]);

    const cfStyle = wb.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 0 });
    expect(cfStyle).toEqual({ backgroundColor: '#ff0000' });

    const cellRaw = wb.query.getCellRawValue({ sheet: 0, row: 0, col: 0 });
    expect(cellRaw?.style?.bold).toBe(true);
  });

  it('audit log tracks source correctly across operations', () => {
    const wb = fullWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'human' } }]);
    wb.agent!.callTool('setCellValue', { sheet: 0, row: 1, col: 0, value: 'agent' });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'human2' } }]);

    const log = wb.agent!.getAuditLog();
    expect(log[0]!.source).toBe('unknown');
    expect(log[1]!.source).toBe('agent');
    expect(log[2]!.source).toBe('unknown');
  });

  it('edge: undo past the beginning does nothing', () => {
    const wb = fullWorkbook();
    expect(wb.undo()).toBe(false);
    expect(wb.undo()).toBe(false);
    expect(wb.redo()).toBe(false);
  });

  it('edge: redo after new operation clears redo stack', () => {
    const wb = fullWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 2 } }]);
    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(1);
    expect(wb.canRedo()).toBe(true);

    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 3 } }]);
    expect(wb.canRedo()).toBe(false);
  });

  it('getMCPTools excludes internal operations', () => {
    const wb = fullWorkbook();
    const tools = wb.agent!.getMCPTools();
    const names = tools.map(t => t.name);
    expect(names).toContain('setCellValue');
    expect(names).toContain('sort.set');
    expect(names).not.toContain('restoreCell');
    expect(names).not.toContain('showRows');
    expect(names).not.toContain('setSelection');
    expect(names).not.toContain('filter.restore');
  });
});
