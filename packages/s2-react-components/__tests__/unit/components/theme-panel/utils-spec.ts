import { SheetThemeColorType, SheetThemeType } from '@/common';
import { generateColorTheme } from '@/components/theme-panel/utils';

describe('generateColorTheme test', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should generate default color theme', () => {
    expect(
      generateColorTheme({
        themeType: SheetThemeType.DEFAULT,
        colorType: SheetThemeColorType.PRIMARY,
      }),
    ).toMatchSnapshot();
  });

  test('should generate colorful color theme', () => {
    expect(
      generateColorTheme({
        themeType: SheetThemeType.COLORFUL,
        colorType: SheetThemeColorType.PRIMARY,
      }),
    ).toMatchSnapshot();
  });

  test('should generate normal color theme', () => {
    expect(
      generateColorTheme({
        themeType: SheetThemeType.NORMAL,
        colorType: SheetThemeColorType.PRIMARY,
      }),
    ).toMatchSnapshot();
  });

  test('should generate basic color theme', () => {
    expect(
      generateColorTheme({
        themeType: SheetThemeType.BASIC,
        colorType: SheetThemeColorType.PRIMARY,
      }),
    ).toMatchSnapshot();
  });

  test('should generate zebra color theme', () => {
    expect(
      generateColorTheme({
        themeType: SheetThemeType.ZEBRA,
        colorType: SheetThemeColorType.PRIMARY,
      }),
    ).toMatchSnapshot();
  });

  test('should generate secondary color theme', () => {
    expect(
      generateColorTheme({
        themeType: SheetThemeType.COLORFUL,
        colorType: SheetThemeColorType.SECONDARY,
      }),
    ).toMatchSnapshot();
  });

  test('should generate custom color theme', () => {
    expect(
      generateColorTheme({
        themeType: SheetThemeType.COLORFUL,
        colorType: SheetThemeColorType.CUSTOM,
        customColor: '#396',
      }),
    ).toMatchSnapshot();
  });
});
