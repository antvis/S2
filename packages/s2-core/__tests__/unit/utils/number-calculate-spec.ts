import { isNotNumber, getDataSumByField } from '@/utils/number-calculate';

describe('Number Calculate Test', () => {
  describe('isNotNumber', () => {
    test('should return correct result', () => {
      expect(isNotNumber('123')).toBe(false);
      expect(isNotNumber(123)).toBe(false);
      expect(isNotNumber('1e7')).toBe(false);
      expect(isNotNumber(1e7)).toBe(false);
      expect(isNotNumber(null)).toBe(false);
      expect(isNotNumber(undefined)).toBe(true);
      expect(isNotNumber('-')).toBe(true);
      expect(isNotNumber(NaN)).toBe(true);
    });
  });

  describe('getDataSumByField', () => {
    test('should return correct sum of data list by field', () => {
      expect(getDataSumByField([], 'price')).toEqual(0);
      const data = [
        { price: 1 },
        { price: '1' },
        { price: '1e7' },
        { price: '' },
        { price: null },
        { price: '-' },
        { type: '笔' },
      ];
      expect(getDataSumByField(data, 'price')).toEqual(10000002);
    });
  });
});
