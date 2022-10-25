import { getPalette } from '@/utils';
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
    expect(renderEmptyPalette).not.toThrowError();
  });

  test('should not throw error when receive empty brand color', () => {
    function renderStandardColors() {
      generateStandardColors(undefined);
    }
    expect(renderStandardColors).not.toThrowError();
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
    expect(generateStandardColors(undefined)).toEqual(colors);
    expect(generateStandardColors('')).toEqual(colors);
  });
});
