/**
 * @description spec for issue #3285
 * https://github.com/antvis/S2/issues/3285
 * 大数据量明细表，data-cell 上下边框缺失
 * 当行数超过 279621（y 坐标超过 8,388,608 即 2^23）时，32位浮点数精度不足导致边框位置计算错误
 */
import { CellBorderPosition, type CellTheme } from '@/common/interface';
import { getBorderPositionAndStyle } from '@/utils/cell/cell';

describe('Issue #3285: Large data table data-cell border missing', () => {
  const cellStyle: CellTheme = {
    horizontalBorderWidth: 1,
    verticalBorderWidth: 1,
    horizontalBorderColor: '#000',
    verticalBorderColor: '#000',
    horizontalBorderColorOpacity: 1,
    verticalBorderColorOpacity: 1,
  };

  describe('getBorderPositionAndStyle', () => {
    test('should return integer y positions for horizontal borders at large y values', () => {
      // 模拟大数据量场景，y 坐标超过 2^23 (8,388,608)
      const bbox = {
        x: 0,
        y: 8388630, // 约等于 row 279621 * 30 (row height)
        width: 100,
        height: 30,
      };

      const topBorder = getBorderPositionAndStyle(
        CellBorderPosition.TOP,
        bbox,
        cellStyle,
      );
      const bottomBorder = getBorderPositionAndStyle(
        CellBorderPosition.BOTTOM,
        bbox,
        cellStyle,
      );

      // y1 和 y2 应该是整数，避免浮点数精度问题
      expect(Number.isInteger(topBorder.position.y1)).toBe(true);
      expect(Number.isInteger(topBorder.position.y2)).toBe(true);
      expect(Number.isInteger(bottomBorder.position.y1)).toBe(true);
      expect(Number.isInteger(bottomBorder.position.y2)).toBe(true);

      // 验证位置正确（四舍五入后）
      // TOP: y + horizontalBorderWidth / 2 = 8388630 + 0.5 ≈ 8388631
      expect(topBorder.position.y1).toBe(8388631);
      expect(topBorder.position.y2).toBe(8388631);

      // BOTTOM: y + height - horizontalBorderWidth / 2 = 8388630 + 30 - 0.5 ≈ 8388660
      expect(bottomBorder.position.y1).toBe(8388660);
      expect(bottomBorder.position.y2).toBe(8388660);
    });

    test('should return integer x positions for vertical borders at large x values', () => {
      // 测试大 x 值时的垂直边框
      const bbox = {
        x: 8388630,
        y: 0,
        width: 100,
        height: 30,
      };

      const leftBorder = getBorderPositionAndStyle(
        CellBorderPosition.LEFT,
        bbox,
        cellStyle,
      );
      const rightBorder = getBorderPositionAndStyle(
        CellBorderPosition.RIGHT,
        bbox,
        cellStyle,
      );

      // x1 和 x2 应该是整数
      expect(Number.isInteger(leftBorder.position.x1)).toBe(true);
      expect(Number.isInteger(leftBorder.position.x2)).toBe(true);
      expect(Number.isInteger(rightBorder.position.x1)).toBe(true);
      expect(Number.isInteger(rightBorder.position.x2)).toBe(true);

      // LEFT: x + verticalBorderWidth / 2 = 8388630 + 0.5 ≈ 8388631
      expect(leftBorder.position.x1).toBe(8388631);
      expect(leftBorder.position.x2).toBe(8388631);

      // RIGHT: x + width - verticalBorderWidth / 2 = 8388630 + 100 - 0.5 ≈ 8388730
      expect(rightBorder.position.x1).toBe(8388730);
      expect(rightBorder.position.x2).toBe(8388730);
    });

    test('should handle normal y values correctly', () => {
      // 测试正常数据量场景
      const bbox = {
        x: 0,
        y: 100,
        width: 100,
        height: 30,
      };

      const topBorder = getBorderPositionAndStyle(
        CellBorderPosition.TOP,
        bbox,
        cellStyle,
      );
      const bottomBorder = getBorderPositionAndStyle(
        CellBorderPosition.BOTTOM,
        bbox,
        cellStyle,
      );

      // 正常情况下也应该返回整数
      expect(Number.isInteger(topBorder.position.y1)).toBe(true);
      expect(Number.isInteger(bottomBorder.position.y1)).toBe(true);

      // TOP: 100 + 0.5 ≈ 101
      expect(topBorder.position.y1).toBe(101);
      // BOTTOM: 100 + 30 - 0.5 ≈ 130
      expect(bottomBorder.position.y1).toBe(130);
    });

    test('should handle even border width correctly', () => {
      // 测试偶数边框宽度
      const style: CellTheme = {
        ...cellStyle,
        horizontalBorderWidth: 2,
        verticalBorderWidth: 2,
      };
      const bbox = {
        x: 0,
        y: 8388630,
        width: 100,
        height: 30,
      };

      const topBorder = getBorderPositionAndStyle(
        CellBorderPosition.TOP,
        bbox,
        style,
      );
      const bottomBorder = getBorderPositionAndStyle(
        CellBorderPosition.BOTTOM,
        bbox,
        style,
      );

      // 偶数边框宽度除以2是整数，不会有精度问题，但结果仍应为整数
      expect(Number.isInteger(topBorder.position.y1)).toBe(true);
      expect(Number.isInteger(bottomBorder.position.y1)).toBe(true);

      // TOP: 8388630 + 1 = 8388631
      expect(topBorder.position.y1).toBe(8388631);
      // BOTTOM: 8388630 + 30 - 1 = 8388659
      expect(bottomBorder.position.y1).toBe(8388659);
    });
  });
});
