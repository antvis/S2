import { CellData } from '@/data-set/cell-data';
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
      expect(isNotNumber('2022-10-28')).toBe(true);
      expect(isNotNumber('1\n2\n3')).toBe(true);
      expect(isNotNumber(NaN)).toBe(true);
      expect(isNotNumber('')).toBe(true);
      expect(isNotNumber(Object.create(null))).toBe(true);
      expect(isNotNumber([])).toBe(true);
      expect(isNotNumber(() => {})).toBe(true);
    });
  });

  describe('getDataSumByField', () => {
    test('should return correct sum of data list by field', () => {
      expect(getDataSumByField([], 'price')).toEqual(0);
      const data = [
        new CellData({ price: 1 }, 'price'),
        new CellData({ price: '1' }, 'price'),
        new CellData({ price: '1e7' }, 'price'),
        new CellData({ price: '' }, 'price'),
        new CellData({ price: null }, 'price'),
        new CellData({ price: '-' }, 'price'),
        new CellData({ type: '笔' }, 'price'),
      ];

      expect(getDataSumByField(data, 'price')).toEqual(10000002);
      expect(
        getDataSumByField(
          [
            new CellData(
              {
                price: 0.1,
              },
              'price',
            ),
            new CellData(
              {
                price: 0.2,
              },
              'price',
            ),
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
          [
            new CellData({ price: null }, 'price'),
            new CellData({ price: '' }, 'price'),
          ],
          'price',
        ),
      ).toBeUndefined();
      const data = [
        new CellData({ price: 1 }, 'price'),
        new CellData({ price: '1' }, 'price'),
        new CellData({ price: '' }, 'price'),
        new CellData({ price: null }, 'price'),
        new CellData({ price: '-' }, 'price'),
        new CellData({ type: 'antv' }, 'price'),
        new CellData({ price: '0.001' }, 'price'),
      ];

      expect(getDataExtremumByField('min', data, 'price')).toEqual(0.001);
    });

    test('should return correct max of data list by field', () => {
      expect(getDataExtremumByField('max', [], 'price')).toBeUndefined();
      expect(
        getDataExtremumByField(
          'max',
          [
            new CellData({ price: null }, 'price'),
            new CellData({ price: '' }, 'price'),
          ],
          'price',
        ),
      ).toBeUndefined();
      const data = [
        new CellData({ price: -1 }, 'price'),
        new CellData({ price: '-2' }, 'price'),
        new CellData({ price: '' }, 'price'),
        new CellData({ price: null }, 'price'),
        new CellData({ price: '-' }, 'price'),
        new CellData({ type: 'antv' }, 'price'),
        new CellData({ price: '-0.001' }, 'price'),
      ];

      expect(getDataExtremumByField('max', data, 'price')).toEqual(-0.001);
    });
  });

  describe('getDataAvgByField', () => {
    test('should return correct avg of data list by field', () => {
      expect(getDataAvgByField([], 'price')).toEqual(0);
      const data = [
        new CellData({ price: 3.5 }, 'price'),
        new CellData({ price: '2.5' }, 'price'),
        new CellData({ price: -3 }, 'price'),
        new CellData({ price: 30e2 }, 'price'),
        new CellData({ price: '' }, 'price'),
        new CellData({ price: null }, 'price'),
        new CellData({ price: '-' }, 'price'),
        new CellData({ type: '笔' }, 'price'),
      ];

      expect(getDataAvgByField(data, 'price')).toEqual(375.375);
    });
  });
});
