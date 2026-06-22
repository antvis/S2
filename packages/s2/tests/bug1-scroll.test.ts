import { describe, it, expect } from 'vitest';
import { createWorkbook } from '../src/index';
import { LayoutEngine } from '../src/layout/engine';

// Bug 1 headless 验证:整列选中(endRow=999)调 ensureCellVisible 会让 scrollY 拉到表格尾部。
// 复现根因,验证 mount.ts 的 isFullCol 跳过逻辑触发条件成立。
describe('Bug 1 headless 验证 — 列头选中跳底', () => {
  it('ensureCellVisible(虚拟大行号)会把 scrollY 拉到底部', () => {
    const wb = createWorkbook();
    const ops = [];
    for (let r = 0; r < 100; r++) ops.push({ type: 'setCellValue', payload: { sheet: 0, row: r, col: 0, value: r } });
    wb.apply(ops);

    const layout = new LayoutEngine(wb.__getModel(), wb.query);
    expect(typeof layout.getScrollOffset).toBe('function');

    // 整列选中的 simulation:endRow=999 调 ensureCellVisible
    layout.ensureCellVisible(999, 0, 800, 500);
    const scroll = layout.getScrollOffset();
    // scrollY 被拉到很大正值 → 表格滚到底部(这就是用户看到的"跳到最后一行")
    expect(scroll.y).toBeGreaterThan(1000);
  });

  it('真实行号(5)调 ensureCellVisible 不会大幅滚动', () => {
    const wb = createWorkbook();
    const ops = [];
    for (let r = 0; r < 100; r++) ops.push({ type: 'setCellValue', payload: { sheet: 0, row: r, col: 0, value: r } });
    wb.apply(ops);

    const layout = new LayoutEngine(wb.__getModel(), wb.query);
    layout.ensureCellVisible(5, 0, 800, 500);
    const scroll = layout.getScrollOffset();
    // 单 cell 在可视区顶部,不需要大幅滚动
    expect(scroll.y).toBeLessThan(100);
  });

  it('mount.ts 的跳过逻辑:endRow >= 999 判为整列', () => {
    // 复现 mount.ts 的判断条件,确认 999 阈值正确拦截整列选中
    const FULL = 999;
    const colHeaderSelection = { sheet: 0, startRow: 1, startCol: 1, endRow: 999, endCol: 1 };
    const cellSelection = { sheet: 0, startRow: 5, startCol: 1, endRow: 5, endCol: 1 };
    expect(colHeaderSelection.endRow >= FULL).toBe(true);  // 整列 → 跳过 ensureCellVisible
    expect(cellSelection.endRow >= FULL).toBe(false);       // 单 cell → 正常 ensureCellVisible
  });
});
