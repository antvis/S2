import { PALETTE_MAP } from '../common/constant';
import type { Palette, ThemeName } from '../common/interface/theme';

/**
 * 获取当前的主题色板
 * @param type 主题名
 */
export const getPalette = (type?: ThemeName): Palette => {
  const themeName = type || 'default';
  return PALETTE_MAP[themeName.toLowerCase()];
};
