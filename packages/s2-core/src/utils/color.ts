import tinycolor from 'tinyColor2';
import { includes, map } from 'lodash';
import { Palette } from '@/common';

export const generatePalette = (palette: Palette, brandColor: string) => {
  const { basicColors, ...restParams } = palette;
  const preBrandColor = tinycolor(
    basicColors[restParams?.brandColorIndex],
  ).toRgb();
  const newBrandColor = tinycolor(brandColor).toRgb();
  const distance = {
    r: newBrandColor.r - preBrandColor.r,
    g: newBrandColor.g - preBrandColor.g,
    b: newBrandColor.b - preBrandColor.b,
  };
  const newColors = map(basicColors, (color: string, key) => {
    if (includes(restParams?.fixedColorIndex, key)) {
      return color;
    }
    const preColor = tinycolor(color).toRgb();
    const newColor = tinycolor({
      r: preColor.r + distance.r,
      g: preColor.g + distance.g,
      b: preColor.b + distance.b,
    });
    return `#${newColor.toHex().toUpperCase()}`;
  });
  return {
    basicColors: newColors,
    ...restParams,
  };
};
