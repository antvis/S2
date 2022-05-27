import { vennArr } from '@/utils/veen-arr';

describe('veen-arr test', () => {
  test('should return intersection range', () => {
    expect(vennArr([1, 4], [3, 5])).toEqual([3, 4]);
  });

  test('should return empty array when given arrs have no overlap', () => {
    expect(vennArr([1, 4], [5, 10])).toEqual([]);
  });
});
