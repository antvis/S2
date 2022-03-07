import {
  isNotNumber,
  getDataSumByField,
  getDataExtremumByField,
  getDataAvgByField,
} from '@/utils/number-calculate';

describe('Number Calculate Test', () => {
  describe('isNotNumber', () => {
    test('should return correct result', () => {
      /** false */
      expect(isNotNumber('123')).toBe(false);
      expect(isNotNumber(123)).toBe(false);
      expect(isNotNumber('1e7')).toBe(false);
      expect(isNotNumber(1e7)).toBe(false);

      /** true */
      expect(isNotNumber(null)).toBe(true);
      expect(isNotNumber(undefined)).toBe(true);
      expect(isNotNumber('-')).toBe(true);
      expect(isNotNumber(NaN)).toBe(true);
      expect(isNotNumber('')).toBe(true);
      expect(isNotNumber(Object.create(null))).toBe(true);
      expect(isNotNumber([])).toBe(true);
      expect(isNotNumber(function foo() {})).toBe(true);
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
      expect(
        getDataSumByField(
          [
            {
              price: 0.1,
            },
            {
              price: 0.2,
            },
          ],
          'price',
        ),
      ).toEqual(0.3);
    });
  });

  describe('getDataExtremumByField', () => {
    test('should return correct min of data list by field', () => {
      expect(getDataExtremumByField('min', [], 'price')).toBeUndefined();
      expect(
        getDataExtremumByField(
          'min',
          [{ price: null }, { price: '' }],
          'price',
        ),
      ).toBeUndefined();
      const data = [
        { price: 1 },
        { price: '1' },
        { price: '' },
        { price: null },
        { price: '-' },
        { type: 'antv' },
        { price: '0.001' },
      ];
      expect(getDataExtremumByField('min', data, 'price')).toEqual(0.001);
    });

    test('should return correct max of data list by field', () => {
      expect(getDataExtremumByField('max', [], 'price')).toBeUndefined();
      expect(
        getDataExtremumByField(
          'max',
          [{ price: null }, { price: '' }],
          'price',
        ),
      ).toBeUndefined();
      const data = [
        { price: -1 },
        { price: '-2' },
        { price: '' },
        { price: null },
        { price: '-' },
        { type: 'antv' },
        { price: '-0.001' },
      ];
      expect(getDataExtremumByField('max', data, 'price')).toEqual(-0.001);
    });
  });

  describe('getDataAvgByField', () => {
    test('should return correct avg of data list by field', () => {
      expect(getDataAvgByField([], 'price')).toEqual(0);
      const data = [
        { price: 3.5 },
        { price: '2.5' },
        { price: -3 },
        { price: 30e2 },
        { price: '' },
        { price: null },
        { price: '-' },
        { type: '笔' },
      ];
      expect(getDataAvgByField(data, 'price')).toEqual(375.375);
    });
  });
});
