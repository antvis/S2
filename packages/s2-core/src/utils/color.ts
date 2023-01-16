import { toUpper } from 'lodash';
import tinycolor from 'tinycolor2';
import type { Palette, PaletteMeta } from '../common/interface/theme';
import {
  DEFAULT_FONT_COLOR,
  REVERSE_FONT_COLOR,
} from '../common/constant/condition';

const WHITE_COLOR = '#FFFFFF';
const BLACK_COLOR = '#000000';

/** S2 标准色板 mix 规则 */
const STANDARD_COLOR_MIX_PERCENT = [95, 85, 75, 30, 15, 0, 15, 30, 45, 60, 80];

/**
 * basic color 数量
 * @see Palette.basicColors
 */
const BASIC_COLOR_COUNT = 15;

/**
 * 智能反色使用
 * @param color
 */
export const shouldReverseFontColor = (color: string) =>
  tinycolor(color).getLuminance() <= 0.5;

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
export const generateStandardColors = (brandColor: string): string[] => {
  const standardColors: string[] = [];

  for (let index = 0; index < 11; index++) {
    const mixPercent = STANDARD_COLOR_MIX_PERCENT[index];

    standardColors.push(
      mixPercent === 0
        ? toUpper(brandColor)
        : toUpper(
            tinycolor
              .mix(
                brandColor,
                index < 5 ? WHITE_COLOR : BLACK_COLOR,
                mixPercent,
              )
              .toHexString(),
          ),
    );
  }

  return standardColors;
};

/**
 * 根据 S2 内置色板及自选主题色生成新色板
 * @param paletteMeta @PaletteMeta
 * @returns 新色板
 */
export const generatePalette = (
  paletteMeta: PaletteMeta = {} as PaletteMeta,
): Palette => {
  const basicColors = Array.from(Array(BASIC_COLOR_COUNT)).fill(
    REVERSE_FONT_COLOR,
  );
  const { basicColorRelations = [], brandColor } = paletteMeta;
  const standardColors = generateStandardColors(brandColor);

  // 使用标准色填充 basicColors
  basicColorRelations.forEach((relation) => {
    basicColors[relation.basicColorIndex] =
      standardColors[relation.standardColorIndex];
  });

  // 根据背景明暗设置字体颜色
  FONT_COLOR_RELATIONS.forEach(({ fontColorIndex, bgColorIndex }) => {
    basicColors[fontColorIndex] = shouldReverseFontColor(
      basicColors[bgColorIndex],
    )
      ? REVERSE_FONT_COLOR
      : DEFAULT_FONT_COLOR;
  });

  return {
    ...paletteMeta,
    basicColors,
  } as Palette;
};
