import { clone } from 'lodash';
import { getPalette } from '@/utils';
import { generatePalette } from '@/utils/color';
import { Palette } from '@/common';

const expectThemeColor = '#F1535F';
const expectThemeBgColor = '#F5848E';
const expectThemePalette = [
  '#FFFFFF',
  '#FEF6F6',
  '#FCE2E4',
  '#F1535F',
  '#CF444F',
  '#CF444F',
  '#FF0112',
  '#ED505C',
  '#FFFFFF',
  '#FDE5E7',
  '#F26C77',
  '#F26C77',
  '#F1535F',
  '#000000',
  '#000000',
];

describe('color test', () => {
  test('should generate palette', () => {
    const colorfulPalette = getPalette('colorful');
    const palette = generatePalette(colorfulPalette, expectThemeColor);

    expect(palette.basicColors).toEqual(expectThemePalette);
  });

  test('should skip fixed color', () => {
    const colorfulPalette = clone(getPalette('colorful'));

    colorfulPalette.fontColorBgIndexRelations = {};
    colorfulPalette.fixedColorIndex = [];
    for (let index = 0; index < colorfulPalette.basicColors.length; index++) {
      colorfulPalette.fixedColorIndex.push(index);
    }

    const palette = generatePalette(colorfulPalette, expectThemeColor);
    expect(palette.basicColors).toEqual(colorfulPalette.basicColors);
  });

  test('should skip equal hsl value', () => {
    const testPalette: Palette = {
      basicColors: [expectThemeColor, expectThemeColor],
      brandColorIndex: 0,
      fixedColorIndex: [0],
      semanticColors: {},
    };

    const palette = generatePalette(testPalette, expectThemeColor);
    expect(palette.basicColors).toEqual(testPalette.basicColors);
  });

  test('should adapt font color', () => {
    const testPalette: Palette = {
      // [brand color, bg color, text color]
      basicColors: [expectThemeColor, expectThemeBgColor, '#FFFFFF'],
      brandColorIndex: 0,
      fixedColorIndex: [0],
      fontColorBgIndexRelations: {
        2: 1,
      },
      semanticColors: {},
    };

    const whiteTextPalette = generatePalette(testPalette, '#FFFFFF');
    expect(whiteTextPalette.basicColors[2]).toEqual('#000000');

    const blackTextPalette = generatePalette(testPalette, '#000000');
    expect(blackTextPalette.basicColors[2]).toEqual('#FFFFFF');
  });
});
