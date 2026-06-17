import { describe, it, expect } from 'vitest';
import { createWorkbook, AgentModule, FormulaModule, PivotModule, FilterModule, SortModule, EditModule, FreezeModule, ConditionalFormatModule } from '../src';

describe('Agent-driven integration scenarios', () => {
  function fullWorkbook() {
    return createWorkbook({
      modules: [PivotModule, FormulaModule, FilterModule, SortModule, EditModule, FreezeModule, ConditionalFormatModule, AgentModule],
    });
  }

  function seedData(wb: ReturnType<typeof createWorkbook>) {
    const headers = ['Name', 'Sales', 'Region', 'Profit'];
    const data = [
      ['Alice', 150, 'East', 120],
      ['Bob', 280, 'West', 210],
      ['Carol', 90, 'East', 65],
      ['Dave', 340, 'North', 310],
      ['Eve', 200, 'West', 180],
    ];
    for (let c = 0; c < headers.length; c++) {
      wb.agent!.callTool('setCellValue', { sheet: 0, row: 0, col: c, value: headers[c] });
    }
    for (let r = 0; r < data.length; r++) {
      for (let c = 0; c < data[r]!.length; c++) {
        wb.agent!.callTool('setCellValue', { sheet: 0, row: r + 1, col: c, value: data[r]![c] });
      }
    }
  }

  it('sort + filter combination: filter then sort', () => {
    const wb = fullWorkbook();
    seedData(wb);

    // Filter: only East region (col 2)
    wb.agent!.callTool('filter.set', { sheet: 0, col: 2, condition: { type: 'include', values: ['East'] } });

    // Sort by Sales desc (col 1)
    wb.agent!.callTool('sort.set', { sheet: 0, sortBy: [{ col: 1, order: 'desc' }] });

    const ctx = wb.agent!.getContext();
    expect(ctx.currentFilters.length).toBe(1);
    expect(ctx.sortState).not.toBeNull();

    // Alice (150) and Carol (90) are East. After desc sort: Alice first, Carol second.
    // Verify query still returns correct values for visible data
    const alice = wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 });
    const carol = wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 1 });
    expect(alice).toBe(150);
    expect(carol).toBe(90);
  });

  it('sort + filter + undo: state restored correctly', () => {
    const wb = fullWorkbook();
    seedData(wb);

    wb.agent!.callTool('sort.set', { sheet: 0, sortBy: [{ col: 1, order: 'asc' }] });
    wb.agent!.callTool('filter.set', { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 100 } });

    expect(wb.agent!.getContext().sortState).not.toBeNull();
    expect(wb.agent!.getContext().currentFilters.length).toBe(1);

    wb.undo(); // undo filter
    const ctx = wb.agent!.getContext();
    expect(ctx.currentFilters.length).toBe(0);
    expect(ctx.sortState).not.toBeNull(); // sort should still be active

    wb.undo(); // undo sort
    expect(wb.agent!.getContext().sortState).toBeNull();
  });

  it('formula + edit: editing a dependency recalculates', () => {
    const wb = fullWorkbook();
    wb.agent!.callTool('setCellValue', { sheet: 0, row: 0, col: 0, value: 10 });
    wb.agent!.callTool('setCellValue', { sheet: 0, row: 0, col: 1, value: 20 });
    wb.agent!.callTool('formula.setFormula', { sheet: 0, row: 0, col: 2, formula: '=A1+B1' });

    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(30);

    // Edit dependency via edit.commit
    wb.agent!.callTool('edit.commit', { sheet: 0, row: 0, col: 0, value: 50 });
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(70);
  });

  it('formula + sort: formula result follows cell', () => {
    const wb = fullWorkbook();
    wb.agent!.callTool('setCellValue', { sheet: 0, row: 1, col: 0, value: 100 });
    wb.agent!.callTool('setCellValue', { sheet: 0, row: 2, col: 0, value: 200 });
    wb.agent!.callTool('formula.setFormula', { sheet: 0, row: 3, col: 0, formula: '=SUM(A2:A3)' });

    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(300);

    // Sort col 0 desc - formula cell has value 300, should remain correct
    wb.agent!.callTool('sort.set', { sheet: 0, sortBy: [{ col: 0, order: 'desc' }] });
    // The formula at model row 3 should still compute correctly
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(300);
  });

  it('freeze + filter: frozen rows survive filter', () => {
    const wb = fullWorkbook();
    seedData(wb);

    // Freeze first 2 rows (header + first data row)
    wb.agent!.callTool('freeze.set', { sheet: 0, frozenRows: 2, frozenCols: 0 });

    // Apply filter
    wb.agent!.callTool('filter.set', { sheet: 0, col: 2, condition: { type: 'include', values: ['West'] } });

    // Freeze config should still be there
    const freezeConfig = wb.query.moduleQuery('freeze.getConfig', { sheet: 0 });
    expect(freezeConfig).toEqual({ frozenRows: 2, frozenCols: 0 });

    // Bob and Eve are West
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('Bob');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 5, col: 0 })).toBe('Eve');
  });

  it('conditional format + setCellValue: style updates when value changes', () => {
    const wb = fullWorkbook();
    wb.agent!.callTool('setCellValue', { sheet: 0, row: 0, col: 0, value: 50 });
    wb.agent!.callTool('conditionalFormat.addRule', {
      sheet: 0,
      range: { startRow: 0, endRow: 10, startCol: 0, endCol: 0 },
      rule: { type: 'greaterThan', value: 100 },
      style: { backgroundColor: '#ff0000' },
    });

    // Value 50 < 100, should not match
    const style1 = wb.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 0 });
    expect(style1).toBeNull();

    // Change to 200 > 100, should match
    wb.agent!.callTool('setCellValue', { sheet: 0, row: 0, col: 0, value: 200 });
    const style2 = wb.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 0 });
    expect(style2).toEqual({ backgroundColor: '#ff0000' });
  });

  it('pivot + drill + getContext', () => {
    const wb = fullWorkbook();
    const data = [
      { province: '浙江', city: '杭州', sales: 100 },
      { province: '浙江', city: '宁波', sales: 200 },
      { province: '江苏', city: '南京', sales: 150 },
    ];
    wb.registerDataSource('ds', data);
    wb.agent!.callTool('pivot.setConfig', {
      sheet: 0, dataSourceId: 'ds',
      rows: ['province', 'city'], columns: [], values: ['sales'],
      valueAggregation: { sales: 'SUM' },
    });

    const ctx1 = wb.agent!.getContext();
    expect(ctx1.pivotConfig).not.toBeNull();
    expect(ctx1.cellCount).toBeGreaterThan(0);

    // Drill into 浙江
    wb.agent!.callTool('pivot.drill', { sheet: 0, dimension: 'province', value: '浙江' });
    const ctx2 = wb.agent!.getContext();
    expect(ctx2.pivotConfig).not.toBeNull();

    // After drill, should see 杭州 and 宁波 data
    const csv = wb.exportCSV();
    expect(csv).toContain('100');
    expect(csv).toContain('200');
    // 南京 should be filtered out
    expect(csv).not.toContain('150');
  });

  it('bulk operations via callTool: insert rows then delete', () => {
    const wb = fullWorkbook();
    seedData(wb);

    const ctx1 = wb.agent!.getContext();
    const originalRows = ctx1.sheets[0]!.rowCount;

    wb.agent!.callTool('insertRows', { sheet: 0, index: 2, count: 3 });
    const ctx2 = wb.agent!.getContext();
    expect(ctx2.sheets[0]!.rowCount).toBe(originalRows + 3);

    wb.agent!.callTool('deleteRows', { sheet: 0, index: 2, count: 3 });
    const ctx3 = wb.agent!.getContext();
    expect(ctx3.sheets[0]!.rowCount).toBe(originalRows);
  });

  it('audit log captures full workflow', () => {
    const wb = fullWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'human' } }]);
    wb.agent!.callTool('setCellValue', { sheet: 0, row: 1, col: 0, value: 'agent' });
    wb.agent!.callTool('setCellValue', { sheet: 0, row: 2, col: 0, value: 'agent2' });

    const log = wb.agent!.getAuditLog();
    expect(log.length).toBe(3);
    expect(log[0]!.source).toBe('unknown'); // human apply without source
    expect(log[1]!.source).toBe('agent');
    expect(log[2]!.source).toBe('agent');
  });

  it('getMCPTools includes module operations with schema', () => {
    const wb = fullWorkbook();
    const tools = wb.agent!.getMCPTools();
    const names = tools.map(t => t.name);

    // Core operations
    expect(names).toContain('setCellValue');
    expect(names).toContain('deleteCellValue');
    expect(names).toContain('insertRows');
    expect(names).toContain('mergeCells');

    // Module operations
    expect(names).toContain('sort.set');
    expect(names).toContain('filter.set');
    expect(names).toContain('pivot.setConfig');
    expect(names).toContain('formula.setFormula');
    expect(names).toContain('conditionalFormat.addRule');
    expect(names).toContain('freeze.set');

    // Internal ops (no schema) should NOT appear
    expect(names).not.toContain('restoreCell');
    expect(names).not.toContain('showRows');
    expect(names).not.toContain('setSelection');
  });

  it('full end-to-end: data import → analyze → formula → export', () => {
    const wb = fullWorkbook();

    // 1. Import data
    wb.importCSV('Name,Sales,Region\nAlice,150,East\nBob,280,West\nCarol,90,East\nDave,340,North');

    // 2. Agent analyzes context
    const ctx = wb.agent!.getContext();
    expect(ctx.cellCount).toBeGreaterThan(0);
    expect(ctx.schema).toHaveProperty('Sales');

    // 3. Agent adds formula
    wb.agent!.callTool('formula.setFormula', { sheet: 0, row: 5, col: 1, formula: '=SUM(B2:B5)' });
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 5, col: 1 })).toBe(860);

    // 4. Agent traces formula
    const trace = wb.agent!.traceFormula({ sheet: 0, row: 5, col: 1 });
    expect(trace!.formula).toBe('=SUM(B2:B5)');
    expect(trace!.result).toBe(860);
    expect(trace!.dependencies.length).toBe(4);

    // 5. Agent exports
    const csv = wb.exportCSV();
    expect(csv).toContain('860');
    expect(csv).toContain('Alice');
  });
});
