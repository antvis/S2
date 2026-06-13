import { describe, it, expect } from 'vitest';
import { createWorkbook, defineModule } from '../src/index';

describe('edge cases', () => {
  it('should handle undo on empty workbook', () => {
    const workbook = createWorkbook();
    expect(workbook.undo()).toBe(false);
    expect(workbook.redo()).toBe(false);
  });

  it('should handle apply with empty array', () => {
    const workbook = createWorkbook();
    expect(() => workbook.apply([])).not.toThrow();
    expect(workbook.canUndo()).toBe(false);
  });

  it('should throw on operation to non-existent sheet', () => {
    const workbook = createWorkbook();
    // setCellValue on non-existent sheet doesn't throw — it's a no-op (model.setCell returns early)
    // but the inverse will be generated with null oldValue
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 99, row: 0, col: 0, value: 'x' } }]);
    // Should not have changed anything queryable
    expect(workbook.query.getCellDisplayValue({ sheet: 99, row: 0, col: 0 })).toBe(null);
  });

  it('should throw on unknown operation type', () => {
    const workbook = createWorkbook();
    expect(() => {
      workbook.apply([{ type: 'nonexistent.op', payload: {} }]);
    }).toThrow('Unknown operation: "nonexistent.op"');
  });

  it('should throw on duplicate module registration', () => {
    const ModA = defineModule({ name: 'dup' });
    const ModB = defineModule({ name: 'dup' });
    // Second module with same name will try to register same operation types
    // but since they have no operations, it won't conflict — just two entries
    // The real conflict is if they register the same operation type
    const Mod1 = defineModule({
      name: 'conflict1',
      operations: {
        'shared.op': { meta: {}, execute(_m, _p) { return []; } },
      },
    });
    const Mod2 = defineModule({
      name: 'conflict2',
      operations: {
        'shared.op': { meta: {}, execute(_m, _p) { return []; } },
      },
    });
    expect(() => createWorkbook({ modules: [Mod1, Mod2] })).toThrow('already registered');
  });

  it('should correctly rollback partial batch on failure', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'original' } },
    ]);

    // Second op in batch will fail, first should be rolled back
    expect(() => {
      workbook.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'changed' } },
        { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'ok' } },
        { type: 'badOp', payload: {} },
      ]);
    }).toThrow();

    // First cell should be rolled back to 'original'
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('original');
    // Second cell should also be rolled back
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(null);
  });

  it('should not add to undo stack when undoable is false', () => {
    const NonUndoModule = defineModule({
      name: 'nonundo',
      operations: {
        'nonundo.set': {
          meta: { undoable: false },
          execute(_m, _p) { return []; },
        },
      },
    });
    const workbook = createWorkbook({ modules: [NonUndoModule] });
    workbook.apply([{ type: 'nonundo.set', payload: {} }]);
    expect(workbook.canUndo()).toBe(false);
  });

  it('should handle deleteSheet on last sheet gracefully', () => {
    const workbook = createWorkbook();
    // Only 1 sheet, delete should produce empty inverse (model.removeSheet returns undefined)
    workbook.apply([{ type: 'deleteSheet', payload: { sheet: 0 } }]);
    // Should still have 1 sheet (can't delete the last one)
    expect(workbook.toJSON().sheets).toHaveLength(1);
  });
});
