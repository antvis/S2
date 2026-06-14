import { describe, it, expect } from 'vitest';
import { createWorkbook, EditModule } from '../src/index';

describe('EditModule', () => {
  it('should track editing state via edit.start', () => {
    const workbook = createWorkbook({ modules: [EditModule] });
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'hello' } }]);

    workbook.apply([{ type: 'edit.start', payload: { sheet: 0, row: 0, col: 0 } }]);
    const editing = workbook.query.moduleQuery('edit.getEditing', {}) as { sheet: number; row: number; col: number } | null;
    expect(editing).toEqual({ sheet: 0, row: 0, col: 0 });
  });

  it('should clear editing state on edit.commit', () => {
    const workbook = createWorkbook({ modules: [EditModule] });
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'old' } }]);

    workbook.apply([{ type: 'edit.start', payload: { sheet: 0, row: 0, col: 0 } }]);
    workbook.apply([{ type: 'edit.commit', payload: { sheet: 0, row: 0, col: 0, value: 'new' } }]);

    const editing = workbook.query.moduleQuery('edit.getEditing', {});
    expect(editing).toBeNull();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('new');
  });

  it('should clear editing state on edit.cancel', () => {
    const workbook = createWorkbook({ modules: [EditModule] });
    workbook.apply([{ type: 'edit.start', payload: { sheet: 0, row: 0, col: 0 } }]);
    workbook.apply([{ type: 'edit.cancel', payload: {} }]);

    const editing = workbook.query.moduleQuery('edit.getEditing', {});
    expect(editing).toBeNull();
  });

  it('should undo edit.commit and restore old value', () => {
    const workbook = createWorkbook({ modules: [EditModule] });
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'original' } }]);

    workbook.apply([{ type: 'edit.commit', payload: { sheet: 0, row: 0, col: 0, value: 'modified' } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('modified');

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('original');
  });

  it('should not push edit.start to undo stack', () => {
    const workbook = createWorkbook({ modules: [EditModule] });
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'v1' } }]);
    workbook.apply([{ type: 'edit.start', payload: { sheet: 0, row: 0, col: 0 } }]);

    // undo should skip edit.start and undo setCellValue
    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBeNull();
  });

  it('should commit null value to clear a cell', () => {
    const workbook = createWorkbook({ modules: [EditModule] });
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 42 } }]);
    workbook.apply([{ type: 'edit.commit', payload: { sheet: 0, row: 0, col: 0, value: null } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBeNull();
  });

  it('should work without EditModule (fallback to setCellValue)', () => {
    const workbook = createWorkbook();
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'works' } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('works');
  });
});
