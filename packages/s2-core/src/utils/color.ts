import { entries, forEach, fromPairs, has, includes, map } from 'lodash';
import { Palette } from '@/common';

const tinycolor = require('tinycolor2');

/**
 * 亮度范围 0~255
 * @see https://github.com/bgrins/TinyColor#getbrightness
 */
const FONT_COLOR_BRIGHTNESS_THRESHOLD = 220;

/** HSL 色彩空间 meta 信息 */
const HSL_META = [
  {
    /** 色相，范围 0~360 */
    name: 'h',
    max: 360,
  },
  {
    /** 饱和度，范围 0~1 */
    name: 's',
    max: 1,
  },
  {
    /** 亮度，范围 0~1 */
    name: 'l',
    max: 1,
  },
];

/**
 * 根据主题色生成色板
 * @param palette 参考色板
 * @param brandColor 主题色值（hex）
 * @returns 新色板
 */
export const generatePalette = (palette: Palette, brandColor: string) => {
  const { basicColors, ...restParams } = palette;
  const preBrandColor = tinycolor(
    basicColors[restParams?.brandColorIndex],
  ).toHsl();
  const newBrandColor = tinycolor(brandColor).toHsl();

  const newColors = map(basicColors, (color: string, key) => {
    if (
      includes(restParams?.fixedColorIndex, key) ||
      has(restParams.fontColorBgIndexRelations, key)
    ) {
      // 固定色和字体不变更颜色
      return color;
    }

    const preColor = tinycolor(color).toHsl();

    /**
     * 在 HSL 颜色空间下，分别计算新颜色下的各个分量
     */
    const newColorPairs = HSL_META.map(
      ({ name: propertyName, max: maxValue }) => {
        const oldColorValue = preColor[propertyName];
        const oldBrandColorValue = preBrandColor[propertyName];
        const newBrandColorValue = newBrandColor[propertyName];

        // 原颜色与原主题色的单个分量差值
        const oldValueDiff = oldColorValue - oldBrandColorValue;

        if (oldValueDiff === 0) {
          return [propertyName, newBrandColorValue];
        }

        // 计算差值与区间的变化百分比
        const percentage =
          oldValueDiff /
          (oldValueDiff > 0
            ? maxValue - oldBrandColorValue
            : oldBrandColorValue);

        // 将变化百分比作用到新主题色的可变区间内
        const newColorValue =
          newBrandColorValue +
          (oldValueDiff > 0
            ? maxValue - newBrandColorValue
            : newBrandColorValue) *
            percentage;

        return [propertyName, newColorValue];
      },
    );

    const newColor = tinycolor(fromPairs(newColorPairs));

    return `#${newColor.toHex().toUpperCase()}`;
  });

  // 根据背景明暗设置字体颜色
  forEach(
    entries(restParams?.fontColorBgIndexRelations),
    ([fontColorIdx, bgColorIndx]) => {
      newColors[Number(fontColorIdx)] =
        tinycolor(newColors[bgColorIndx]).getBrightness() >
        FONT_COLOR_BRIGHTNESS_THRESHOLD
          ? '#000000'
          : '#FFFFFF';
    },
  );

  return {
    basicColors: newColors,
    ...restParams,
  };
};
