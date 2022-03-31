import { entries, forEach, has, includes, map } from 'lodash';
import { Palette } from '@/common';

const tinycolor = require('tinycolor2');

/**
 * 亮度范围 0~255
 * @see https://github.com/bgrins/TinyColor#getbrightness
 */
const FONT_COLOR_BRIGHTNESS_THRESHOLD = 220;

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
    const newColor = tinycolor({
      h: Math.min((preColor.h * newBrandColor.h) / preBrandColor.h, 360),
      s: Math.min((preColor.s * newBrandColor.s) / preBrandColor.s, 1),
      l: Math.min((preColor.l * newBrandColor.l) / preBrandColor.l, 1),
    });

    return `#${newColor.toHex().toUpperCase()}`;
  });

  forEach(
    entries(restParams?.fontColorBgIndexRelations),
    ([fontColorIdx, bgColorIndx]) => {
      // 根据背景明暗设置字体颜色
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
