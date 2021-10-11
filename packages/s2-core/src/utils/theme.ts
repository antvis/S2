import { Palette, ThemeName } from '../common/interface/theme';
import { PALETTE_MAP } from '../common/constant';

/**
 * 获取当前的主题色板
 * @param type 主题名
 */
export const getPalette = (type?: ThemeName): Palette => {
  const themeName = type || 'default';
  const platte = PALETTE_MAP[themeName.toLowerCase()];
  return platte;
};
