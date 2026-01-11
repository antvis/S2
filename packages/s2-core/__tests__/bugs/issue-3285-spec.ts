/**
 * @description spec for issue #3285
 * https://github.com/antvis/S2/issues/3285
 * 大数据量明细表，data-cell 上下边框缺失
 * 当数据量很大时，绝对 Y 坐标可能超过 2^24，导致 32 位浮点数精度丢失
 * 解决方案：使用相对坐标 + 偏移量来绘制网格线
 */
import { getRowsForGrid } from '@/utils/grid';

describe('Issue #3285: Large data table grid rendering', () => {
  // 模拟 viewCellHeights 对象
  const createViewCellHeights = (rowHeight: number) => ({
    getCellOffsetY: (rowIndex: number) => rowIndex * rowHeight,
    getTotalHeight: () => 0,
    getTotalLength: () => 0,
    getIndexRange: () => ({ start: 0, end: 0 }),
  });

  describe('getRowsForGrid', () => {
    test('should return relative coordinates and offset for small row indexes', () => {
      const viewCellHeights = createViewCellHeights(30);
      const { rows, offset } = getRowsForGrid(0, 10, viewCellHeights);

      // 偏移量应该是第一个可见行的 Y 坐标
      expect(offset).toBe(0);

      // rows 应该是相对坐标（相对于第一个可见行的底部）
      expect(rows[0]).toBe(30); // row 0 的底部 = 30 - 0 = 30
      expect(rows[10]).toBe(330); // row 10 的底部 = 330 - 0 = 330
    });

    test('should return relative coordinates for large row indexes (beyond 2^24 with DPR)', () => {
      const viewCellHeights = createViewCellHeights(30);
      // 模拟滚动到第 279621 行
      // 当 DPR=2 时，canvas 内部 Y = 279621 × 30 × 2 = 16,777,260
      // 此值接近 2^24 = 16,777,216 的精度边界
      const rowMin = 279621;
      const rowMax = 279631;
      const { rows, offset } = getRowsForGrid(rowMin, rowMax, viewCellHeights);

      // 偏移量应该是第一个可见行的 Y 坐标（大值）
      expect(offset).toBe(279621 * 30);

      // rows 应该是相对坐标（小值，从 0 开始）
      // row[0] = getCellOffsetY(279622) - offset = 279622 * 30 - 279621 * 30 = 30
      expect(rows[0]).toBe(30);
      // row[10] = getCellOffsetY(279632) - offset = 279632 * 30 - 279621 * 30 = 330
      expect(rows[10]).toBe(330);

      // 所有相对坐标都应该是小值，可以安全地在 canvas 中渲染
      rows.forEach((row) => {
        expect(row).toBeLessThan(1000);
      });
    });

    test('should handle edge case where rowMin equals rowMax', () => {
      const viewCellHeights = createViewCellHeights(30);
      const { rows, offset } = getRowsForGrid(100, 100, viewCellHeights);

      expect(offset).toBe(100 * 30);
      expect(rows.length).toBe(1);
      expect(rows[0]).toBe(30); // 单行的底部位置
    });
  });
});
