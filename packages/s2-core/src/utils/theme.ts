import { PALETTE_MAP, STYLE_ELEMENT_ID } from '../common/constant';
import type { Palette, ThemeName } from '../common/interface/theme';
import DarkVars from '../styles/theme/dark.less';
import { injectCssText } from './inject-css-text';

/**
 * 获取当前的主题色板
 */
export const getPalette = (themeName?: ThemeName): Palette => {
  return PALETTE_MAP[themeName!] || PALETTE_MAP['default'];
};

/**
 * 根据主题注入组件的 CSS 变量
 */
export const injectThemeVars = (themeName?: ThemeName) => {
  // 目前仅 dark 主题需要定制
  injectCssText(
    STYLE_ELEMENT_ID,
    themeName === 'dark' ? (DarkVars as string) : '',
  );
};
