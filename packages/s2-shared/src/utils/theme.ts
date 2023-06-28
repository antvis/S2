import { injectCssText, type ThemeName } from '@antv/s2';
import { STYLE_ELEMENT_ID } from '../constant/theme';
import DarkVars from '../styles/theme/dark.less?inline';

/**
 * 根据主题注入组件的 css 变量
 */
export const injectThemeVars = (themeName?: ThemeName) => {
  // 目前仅dark主题需要定制
  injectCssText(STYLE_ELEMENT_ID, themeName === 'dark' ? DarkVars : '');
};
