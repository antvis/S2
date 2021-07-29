import { merge } from 'lodash';
import { DefaultTheme } from './default';
import { SpreadSheetTheme, ThemeType } from '@/common/interface';

// Map of the theme
const THEME_MAP: Record<ThemeType, SpreadSheetTheme> = {
  default: DefaultTheme,
};
/**
 * get the theme according to the type
 * @param type
 */
export const getTheme = (type: ThemeType = 'default'): SpreadSheetTheme => {
  return THEME_MAP[type.toLowerCase()];
};

/**
 * register the theme
 * @param type
 * @param theme
 */
export const registerTheme = (
  type: ThemeType,
  theme: SpreadSheetTheme,
): SpreadSheetTheme => {
  if (getTheme(type)) {
    throw new Error(`Theme type '${type}' existed.`);
  }
  THEME_MAP[type.toLowerCase()] = merge({}, DefaultTheme, theme);
  return THEME_MAP[type.toLowerCase()];
};

export { DefaultTheme };
