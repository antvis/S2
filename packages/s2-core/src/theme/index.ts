import { LooseObject } from '@antv/g-base';
import { merge } from 'lodash';
import { DefaultTheme } from './default';
import { SpreadSheetTheme } from '../common/interface';

// Map of the theme
const THEME_MAP: Record<string, LooseObject> = {
  default: DefaultTheme,
};
/**
 * get the theme according to the type
 * @param type
 */
export const getTheme = (type: string): SpreadSheetTheme => {
  return THEME_MAP[type.toLowerCase()];
};

/**
 * register the theme
 * @param type
 * @param theme
 */
export const registerTheme = (
  type: string,
  theme: SpreadSheetTheme,
): SpreadSheetTheme => {
  if (getTheme(type)) {
    throw new Error(`Theme type '${type}' existed.`);
  }
  THEME_MAP[type.toLowerCase()] = merge({}, DefaultTheme, theme);
  return THEME_MAP[type.toLowerCase()];
};

export { DefaultTheme };
