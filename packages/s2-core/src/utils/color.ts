import tinycolor from 'tinycolor2';
import { Palette, PaletteMeta } from '@/common/interface/theme';

/**
 * 亮度范围 0~255
 * @see https://github.com/bgrins/TinyColor#getbrightness
 */
const FONT_COLOR_BRIGHTNESS_THRESHOLD = 220;

/** S2 标准色板 mix 规则 */
const STANDRAD_COLOR_MIX_PERCENT = [95, 85, 75, 30, 15, 0, 15, 30, 45, 60, 80];

/**
 * basic color 数量
 * @see Palette.basicColors
 */
const BASIC_COLOR_COUNT = 15;

const FONT_COLOR_RELATIONS: Array<{
  fontColorIndex: number;
  bgColorIndex: number;
}> = [
  {
    fontColorIndex: 0,
    bgColorIndex: 3,
  },
  {
    fontColorIndex: 13,
    bgColorIndex: 8,
  },
  {
    fontColorIndex: 14,
    bgColorIndex: 1,
  },
];

/**
 * 生成 s2 设计规范下的标准色（共 11 个）
 *
 * - 第 1~5 为主题色加白
 * - 第 6 为主题色
 * - 第 7~11 为主题色加黑
 *
 * @param brandColor 主题色
 * @returns 标准色卡
 */
export const generateStandardColors = (brandColor: string) => {
  const standardColors = [];

  for (let index = 0; index < 11; index++) {
    const mixPercent = STANDRAD_COLOR_MIX_PERCENT[index];
    standardColors.push(
      mixPercent === 0
        ? brandColor.toUpperCase()
        : tinycolor
            .mix(brandColor, index < 5 ? '#FFFFFF' : '#000000', mixPercent)
            .toHexString()
            .toUpperCase(),
    );
  }

  return standardColors;
};

/**
 * 根据 S2 内置色板及自选主题色生成新色板
 * @param palette 参考色板
 * @returns 新色板
 */
export const generatePalette = (paletteMeta: PaletteMeta) => {
  const basicColors = Array.from(Array(BASIC_COLOR_COUNT)).fill('#FFFFFF');
  const { basicColorRelations } = paletteMeta;
  const standardColors = generateStandardColors(paletteMeta.brandColor);

  // 使用标准色填充 basicColors
  basicColorRelations.forEach((relation) => {
    basicColors[relation.basicColorIndex] =
      standardColors[relation.standardColorIndex];
  });

  // 根据背景明暗设置字体颜色
  FONT_COLOR_RELATIONS.forEach(({ fontColorIndex, bgColorIndex }) => {
    basicColors[fontColorIndex] =
      tinycolor(basicColors[bgColorIndex]).getBrightness() >
      FONT_COLOR_BRIGHTNESS_THRESHOLD
        ? '#000000'
        : '#FFFFFF';
  });

  return {
    ...paletteMeta,
    basicColors,
  } as Palette;
};
