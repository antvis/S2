import { LayoutWidthType, type S2Options } from '@/common';
import { PivotSheet } from '@/sheet-type';
import * as mockDataConfig from 'tests/data/data-issue-372.json';
import { getContainer } from 'tests/util/helpers';

const s2options: S2Options = {
  width: 800,
  height: 600,
};

describe('Row width Test in grid mode', () => {
  let s2: PivotSheet;

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2options);
    await s2.render();
  });

  test('get the correct custom width of row nodes when the layoutWidthType equals adaptive', () => {
    const rowNodes = s2.facet.getRowNodes();

    expect(Math.round(rowNodes[0].width)).toBe(266);
  });

  test('get the correct custom width of row nodes when the layoutWidthType equals colAdaptive', async () => {
    s2.setOptions({
      style: {
        layoutWidthType: LayoutWidthType.Compact,
        rowCell: { width: 50 },
      },
    });
    await s2.render();

    const rowNodes = s2.facet.getRowNodes();

    expect(rowNodes[0].width).toBe(50);
  });

  test('get the correct custom width of row nodes when the layoutWidthType equals compact', async () => {
    s2.setOptions({
      style: {
        layoutWidthType: LayoutWidthType.Compact,
        rowCell: { width: 20 },
      },
    });
    await s2.render();

    const rowNodes = s2.facet.getRowNodes();

    expect(rowNodes[0].width).toBe(20);
  });

  test('get the correct width of row nodes in compact mode with compactExtraWidth', async () => {
    // 1. 先获取不配置额外宽度时的基础宽度
    s2.setOptions({
      style: {
        layoutWidthType: LayoutWidthType.Compact,
      },
    });
    await s2.render();
    const rowNodesOriginal = s2.facet.getRowNodes();
    const baseWidth = Math.round(rowNodesOriginal[0].width);

    // 2. 配置额外宽度
    s2.setOptions({
      style: {
        layoutWidthType: LayoutWidthType.Compact,
        compactExtraWidth: 20,
      },
      // 需要强制重新 render 以触发布局更新
    });
    // 确保 options 更新生效
    await s2.render();

    const rowNodes = s2.facet.getRowNodes();

    // 基础宽度 + 额外宽度
    expect(Math.round(rowNodes[0].width)).toBe(baseWidth + 20);
  });

  test('get the correct width of row nodes in compact mode with compactMinWidth', async () => {
    s2.setOptions({
      style: {
        layoutWidthType: LayoutWidthType.Compact,
        compactMinWidth: 100,
      },
    });
    await s2.render();

    const rowNodes = s2.facet.getRowNodes();

    // 基础宽度 < 最小宽度 100，所以应用最小宽度
    expect(Math.round(rowNodes[0].width)).toBe(100);
  });

  test('get the correct width of row nodes in compact mode with both compactExtraWidth and compactMinWidth', async () => {
    // 1. 获取基础宽度
    s2.setOptions({
      style: {
        layoutWidthType: LayoutWidthType.Compact,
      },
    });
    await s2.render();
    const rowNodesOriginal = s2.facet.getRowNodes();
    const baseWidth = Math.round(rowNodesOriginal[0].width);

    // 2. 设置额外宽度和最小宽度
    s2.setOptions({
      style: {
        layoutWidthType: LayoutWidthType.Compact,
        compactExtraWidth: 10,
        compactMinWidth: 80,
      },
    });
    await s2.render();

    const rowNodes = s2.facet.getRowNodes();

    // 基础宽度 + 额外宽度 < 最小宽度 80，所以应用最小宽度
    // 47 + 10 = 57 < 80
    expect(Math.round(rowNodes[0].width)).toBe(80);
    // 验证确实小于 (防御性检查)
    expect(baseWidth + 10).toBeLessThan(80);
  });
});
