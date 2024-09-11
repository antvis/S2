import {
  generatePalette,
  getPalette,
  getTheme,
  type DeepRequired,
  type S2Theme,
  type ThemeCfg,
} from '@antv/s2';
import tinycolor from 'tinycolor2';
import tinygradient from 'tinygradient';
import {
  BASIC_SHEET_THEME_TYPE_COLOR_RELATIONS,
  DEFAULT_THEME_COLOR_LIST,
  SECONDARY_THEME_COLOR_TYPE_RELATIONS,
  SheetThemeColorType,
  SheetThemeType,
} from '../../common';

type ColorThemeGenerateParams = {
  /** 表格主题类型 */
  themeType: SheetThemeType;
  /** 表格颜色类型 */
  colorType: SheetThemeColorType;
  /** 表格自定义颜色值，如 #fff */
  customColor: string;
};

function clearBorderWidth(theme: Record<string, any>) {
  for (const key in theme) {
    if (typeof theme[key] === 'object' && theme[key] !== null) {
      // 如果属性值是对象，递归调用函数
      clearBorderWidth(theme[key]);
    } else if (key.includes('BorderWidth')) {
      // 如果属性名包含是 'BorderWidth'，替换其值
      theme[key] = 0;
    }
  }
}

function getBackgroundColorOpacity(themeColorType: SheetThemeColorType) {
  if (themeColorType === SheetThemeColorType.SECONDARY) {
    return 0.25;
  }

  if (themeColorType === SheetThemeColorType.GRAY) {
    return 0.5;
  }

  return 0.05;
}

/**
 * 生成表格对应的主题 schema
 * @param params 生成主题的参数
 * @returns s2 主题配置
 */
export function generateColorTheme(
  params: ColorThemeGenerateParams,
): ThemeCfg['theme'] {
  const {
    themeType: sheetThemeType,
    colorType: sheetThemeColorType,
    customColor: sheetThemeCustomColor,
  } = params;

  /**
   * 先根据 sheetThemeColorType 确定主题色板
   * - gray: s2 自带灰色
   * - primary: s2 自带 colorful + 主题色派生
   * - custom: s2 自带 colorful + 用户自选色派生
   */
  let themePalette: ThemeCfg['palette'];

  if (sheetThemeColorType === SheetThemeColorType.GRAY) {
    themePalette = getPalette('gray');
  } else {
    let brandColor =
      sheetThemeColorType === SheetThemeColorType.CUSTOM
        ? sheetThemeCustomColor ?? DEFAULT_THEME_COLOR_LIST[0]
        : '#326EF4';

    if (sheetThemeColorType === SheetThemeColorType.SECONDARY) {
      // 浅色主题需要在主题色的基础上, 加上 20% 不透明度
      brandColor = tinygradient([
        { color: brandColor, pos: 0 },
        { color: 'white', pos: 1 },
      ])
        .rgbAt(0.8)
        .toHexString();
    }

    if (sheetThemeType === SheetThemeType.DEFAULT) {
      themePalette = getPalette('default');
    } else if (sheetThemeType === SheetThemeType.BASIC) {
      /**
       * 多彩+basic
       * 需要通过basicColorRelations来特殊定制色板
       */
      themePalette = generatePalette({
        ...getPalette('colorful'),
        brandColor,
        basicColorRelations: BASIC_SHEET_THEME_TYPE_COLOR_RELATIONS,
      });
    } else {
      // 普通多彩色板
      const palette = { ...getPalette('colorful') };

      if (sheetThemeColorType === SheetThemeColorType.SECONDARY) {
        palette.basicColorRelations = SECONDARY_THEME_COLOR_TYPE_RELATIONS;
      }

      themePalette = generatePalette({
        ...palette,
        brandColor,
      });
    }
  }

  /**
   * 根据 sheetThemeType 使用色板填充生成 theme schema
   * - colorful: 使用 s2 默认内置 schema，有斑马纹
   * - normal: colorful 基础上，去掉斑马纹
   * - basic: colorful+gray文字基础上，去掉斑马纹、表头色等等
   */
  const baseTheme = getTheme({
    palette: themePalette,
  }) as DeepRequired<S2Theme>;

  if (sheetThemeType === SheetThemeType.NORMAL) {
    // 处理行头/数据单元格背景色
    const dataCellBgColor = baseTheme.dataCell.cell.backgroundColor;

    baseTheme.dataCell.cell.crossBackgroundColor = dataCellBgColor;
    baseTheme.rowCell.cell.backgroundColor = dataCellBgColor;
  } else if (sheetThemeType === SheetThemeType.BASIC) {
    // 处理行头/数据单元格背景色
    const dataCellBgColor = baseTheme.dataCell.cell.backgroundColor;

    baseTheme.dataCell.cell.crossBackgroundColor = dataCellBgColor;
    baseTheme.cornerCell.cell.backgroundColor = dataCellBgColor;
    baseTheme.rowCell.cell.backgroundColor = dataCellBgColor;
    baseTheme.colCell.cell.backgroundColor = dataCellBgColor;
    // 强化分割线
    baseTheme.splitLine.verticalBorderColorOpacity = 1;
    baseTheme.splitLine.horizontalBorderColorOpacity = 1;
    // 弱化角头/列头border颜色（取表体单元格border颜色）
    const rowBorderColor = baseTheme.rowCell.cell.verticalBorderColor;

    baseTheme.cornerCell.cell.horizontalBorderColor = rowBorderColor;
    baseTheme.cornerCell.cell.verticalBorderColor = rowBorderColor;
    baseTheme.colCell.cell.horizontalBorderColor = rowBorderColor;
    baseTheme.colCell.cell.verticalBorderColor = rowBorderColor;
  } else if (sheetThemeType === SheetThemeType.ZEBRA) {
    clearBorderWidth(baseTheme);
    baseTheme.rowCell.text.fontWeight = `bold`;
    const backgroundColorSettings = {
      crossBackgroundColor: `#FFFFFF`,
      backgroundColor: baseTheme.colCell.cell.backgroundColor,
      backgroundColorOpacity: getBackgroundColorOpacity(sheetThemeColorType),
    };

    baseTheme.dataCell.cell = {
      ...baseTheme.dataCell.cell,
      ...backgroundColorSettings,
    };
    const zebraFontColor = `#1D2129`;

    baseTheme.dataCell.text.fill = zebraFontColor;
    baseTheme.dataCell.bolderText.fill = zebraFontColor;

    baseTheme.rowCell.cell = {
      ...baseTheme.rowCell.cell,
      ...backgroundColorSettings,
    };
    baseTheme.rowCell.text.fill = zebraFontColor;
    baseTheme.rowCell.bolderText.fill = zebraFontColor;
    if (
      sheetThemeColorType === SheetThemeColorType.SECONDARY ||
      sheetThemeColorType === SheetThemeColorType.GRAY
    ) {
      const zebraFontColor80 = tinycolor(zebraFontColor)
        .setAlpha(0.8)
        .toRgbString();

      baseTheme.colCell.text.fill = zebraFontColor80;
      baseTheme.colCell.bolderText.fill = zebraFontColor80;
    }
  }

  return baseTheme;
}
