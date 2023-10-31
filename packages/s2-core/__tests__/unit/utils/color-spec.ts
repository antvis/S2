import { getPalette, shouldReverseFontColor } from '@/utils';
import { generatePalette, generateStandardColors } from '@/utils/color';

const expectThemeColor = '#F1535F';
const expectThemePalette = [
  '#FFFFFF',
  '#FEF6F7',
  '#FDE5E7',
  '#F1535F',
  '#CD4751',
  '#CD4751',
  '#CD4751',
  '#F1535F',
  '#FFFFFF',
  '#FDE5E7',
  '#F36D77',
  '#F36D77',
  '#F1535F',
  '#000000',
  '#000000',
];

describe('Theme Color Tests', () => {
  test('should generate palette', () => {
    const colorfulPalette = getPalette('colorful');
    const palette = generatePalette({
      ...colorfulPalette,
      brandColor: expectThemeColor,
    });

    expect(palette.basicColors).toEqual(expectThemePalette);
  });

  test('should adapt font color', () => {
    const testPalette = getPalette('colorful');

    const whiteTextPalette = generatePalette({
      ...testPalette,
      brandColor: '#FFFFFF',
    });

    expect(whiteTextPalette.basicColors[0]).toEqual('#000000');

    const blackTextPalette = generatePalette({
      ...testPalette,
      brandColor: '#000000',
    });

    expect(blackTextPalette.basicColors[0]).toEqual('#FFFFFF');
  });

  test('should not throw error when receive empty palette meta', () => {
    function renderEmptyPalette() {
      generatePalette();
    }

    expect(renderEmptyPalette).not.toThrow();
  });

  test('should not throw error when receive empty brand color', () => {
    function renderStandardColors() {
      generateStandardColors(undefined as unknown as string);
    }

    expect(renderStandardColors).not.toThrow();
  });

  test('should get standard color if brand color is empty', () => {
    const colors = [
      '#F2F2F2',
      '#D9D9D9',
      '#BFBFBF',
      '#4D4D4D',
      '#262626',
      '',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
    ];

    expect(generateStandardColors(undefined as unknown as string)).toEqual(
      colors,
    );
    expect(generateStandardColors('')).toEqual(colors);
  });

  // 主要测试一些主题色和亮度中间区域的颜色，保证修改后自带主题色不受影响
  test('should use reverse font color when background colors are these', () => {
    const backgroundColors = [
      '#4174f0',
      '#999999',
      '#7F7F7F',
      '#404040',
      '#000000',
    ];

    backgroundColors.forEach((color) => {
      expect(shouldReverseFontColor(color)).toBeTruthy();
    });
  });

  test('should use default font color when background colors are these', () => {
    const backgroundColors = [
      '#c4e0fa',
      '#f2f2f2',
      '#ffffff',
      '#C0C0C0',
      '#e1e9fb',
      '#f0f2f4',
    ];

    backgroundColors.forEach((color) => {
      expect(shouldReverseFontColor(color)).toBeFalsy();
    });
  });
});
