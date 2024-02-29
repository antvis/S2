import { createPivotSheet } from 'tests/util/helpers';
import type { TextTheme } from '../../../src/common';
import { ELLIPSIS_SYMBOL } from '@/common';
import {
  isUpDataValue,
  getCellWidth,
  getEmptyPlaceholder,
  getContentAreaForMultiData,
  isZeroOrEmptyValue,
  isUnchangedValue,
} from '@/utils/text';

const isHD = window.devicePixelRatio >= 2;

describe('Text Utils Tests', () => {
  const font: TextTheme = {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'normal',
  };

  describe('Test Widths Tests', () => {
    let measureTextWidth: (text: number | string, font: unknown) => number;

    beforeEach(() => {
      measureTextWidth = createPivotSheet(
        {},
        { useSimpleData: true },
      ).measureTextWidth;
    });

    test('should get ellipsis symbol', () => {
      expect(ELLIPSIS_SYMBOL).toEqual('...');
    });

    test('should get correct text width', () => {
      const width = measureTextWidth('test', font);

      expect(Math.floor(width)).toEqual(isHD ? 21 : 16);
    });
  });

  test.each`
    value     | expected
    ${0}      | ${true}
    ${1.1}    | ${true}
    ${0.1}    | ${true}
    ${-0.1}   | ${false}
    ${-1}     | ${false}
    ${null}   | ${false}
    ${'-10'}  | ${false}
    ${''}     | ${false}
    ${' -10'} | ${false}
    ${'-10 '} | ${false}
    ${' 10'}  | ${true}
    ${'10 '}  | ${true}
    ${' 10 '} | ${true}
  `(
    'should get correct data status when value=$value',
    ({ value, expected }) => {
      expect(isUpDataValue(value)).toEqual(expected);
    },
  );

  test('should get correct cell width', () => {
    const dataCell = {
      width: 90,
    };

    const width = getCellWidth(dataCell);

    expect(width).toEqual(90);
  });

  test('should get correct emptyPlaceholder when the type of placeholder is string', () => {
    const meta = {
      id: 'root',
      value: '',
      field: '',
    };

    const placeholder = getEmptyPlaceholder(meta, '*');

    expect(placeholder).toEqual('*');
  });

  test('should get correct emptyPlaceholder when the type of placeholder is function', () => {
    const meta = {
      id: 'root',
      value: 'test',
    };

    const placeholder = getEmptyPlaceholder(meta, (meta) => meta['value']);

    expect(placeholder).toEqual('test');
  });

  test('should get correct content area for multiData without widthPercent', () => {
    const box = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };

    const multiData = [
      [0, 1],
      [20, 30],
    ];

    const boxes = getContentAreaForMultiData(box, multiData);

    expect(boxes).toEqual([
      [
        {
          x: 0,
          y: 0,
          width: 50,
          height: 50,
        },
        {
          x: 50,
          y: 0,
          width: 50,
          height: 50,
        },
      ],
      [
        {
          x: 0,
          y: 50,
          width: 50,
          height: 50,
        },
        {
          x: 50,
          y: 50,
          width: 50,
          height: 50,
        },
      ],
    ]);
  });

  test('should get correct content area for multiData with widthPercent', () => {
    const box = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };

    const multiData = [
      [0, 1, 2],
      [20, 30, 40],
    ];

    const boxes = getContentAreaForMultiData(box, multiData, [40, 0.2, 0.4]);

    expect(boxes).toEqual([
      [
        {
          x: 0,
          y: 0,
          width: 40,
          height: 50,
        },
        {
          x: 40,
          y: 0,
          width: 20,
          height: 50,
        },
        {
          x: 60,
          y: 0,
          width: 40,
          height: 50,
        },
      ],
      [
        {
          x: 0,
          y: 50,
          width: 40,
          height: 50,
        },
        {
          x: 40,
          y: 50,
          width: 20,
          height: 50,
        },
        {
          x: 60,
          y: 50,
          width: 40,
          height: 50,
        },
      ],
    ]);
  });
});

describe('isZeroOrEmptyValue', () => {
  test('should return true for zero values', () => {
    expect(isZeroOrEmptyValue('0.00%')).toBe(true);
    expect(isZeroOrEmptyValue('-0.00%')).toBe(true);
    expect(isZeroOrEmptyValue('0.0万亿')).toBe(true);
    expect(isZeroOrEmptyValue('-0.0万亿')).toBe(true);
    expect(isZeroOrEmptyValue('0.00万')).toBe(true);
    expect(isZeroOrEmptyValue('-0.00万')).toBe(true);
    expect(isZeroOrEmptyValue('0')).toBe(true);
    expect(isZeroOrEmptyValue('-0')).toBe(true);
    expect(isZeroOrEmptyValue(0)).toBe(true);
    expect(isZeroOrEmptyValue(-0)).toBe(true);
  });

  test('should return false for non-zero values', () => {
    expect(isZeroOrEmptyValue('0.5%')).toBe(false);
    expect(isZeroOrEmptyValue('-0.5%')).toBe(false);
    expect(isZeroOrEmptyValue('0.01万亿')).toBe(false);
    expect(isZeroOrEmptyValue('-0.01万亿')).toBe(false);
    expect(isZeroOrEmptyValue('1')).toBe(false);
    expect(isZeroOrEmptyValue('-1')).toBe(false);
    expect(isZeroOrEmptyValue(0.1)).toBe(false);
    expect(isZeroOrEmptyValue(-0.1)).toBe(false);
  });

  test('should return true for non-numeric values', () => {
    expect(isZeroOrEmptyValue('abc')).toBe(true);
    expect(isZeroOrEmptyValue('')).toBe(true);
    expect(isZeroOrEmptyValue(null as any)).toBe(true);
    expect(isZeroOrEmptyValue(undefined as any)).toBe(true);
  });
});

describe('isUnchangedValue', () => {
  test('should return true for zero values', () => {
    expect(isUnchangedValue(0, 123)).toBeTruthy();
    expect(isUnchangedValue('0', 'abc')).toBeTruthy();
  });

  test('should return true for empty values', () => {
    expect(isUnchangedValue('', 'abc')).toBeTruthy();
    expect(isUnchangedValue(null as any, 123)).toBeTruthy();
    expect(isUnchangedValue(undefined as any, 123)).toBeTruthy();
  });

  test('should return true for unchanged values', () => {
    expect(isUnchangedValue('test', 'test')).toBeTruthy();
    expect(isUnchangedValue(123, 123)).toBeTruthy();
  });

  test('should return true for numberless changed values', () => {
    expect(isUnchangedValue('test', 'abc')).toBeTruthy();
  });

  test('should return false for numeric changed values', () => {
    expect(isUnchangedValue(123, 456)).toBeFalsy();
  });

  test('should return true for negative zero', () => {
    expect(isUnchangedValue(-0, 123)).toBeTruthy();
  });

  test('should return false for negative values', () => {
    expect(isUnchangedValue(-123, 123)).toBeFalsy();
  });
});
