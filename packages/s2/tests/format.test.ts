import { describe, it, expect } from 'vitest';
import { createWorkbook, FormatModule, presetToPattern, allModules } from '../src/index';

const RANGE = (startRow: number, endRow: number, startCol: number, endCol: number) => ({
  startRow, endRow, startCol, endCol,
});

describe('FormatModule — 不注册时行为不变', () => {
  it('不注册 FormatModule:getCellDisplayValue 返回 raw number', () => {
    const wb = createWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1234.5 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(1234.5);
  });
});

describe('FormatModule — 数字格式化', () => {
  const setup = () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1234.5 } }]);
    return wb;
  };
  const setPattern = (wb: ReturnType<typeof setup>, pattern: string) =>
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern } }]);

  it('千分位+小数: 1234.5 + "#,##0.00" → "1,234.50"', () => {
    const wb = setup();
    setPattern(wb, '#,##0.00');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('1,234.50');
  });

  it('百分比: 0.5 + "0.00%" → "50.00%"', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 0.5 } }]);
    setPattern(wb, '0.00%');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('50.00%');
  });

  it('货币负数: -123 + "¥#,##0" → "-¥123"', () => {
    const wb = setup();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: -123 } }]);
    setPattern(wb, '¥#,##0');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('-¥123');
  });

  it('无 pattern 的 cell 仍返回 raw number(条件收窄)', () => {
    const wb = setup();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(1234.5);
  });

  it('字符串值不被数字格式化', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'hello' } }]);
    setPattern(wb, '#,##0.00');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('hello');
  });
});

describe('FormatModule — 日期与 autoFormat(决策B)', () => {
  it('autoFormat: Date 实例 → Excel serial + yyyy-mm-dd pattern', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    const d = new Date(2023, 0, 1);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: d, autoFormat: true } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('2023-01-01');
  });

  it('不带 autoFormat 的 Date 实例走默认 toString(不自动转)', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    const d = new Date(2023, 0, 1);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: d } }]);
    // 不带 autoFormat:Date 会被当成对象/字符串,String(date) 不会是 serial 格式化结果
    const v = wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 });
    expect(v).not.toBe('2023-01-01');
  });

  it('Excel serial 44927 + "yyyy-mm-dd" → "2023-01-01"', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 44927 } }]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: 'yyyy-mm-dd' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('2023-01-01');
  });
});

describe('FormatModule — 大数字保护(决策四)', () => {
  it('1e20 不进 numfmt,返回原值不丢精度', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1e20 } }]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: '#,##0' } }]);
    const v = wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 });
    expect(v).toBe(1e20);
  });

  it('1e15 进 numfmt 格式化', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1e15 } }]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: '#,##0' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('1,000,000,000,000,000');
  });
});

describe('FormatModule — 操作与 undo', () => {
  it('format.setPattern 对 range 生效', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 2 } },
    ]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 1), pattern: '0.00' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('1.00');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe('2.00');
  });

  it('format.setPattern 触发缓存失效', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(100);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: '0.00' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('100.00');
  });

  it('undo 还原旧 pattern', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } }]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: '0.00' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('100.00');
    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(100);
  });

  it('format.clear 清除 pattern', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } }]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: '0.00' } }]);
    wb.apply([{ type: 'format.clear', payload: { sheet: 0, range: RANGE(0, 0, 0, 0) } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(100);
  });

  it('format.setPreset 用 currency 预设', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1234.5 } }]);
    wb.apply([{
      type: 'format.setPreset',
      payload: { sheet: 0, range: RANGE(0, 0, 0, 0), preset: { kind: 'currency', decimal: 2, symbol: '¥' } },
    }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('¥1,234.50');
  });
});

describe('presetToPattern', () => {
  it('number + group + decimal', () => {
    expect(presetToPattern({ kind: 'number', decimal: 2, group: true })).toBe('#,##0.00');
  });
  it('number 无 group', () => {
    expect(presetToPattern({ kind: 'number', decimal: 0 })).toBe('0');
  });
  it('currency 默认符号 ¥', () => {
    expect(presetToPattern({ kind: 'currency', decimal: 2 })).toBe('¥#,##0.00');
  });
  it('percent', () => {
    expect(presetToPattern({ kind: 'percent', decimal: 1 })).toBe('0.0%');
  });
  it('date', () => {
    expect(presetToPattern({ kind: 'date' })).toBe('yyyy-mm-dd');
  });
  it('datetime', () => {
    expect(presetToPattern({ kind: 'datetime' })).toBe('yyyy-mm-dd hh:mm');
  });
});

describe('FormatModule — 与其他模块共存', () => {
  it('allModules 含 FormatModule,透视表 + 格式化共存不抛错', () => {
    const wb = createWorkbook({ modules: allModules });
    wb.registerDataSource('sales', [
      { province: '浙江', price: 1234.5 },
      { province: '江苏', price: 678.9 },
    ]);
    wb.apply([{
      type: 'pivot.setConfig',
      payload: { sheet: 0, dataSourceId: 'sales', rows: ['province'], columns: [], values: ['price'], valueAggregation: { price: 'SUM' } },
    }]);
    // 给整片区域加格式,验证 format 与 pivot 实体化的 cell 共存不抛错
    expect(() => {
      wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 10, 0, 5), pattern: '#,##0.00' } }]);
    }).not.toThrow();
  });

  it('Agent API 可调用 format.setPattern', () => {
    const wb = createWorkbook({ modules: allModules, locale: 'zh-CN' });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } }]);
    const result = wb.agent!.callTool('format.setPattern', {
      sheet: 0,
      range: RANGE(0, 0, 0, 0),
      pattern: '0.00',
    });
    expect(result.success).toBe(true);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('100.00');
  });
});

