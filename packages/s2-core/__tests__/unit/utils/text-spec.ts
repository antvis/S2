import { createPivotSheet } from 'tests/util/helpers';
import {
  getEllipsisText,
  getEllipsisTextInner,
  isUpDataValue,
  getCellWidth,
  getEmptyPlaceholder,
  getContentAreaForMultiData,
} from '@/utils/text';

const isHD = window.devicePixelRatio >= 2;

describe('Text Utils Tests', () => {
  const font = {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'normal',
  } as unknown as CSSStyleDeclaration;

  describe('Test Widths Tests', () => {
    let measureTextWidth: (text: number | string, font: unknown) => number;

    beforeEach(() => {
      measureTextWidth = createPivotSheet(
        {},
        { useSimpleData: true },
      ).measureTextWidth;
    });

    test('should get correct text', () => {
      const text = getEllipsisText({
        measureTextWidth,
        text: '12',
        maxWidth: 200,
        placeholder: '--',
      });

      expect(text).toEqual('12');
    });

    test('should get correct text ellipsis', () => {
      const text = getEllipsisText({
        measureTextWidth,
        text: '12121212121212121212',
        maxWidth: 20,
        placeholder: '--',
      });

      expect(text).toEndWith('...');
      expect(text.length).toBeLessThanOrEqual(5);
    });

    test('should get correct placeholder text with ""', () => {
      const text = getEllipsisText({
        measureTextWidth,
        text: '',
        maxWidth: 20,
        placeholder: '--',
      });
      expect(text).toEqual('--');
    });

    test('should get correct placeholder text with 0', () => {
      const text = getEllipsisText({
        measureTextWidth,
        text: 0 as unknown as string,
        maxWidth: 20,
        placeholder: '--',
      });

      expect(text).toEqual('0');
    });

    test('should get correct placeholder text with null', () => {
      const text = getEllipsisText({
        measureTextWidth,
        text: null,
        maxWidth: 20,
        placeholder: '--',
      });

      expect(text).toEqual('--');
    });

    test('should get correct ellipsis text', () => {
      const text = getEllipsisText({
        measureTextWidth,
        text: '长度测试',
        maxWidth: 24,
      });

      expect(text).toEndWith('...');
      expect(text.length).toBeLessThanOrEqual(4);
    });

    test('should get correct text width', () => {
      const width = measureTextWidth('test', font);
      expect(Math.floor(width)).toEqual(isHD ? 21 : 16);
    });

    test('should get correct ellipsis text inner', () => {
      const text = getEllipsisTextInner(measureTextWidth, 'test', 15, font);
      expect(text).toEqual('t...');
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
    const cellCfg = {
      width: 90,
    };

    const width = getCellWidth(cellCfg);

    expect(width).toEqual(90);
  });

  test('should get correct emptyPlaceholder when the type of placeholder is string', () => {
    const meta = {
      id: 'root',
      value: '',
      key: '',
    };

    const placeholder = getEmptyPlaceholder(meta, '*');

    expect(placeholder).toEqual('*');
  });

  test('should get correct emptyPlaceholder when the type of placeholder is function', () => {
    const meta = {
      id: 'root',
      value: 'test',
    };

    const placeholder = getEmptyPlaceholder(meta, (meta) => {
      return meta.value;
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
});
