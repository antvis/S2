import { ELLIPSIS_SYMBOL, EMPTY_FIELD_VALUE } from '@/common';
import {
  drawCustomContent,
  getCellWidth,
  getContentAreaForMultiData,
  getDisplayText,
  getEmptyPlaceholder,
  isUnchangedValue,
  isUpDataValue,
  isZeroOrEmptyValue,
  replaceEmptyFieldValue,
} from '@/utils/text';
import {
  createFakeSpreadSheet,
  createMockCellInfo,
  createPivotSheet,
} from 'tests/util/helpers';
import type { TextTheme } from '../../../src/common';
import { safeJsonParse } from '../../../src/utils/common';

jest.mock('@/utils/g-mini-charts');

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
        {
          transformCanvasConfig() {
            return {
              devicePixelRatio: 2,
            };
          },
        },
        { useSimpleData: true },
      ).measureTextWidth;
    });

    test('should get ellipsis symbol', () => {
      expect(ELLIPSIS_SYMBOL).toEqual('...');
    });

    test('should get correct text width', () => {
      const width = measureTextWidth('test', font);

      expect(Math.floor(width)).toBeGreaterThanOrEqual(16);
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

    const placeholder = getEmptyPlaceholder(meta, { cell: '*' });

    expect(placeholder).toEqual('*');
  });

  test('should get correct emptyPlaceholder when the type of placeholder is function', () => {
    const meta = {
      id: 'root',
      value: 'test',
    };

    const placeholder = getEmptyPlaceholder(meta, {
      cell: (meta) => meta['value'],
    });

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

  test('should get cell width', () => {
    expect(getCellWidth({ width: 30 })).toEqual(30);
    expect(getCellWidth({ width: 30 }, 2)).toEqual(60);
  });

  test('should safe parse json', () => {
    const value = {
      a: [1],
    };

    expect(safeJsonParse('')).toEqual(null);
    expect(safeJsonParse(JSON.stringify(value))).toEqual(value);
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

  test('should draw custom content', () => {
    const renderTextShape = jest.fn();
    const s2 = createFakeSpreadSheet({
      style: {
        cellCfg: {},
      },
    });
    const cell = createMockCellInfo('test').mockCell;

    cell.updateTextPosition = () => {};
    cell.getActualTextWidth = () => 0;
    cell.getBBoxByType = () => ({
      width: 200,
      height: 200,
    });
    cell.getMeta = () => ({
      spreadsheet: s2,
    });
    cell.getStyle = () => ({});
    cell.renderTextShape = renderTextShape;

    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {});

    function render() {
      drawCustomContent(cell, { values: ['test'] });
    }

    expect(render).not.toThrow();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(renderTextShape).toHaveBeenCalledTimes(4);
  });

  test('should draw custom mini chart', () => {
    const s2 = createFakeSpreadSheet({
      style: {
        cellCfg: {},
      },
    });
    const cell = createMockCellInfo('test').mockCell;

    cell.getBBoxByType = () => ({
      width: 200,
      height: 200,
    });
    cell.getMeta = () => ({
      spreadsheet: s2,
    });
    cell.getStyle = () => ({});

    function render() {
      drawCustomContent(cell, { values: { data: 'test' } });
    }

    expect(render).not.toThrow();
  });
});

describe('getDisplayText', () => {
  test.each`
    value        | result
    ${'value'}   | ${'value'}
    ${null}      | ${'-'}
    ${undefined} | ${'-'}
    ${0}         | ${0}
    ${1}         | ${1}
    ${-1}        | ${-1}
    ${Infinity}  | ${Infinity}
    ${NaN}       | ${'-'}
  `('should get correct display text for $value', ({ value, result }) => {
    expect(getDisplayText(value)).toEqual(result);
  });

  test.each`
    value        | result
    ${'value'}   | ${'value'}
    ${null}      | ${'@'}
    ${undefined} | ${'@'}
    ${0}         | ${0}
    ${1}         | ${1}
    ${-1}        | ${-1}
    ${Infinity}  | ${Infinity}
    ${NaN}       | ${'@'}
  `('should get correct empty placeholder for $value', ({ value, result }) => {
    expect(getDisplayText(value, '@')).toEqual(result);
  });
});

describe('replaceEmptyFieldValue', () => {
  test.each`
    value                | result
    ${'value'}           | ${'value'}
    ${EMPTY_FIELD_VALUE} | ${'-'}
    ${undefined}         | ${undefined}
    ${0}                 | ${0}
    ${NaN}               | ${NaN}
  `(
    'should get correct empty field display value for $value',
    ({ value, result }) => {
      expect(replaceEmptyFieldValue(value)).toEqual(result);
    },
  );
});
