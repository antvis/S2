import { describe, it, expect } from 'vitest';
import { createWorkbook, EditModule, FormatModule } from '../src/index';

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

  it('should copy a range to internal clipboard', () => {
    const workbook = createWorkbook({ modules: [EditModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'A' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'B' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'C' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 1, value: 'D' } },
    ]);

    workbook.apply([{
      type: 'edit.copy',
      payload: { sheet: 0, range: { startRow: 0, endRow: 1, startCol: 0, endCol: 1 } },
    }]);

    const clipboard = workbook.query.moduleQuery('edit.getClipboard', {}) as { cells: { value: unknown }[][]; rows: number; cols: number };
    expect(clipboard.rows).toBe(2);
    expect(clipboard.cols).toBe(2);
    expect(clipboard.cells.map((row) => row.map((c) => c.value))).toEqual([['A', 'B'], ['C', 'D']]);
  });

  it('should paste clipboard content to target position', () => {
    const workbook = createWorkbook({ modules: [EditModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 2 } },
    ]);

    workbook.apply([{
      type: 'edit.copy',
      payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 1 } },
    }]);

    workbook.apply([{
      type: 'edit.paste',
      payload: { sheet: 0, row: 5, col: 0 },
    }]);

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 5, col: 0 })).toBe(1);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 5, col: 1 })).toBe(2);
  });

  it('Excel 语义:复制粘贴搬完整 cell(value + 加粗/颜色 style)', () => {
    const workbook = createWorkbook({ modules: [EditModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: -5678.9 } },
      { type: 'setCellStyle', payload: { sheet: 0, row: 0, col: 0, style: { bold: true, color: '#ff0000' } } },
    ]);

    workbook.apply([{
      type: 'edit.copy',
      payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 } },
    }]);
    workbook.apply([{
      type: 'edit.paste',
      payload: { sheet: 0, row: 5, col: 5 },
    }]);

    // 值跟着搬
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 5, col: 5 })).toBe(-5678.9);
    // 加粗 + 颜色 style 跟着搬
    const pasted = workbook.query.getCellRawValue({ sheet: 0, row: 5, col: 5 });
    expect(pasted?.style?.bold).toBe(true);
    expect(pasted?.style?.color).toBe('#ff0000');
  });

  it('Excel 语义:复制带 numFmt 的 cell,粘贴后格式保留且显示格式化', () => {
    const workbook = createWorkbook({ modules: [EditModule, FormatModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: -5678.9 } },
      { type: 'format.setPattern', payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 }, pattern: '¥#,##0.00' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('-¥5,678.90');

    workbook.apply([{
      type: 'edit.copy',
      payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 } },
    }]);
    workbook.apply([{
      type: 'edit.paste',
      payload: { sheet: 0, row: 3, col: 3 },
    }]);

    // 粘贴后显示也带货币格式 —— 这正是用户期望的
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 3 })).toBe('-¥5,678.90');
    const pasted = workbook.query.getCellRawValue({ sheet: 0, row: 3, col: 3 });
    expect(pasted?.style?.numFmt).toBe('¥#,##0.00');
  });

  it('Excel 语义:paste 的 undo 还原目标原格式(不被源格式污染)', () => {
    const workbook = createWorkbook({ modules: [EditModule, FormatModule] });
    // 源:货币格式
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } },
      { type: 'format.setPattern', payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 }, pattern: '¥#,##0' } },
    ]);
    // 目标:本来是百分比格式
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 0.5 } },
      { type: 'format.setPattern', payload: { sheet: 0, range: { startRow: 3, endRow: 3, startCol: 0, endCol: 0 }, pattern: '0%' } },
    ]);

    workbook.apply([{ type: 'edit.copy', payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 } } }]);
    workbook.apply([{ type: 'edit.paste', payload: { sheet: 0, row: 3, col: 0 } }]);
    // 粘贴后目标变货币
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe('¥100');

    workbook.undo();
    // undo 还原目标的百分比格式 + 原 value
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe('50%');
    expect(workbook.query.tryModuleQuery('format.getPattern', { sheet: 0, row: 3, col: 0 })).toBe('0%');
  });

  it('should undo paste and restore original values', () => {
    const workbook = createWorkbook({ modules: [EditModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'src' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 5, col: 0, value: 'old' } },
    ]);

    workbook.apply([{
      type: 'edit.copy',
      payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 } },
    }]);

    workbook.apply([{
      type: 'edit.paste',
      payload: { sheet: 0, row: 5, col: 0 },
    }]);

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 5, col: 0 })).toBe('src');

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 5, col: 0 })).toBe('old');
  });

  it('should not paste when clipboard is empty', () => {
    const workbook = createWorkbook({ modules: [EditModule] });
    workbook.apply([{
      type: 'edit.paste',
      payload: { sheet: 0, row: 0, col: 0 },
    }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBeNull();
  });
});
