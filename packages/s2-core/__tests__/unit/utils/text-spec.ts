import {
  getEllipsisText,
  getEllipsisTextInner,
  isUpDataValue,
  measureTextWidth,
  drawObjectText,
  getCellWidth,
} from '@/utils/text';

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

    expect(text).toEqual('12...');
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
      maxWidth: 20,
    });

    expect(text).toEqual('长...');
  });

  test('should get correct text width', () => {
    const width = measureTextWidth('test', font);
    expect(width).toBeCloseTo(21.24);
  });

  test('should get correct text width roughly', () => {
    const width = measureTextWidth('test', font);
    expect(width).toBeCloseTo(21.24);
  });

  test('should get correct ellipsis text inner', () => {
    const text = getEllipsisTextInner('test', 20, font);
    expect(text).toEqual('t...');
  });

  test('should get correct data status', () => {
    const isUpNumber = isUpDataValue(0);
    const isUpString = isUpDataValue('-10');
    expect(isUpNumber).toEqual(true);
    expect(isUpString).toEqual(false);
  });

  test('should get correct cell width', () => {
    const singleCellCfg = {
      width: 90,
    };
    const multiCellCfg = {
      width: 90,
      valuesCfg: {
        fieldLabels: [['指标', '同比']],
      },
    };
    const singleWidth = getCellWidth(singleCellCfg);
    const multiWidth = getCellWidth(multiCellCfg);
    expect(singleWidth).toEqual(90);
    expect(multiWidth).toEqual(180);
  });
});