describe('locale 支持', () => {
  it('createWorkbook locale 选项传入 Query Layer', () => {
    const wb = createWorkbook({ modules: [FormatModule], locale: 'zh-CN' });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1234.5 } }]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: '#,##0.00' } }]);
    // zh-CN 千分位仍为 ",",验证 formatter 收到 locale(具体符号由 numfmt locale 决定)
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('1,234.50');
  });
});

describe('exportCSV 不带格式化(决策A:用 raw value)', () => {
  it('格式化 cell 的 CSV 导出是 raw value,无千分位', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1234.5 } }]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: '#,##0.00' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('1,234.50');
    const csv = wb.exportCSV();
    expect(csv).toContain('1234.5');
    expect(csv).not.toContain('1,234.50');
  });
});

describe('编辑还原(getEditValue / parseEditValue)', () => {
  it('percent: getEditValue 0.5 → "50",parseEditValue "50" → 0.5', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 0.5 } }]);
    wb.apply([{ type: 'format.setPreset', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), preset: { kind: 'percent', decimal: 1 } } }]);
    expect(wb.query.tryModuleQuery('format.getEditValue', { value: 0.5, pattern: '0.0%' })).toBe('50');
    expect(wb.query.tryModuleQuery('format.parseEditValue', { input: '50', pattern: '0.0%' })).toEqual({ value: 0.5 });
  });

  it('date: getEditValue 显示格式串,parseEditValue 解析回 serial', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: new Date(2023, 0, 15), autoFormat: true } }]);
    const pattern = wb.query.tryModuleQuery('format.getPattern', { sheet: 0, row: 0, col: 0 }) as string | null;
    expect(pattern).toBe('yyyy-mm-dd');
    const serial = wb.query.getCellRawValue({ sheet: 0, row: 0, col: 0 })?.value;
    expect(wb.query.tryModuleQuery('format.getEditValue', { value: serial, pattern })).toBe('2023-01-15');
    expect(wb.query.tryModuleQuery('format.parseEditValue', { input: '2023-02-20', pattern })).toEqual({ value: 44977 });
  });

  it('date 斜杠分隔也解析', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    const r = wb.query.tryModuleQuery('format.parseEditValue', { input: '2023/3/8', pattern: 'yyyy-mm-dd' }) as { value: number };
    expect(typeof r.value).toBe('number');
    expect(r.value).toBeGreaterThan(44927);
  });

  it('date 非法输入降级为字符串(不清 pattern,显示自洽)', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: new Date(2023, 0, 15), autoFormat: true } }]);
    const result = wb.query.tryModuleQuery('format.parseEditValue', { input: 'hello', pattern: 'yyyy-mm-dd' }) as { value: string | number };
    expect(result.value).toBe('hello');
    // 提交后 cell value 变字符串,pattern 还在;显示走 raw 字符串分支,不崩
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'hello' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('hello');
  });

  it('number: getEditValue 显示 raw,parseEditValue 解析 number', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1234.5 } }]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: '#,##0.00' } }]);
    expect(wb.query.tryModuleQuery('format.getEditValue', { value: 1234.5, pattern: '#,##0.00' })).toBe('1234.5');
    expect(wb.query.tryModuleQuery('format.parseEditValue', { input: '999', pattern: '#,##0.00' })).toEqual({ value: 999 });
  });

  it('number 非数字降级字符串', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    expect(wb.query.tryModuleQuery('format.parseEditValue', { input: 'abc', pattern: '#,##0.00' })).toEqual({ value: 'abc' });
  });
});

describe('Bug 修复:setCellValue 不丢 numFmt', () => {
  it('有格式的 cell 用 setCellValue 改值,pattern 保留', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1234.5 } }]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: '¥#,##0.00' } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('¥1,234.50');

    // 模拟编辑提交(无 EditModule 时走 setCellValue):改值,格式应保留
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 999 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('¥999.00');
    expect(wb.query.tryModuleQuery('format.getPattern', { sheet: 0, row: 0, col: 0 })).toBe('¥#,##0.00');
  });

  it('有格式的 cell 用 setCellValue 设空值(删除),pattern 保留', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } }]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: '#,##0' } }]);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: null } }]);
    // value 删了但 pattern 还在,重新填值能正常格式化
    expect(wb.query.tryModuleQuery('format.getPattern', { sheet: 0, row: 0, col: 0 })).toBe('#,##0');
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 5000 } }]);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('5,000');
  });

  it('Undo 后 pattern 保留(restoreCell 写回完整 cell)', () => {
    const wb = createWorkbook({ modules: [FormatModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 100 } }]);
    wb.apply([{ type: 'format.setPattern', payload: { sheet: 0, range: RANGE(0, 0, 0, 0), pattern: '#,##0' } }]);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 200 } }]);
    wb.undo();
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('100');
    expect(wb.query.tryModuleQuery('format.getPattern', { sheet: 0, row: 0, col: 0 })).toBe('#,##0');
  });
});
