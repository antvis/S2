import {
  getEllipsisText,
  getEllipsisTextInner,
  isUpDataValue,
  measureTextWidth,
  getCellWidth,
  getEmptyPlaceholder,
} from '@/utils/text';

const isHD = window.devicePixelRatio >= 2;

describe('Text Utils Tests', () => {
  const font = {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'normal',
  } as unknown as CSSStyleDeclaration;

  test('should get correct text', () => {
    const text = getEllipsisText({
      text: '12',
      maxWidth: 200,
      placeholder: '--',
    });

    expect(text).toEqual('12');
  });

  test('should get correct text ellipsis', () => {
    const text = getEllipsisText({
      text: '12121212121212121212',
      maxWidth: 20,
      placeholder: '--',
    });

    expect(text).toEndWith('...');
    expect(text.length).toBeLessThanOrEqual(5);
  });

  test('should get correct placeholder text with ""', () => {
    const text = getEllipsisText({
      text: '',
      maxWidth: 20,
      placeholder: '--',
    });
    expect(text).toEqual('--');
  });

  test('should get correct placeholder text with 0', () => {
    const text = getEllipsisText({
      text: 0 as unknown as string,
      maxWidth: 20,
      placeholder: '--',
    });

    expect(text).toEqual('0');
  });

  test('should get correct placeholder text with null', () => {
    const text = getEllipsisText({
      text: null,
      maxWidth: 20,
      placeholder: '--',
    });

    expect(text).toEqual('--');
  });

  test('should get correct ellipsis text', () => {
    const text = getEllipsisText({
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
    const text = getEllipsisTextInner('test', 15, font);
    expect(text).toEqual('t...');
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
});
