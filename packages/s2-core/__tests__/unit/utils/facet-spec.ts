import {
  getIndexRangeWithOffsets,
  getAdjustedRowScrollX,
  getAdjustedScrollOffset,
} from '@/utils/facet';

describe('Facet util test', () => {
  test('should get correct index range for given offsets', () => {
    const offsets = [0, 30, 60, 90, 120, 150, 160, 170, 190];

    expect(getIndexRangeWithOffsets(offsets, 0, 31)).toStrictEqual({
      start: 0,
      end: 1,
    });

    expect(getIndexRangeWithOffsets(offsets, 101, 200)).toStrictEqual({
      start: 3,
      end: 7,
    });

    expect(getIndexRangeWithOffsets(offsets, 0, 90)).toStrictEqual({
      start: 0,
      end: 2,
    });

    expect(getIndexRangeWithOffsets(offsets, 60, 120)).toStrictEqual({
      start: 2,
      end: 3,
    });
  });

  test('should get correct index range for invalid input', () => {
    const offsets = [0, 30, 60, 90, 120, 150, 160, 170, 190];

    expect(getIndexRangeWithOffsets(offsets, 0, -10)).toStrictEqual({
      start: 0,
      end: 0,
    });
  });

  test('should get correct index range with equal min and max height', () => {
    const offsets = [0, 30, 60, 90, 120, 150, 160, 170, 190];

    expect(getIndexRangeWithOffsets(offsets, 60, 60)).toStrictEqual({
      start: 2,
      end: 2,
    });
  });

  test('should get correct result for adjustedRowScrollX', () => {
    const bbox = {
      originalWidth: 200,
      width: 100,
    };

    expect(getAdjustedRowScrollX(-10, bbox)).toBe(0);
    expect(getAdjustedRowScrollX(120, bbox)).toBe(100);
    expect(getAdjustedRowScrollX(100, bbox)).toBe(100);
    expect(getAdjustedRowScrollX(99, bbox)).toBe(99);
  });

  test('should get correct result for getAdjustedScrollOffset', () => {
    const content = 1000;
    const container = 500;

    expect(getAdjustedScrollOffset(-10, content, container)).toBe(0);
    expect(getAdjustedScrollOffset(520, content, container)).toBe(500);
    expect(getAdjustedScrollOffset(500, content, container)).toBe(500);
    expect(getAdjustedScrollOffset(499, content, container)).toBe(499);
  });
});
