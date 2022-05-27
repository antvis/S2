import { getPalette } from '@/utils';
import { generatePalette } from '@/utils/color';

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

describe('color test', () => {
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
});
