import { Palette, themeName } from '../common/interface/theme';
import { PALETTE_MAP } from '../common/constant';

/**
 * 获取当前的主题色板
 * @param type 主题名
 * @param hueInvert 是否为颜色转至模式，默认为 false
 */
export const getPalette = (type?: themeName, hueInvert?: boolean): Palette => {
  const themeName = type || 'default';
  const platte = PALETTE_MAP[themeName.toLowerCase()];
  if (hueInvert) {
    platte.brandColors.reverse();
    platte.grayColors.reverse();
  }
  return platte;
};
