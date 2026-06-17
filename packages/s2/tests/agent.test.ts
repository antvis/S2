import { describe, it, expect } from 'vitest';
import { createWorkbook, AgentModule, FormulaModule, PivotModule, FilterModule, SortModule, EditModule } from '../src';

describe('AgentModule', () => {
  it('workbook.agent is undefined without AgentModule', () => {
    const wb = createWorkbook();
    expect(wb.agent).toBeUndefined();
  });

  it('workbook.agent is defined with AgentModule', () => {
    const wb = createWorkbook({ modules: [AgentModule] });
    expect(wb.agent).toBeDefined();
  });

  it('getContext returns basic info', () => {
    const wb = createWorkbook({ modules: [AgentModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Name' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'Age' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'Alice' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 1, value: 30 } },
    ]);
    const ctx = wb.agent!.getContext();
    expect(ctx.sheets).toHaveLength(1);
    expect(ctx.cellCount).toBe(4);
    expect(ctx.schema).toEqual({ Name: 'string', Age: 'number' });
  });

  it('getContext reflects pivot config', () => {
    const wb = createWorkbook({ modules: [PivotModule, AgentModule] });
    wb.registerDataSource('ds', [{ region: 'East', sales: 100 }]);
    wb.apply([{ type: 'pivot.setConfig', payload: { sheet: 0, dataSourceId: 'ds', rows: ['region'], columns: [], values: ['sales'], valueAggregation: { sales: 'SUM' } } }]);
    const ctx = wb.agent!.getContext();
    expect(ctx.pivotConfig).not.toBeNull();
  });

  it('getContext reflects filter and sort state', () => {
    const wb = createWorkbook({ modules: [FilterModule, SortModule, AgentModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'X' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 10 } },
    ]);
    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 5 } } }]);
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'desc' }] } }]);
    const ctx = wb.agent!.getContext();
    expect(ctx.currentFilters.length).toBeGreaterThan(0);
    expect(ctx.sortState).not.toBeNull();
  });

  it('getMCPTools returns tools with inputSchema', () => {
    const wb = createWorkbook({ modules: [AgentModule] });
    const tools = wb.agent!.getMCPTools();
    expect(tools.length).toBeGreaterThan(0);
    const setCellTool = tools.find(t => t.name === 'setCellValue');
    expect(setCellTool).toBeDefined();
    expect(setCellTool!.description).toBe('Set the value of a cell');
    expect(setCellTool!.inputSchema).toHaveProperty('properties');
  });

  it('callTool executes operation and marks source as agent', () => {
    const wb = createWorkbook({ modules: [AgentModule] });
    const result = wb.agent!.callTool('setCellValue', { sheet: 0, row: 0, col: 0, value: 'hello' });
    expect(result).toEqual({ success: true, undoable: true });
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('hello');

    const log = wb.agent!.getAuditLog();
    const agentEntry = log.find(e => e.source === 'agent');
    expect(agentEntry).toBeDefined();
  });

  it('traceFormula returns formula info', () => {
    const wb = createWorkbook({ modules: [FormulaModule, AgentModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 20 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 2, formula: '=A1+B1' } },
    ]);
    const trace = wb.agent!.traceFormula({ sheet: 0, row: 0, col: 2 });
    expect(trace).not.toBeNull();
    expect(trace!.formula).toBe('=A1+B1');
    expect(trace!.dependencies).toHaveLength(2);
    expect(trace!.result).toBe(30);
  });

  it('traceFormula returns null for non-formula cell', () => {
    const wb = createWorkbook({ modules: [FormulaModule, AgentModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 42 } }]);
    expect(wb.agent!.traceFormula({ sheet: 0, row: 0, col: 0 })).toBeNull();
  });

  it('audit log distinguishes human vs agent', () => {
    const wb = createWorkbook({ modules: [AgentModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'human' } }]);
    wb.agent!.callTool('setCellValue', { sheet: 0, row: 0, col: 1, value: 'agent' });
    const log = wb.agent!.getAuditLog();
    expect(log.some(e => e.source === 'unknown')).toBe(true);
    expect(log.some(e => e.source === 'agent')).toBe(true);
  });

  it('end-to-end: import data → pivot → formula → query', () => {
    const wb = createWorkbook({ modules: [PivotModule, FormulaModule, AgentModule] });
    const data = [
      { region: 'East', sales: 100 },
      { region: 'East', sales: 200 },
      { region: 'West', sales: 150 },
    ];
    wb.registerDataSource('ds', data);
    wb.agent!.callTool('pivot.setConfig', {
      sheet: 0, dataSourceId: 'ds',
      rows: ['region'], columns: [], values: ['sales'],
      valueAggregation: { sales: 'SUM' },
    });

    const ctx = wb.agent!.getContext();
    expect(ctx.pivotConfig).not.toBeNull();
    expect(ctx.cellCount).toBeGreaterThan(0);

    const csv = wb.exportCSV();
    expect(csv).toContain('300');
    expect(csv).toContain('150');
  });
});
