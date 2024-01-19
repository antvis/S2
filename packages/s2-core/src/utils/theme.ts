import { PALETTE_MAP, STYLE_ELEMENT_ID } from '../common/constant';
import type { Palette, ThemeName } from '../common/interface/theme';
import DarkVars from '../styles/theme/dark.less?inline';
import { injectCssText } from './inject-css-text';

/**
 * 获取当前的主题色板
 * @param type 主题名
 */
export const getPalette = (type?: ThemeName): Palette => {
  const themeName = type || 'default';

  return PALETTE_MAP[themeName];
};

/**
 * 根据主题注入组件的 css 变量
 */
export const injectThemeVars = (themeName?: ThemeName) => {
  // 目前仅 dark 主题需要定制
  injectCssText(STYLE_ELEMENT_ID, themeName === 'dark' ? DarkVars : '');
};
