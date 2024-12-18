import { PALETTE_MAP } from '../common/constant';
import type { Palette, ThemeName } from '../common/interface/theme';

/**
 * 获取当前的主题色板
 */
export const getPalette = (themeName?: ThemeName): Palette => {
  return PALETTE_MAP[themeName!] || PALETTE_MAP['default'];
};
