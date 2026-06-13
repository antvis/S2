import { describe, it, expect } from 'vitest';
import { createWorkbook, defineModule } from '../src/index';

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
});
