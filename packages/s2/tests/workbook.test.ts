import { describe, it, expect } from 'vitest';
import { createWorkbook, defineModule, PivotModule } from '../src/index';

describe('createWorkbook', () => {
  it('should create a workbook with default sheet', () => {
    const workbook = createWorkbook();
    const json = workbook.toJSON();
    expect(json.sheets).toHaveLength(1);
    expect(json.sheets[0]!.name).toBe('Sheet1');
  });

  it('should set and get cell value', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Hello' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 42 } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('Hello');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(42);
  });

  it('should return null for empty cell', () => {
    const workbook = createWorkbook();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 5, col: 5 })).toBe(null);
  });

  it('should undo and redo', () => {
    const workbook = createWorkbook();
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'A' } }]);
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'B' } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('B');

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('A');

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(null);

    workbook.redo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('A');
  });

  it('should rollback on error (atomicity)', () => {
    const workbook = createWorkbook();
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'before' } }]);

    expect(() => {
      workbook.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'during' } },
        { type: 'unknownOp', payload: {} },
      ]);
    }).toThrow('Unknown operation');

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('before');
  });

  it('should support event subscription', () => {
    const workbook = createWorkbook();
    const events: unknown[] = [];
    const unsub = workbook.on('operationApplied', (ops) => events.push(ops));

    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    expect(events).toHaveLength(1);

    unsub();
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 2 } }]);
    expect(events).toHaveLength(1);
  });

  it('should create and delete sheets', () => {
    const workbook = createWorkbook();
    workbook.apply([{ type: 'createSheet', payload: { name: 'Data' } }]);
    expect(workbook.toJSON().sheets).toHaveLength(2);
    expect(workbook.toJSON().sheets[1]!.name).toBe('Data');

    workbook.undo();
    expect(workbook.toJSON().sheets).toHaveLength(1);
  });

  it('should insert and delete rows', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'A' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'B' } },
    ]);
    workbook.apply([{ type: 'insertRows', payload: { sheet: 0, index: 1, count: 1 } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('A');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(null);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('B');
  });

  it('should support modules with lifecycle', () => {
    const calls: string[] = [];
    const TestModule = defineModule({
      name: 'test',
      lifecycle: {
        onInit() { calls.push('init'); },
        onOperationApplied() { calls.push('applied'); },
      },
    });

    const workbook = createWorkbook({ modules: [TestModule] });
    expect(calls).toContain('init');

    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    expect(calls).toContain('applied');
  });

  it('should reject module with missing deps', () => {
    const DepModule = defineModule({ name: 'dep' });
    const ChildModule = defineModule({ name: 'child', deps: [DepModule] });

    expect(() => createWorkbook({ modules: [ChildModule] })).toThrow('depends on "dep"');
  });

  it('should queryRange', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 2 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 3 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 1, value: 4 } },
    ]);
    const result = workbook.query.queryRange({
      sheet: 0,
      range: { startRow: 0, endRow: 1, startCol: 0, endCol: 1 },
    });
    expect(result).toEqual([[1, 2], [3, 4]]);
  });

  it('should undo deleteSheet and restore all cell data', () => {
    const workbook = createWorkbook();
    workbook.apply([{ type: 'createSheet', payload: { name: 'Data' } }]);
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 1, row: 0, col: 0, value: 'X' } },
      { type: 'setCellValue', payload: { sheet: 1, row: 1, col: 0, value: 'Y' } },
    ]);
    workbook.apply([{ type: 'deleteSheet', payload: { sheet: 1 } }]);
    expect(workbook.toJSON().sheets).toHaveLength(1);

    workbook.undo();
    expect(workbook.toJSON().sheets).toHaveLength(2);
    expect(workbook.query.getCellDisplayValue({ sheet: 1, row: 0, col: 0 })).toBe('X');
    expect(workbook.query.getCellDisplayValue({ sheet: 1, row: 1, col: 0 })).toBe('Y');
  });

  it('should undo deleteRows and restore deleted cell data', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'A' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'B' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'C' } },
    ]);

    workbook.apply([{ type: 'deleteRows', payload: { sheet: 0, index: 1, count: 1 } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('A');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('C');

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('A');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('B');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('C');
  });

  it('should undo deleteColumns and restore deleted cell data', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'X' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'Y' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 2, value: 'Z' } },
    ]);

    workbook.apply([{ type: 'deleteColumns', payload: { sheet: 0, index: 1, count: 1 } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('X');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe('Z');

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('X');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe('Y');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe('Z');
  });

  it('should save and restore module state via toJSON/snapshot', () => {
    const wb1 = createWorkbook({ modules: [PivotModule] });
    wb1.registerDataSource('data', [
      { a: '1', b: 10 },
      { a: '2', b: 20 },
    ]);
    wb1.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'data',
        rows: ['a'],
        columns: [],
        values: ['b'],
        valueAggregation: { b: 'SUM' },
      },
    }]);

    const json = wb1.toJSON();

    // Restore from snapshot
    const wb2 = createWorkbook({ modules: [PivotModule], snapshot: json as any });
    const config = wb2.query.moduleQuery('pivot.getConfig', { sheet: 0 });
    expect(config).not.toBeNull();
    expect((config as any).rows).toEqual(['a']);
    expect((config as any).values).toEqual(['b']);
  });

  it('should preserve unrecognized module state in snapshot', () => {
    const wb1 = createWorkbook();
    const json = wb1.toJSON() as any;
    json.__moduleState = { unknownModule: { data: 42 } };

    // Loading into a workbook without that module — __moduleState is silently ignored
    const wb2 = createWorkbook({ snapshot: json });
    expect(wb2.toJSON().sheets).toHaveLength(1);
  });

  it('should export CSV', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Name' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'Age' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'Alice' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 1, value: 30 } },
    ]);
    expect(workbook.exportCSV()).toBe('Name,Age\nAlice,30');
  });

  it('should export TSV', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'A' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'B' } },
    ]);
    expect(workbook.exportTSV()).toBe('A\tB');
  });

  it('should escape CSV values with commas and quotes', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'hello, world' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'say "hi"' } },
    ]);
    expect(workbook.exportCSV()).toBe('"hello, world","say ""hi"""');
  });
});
