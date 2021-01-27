import _ from 'lodash';
import DefaultTheme from './default';
import { SpreadSheetTheme } from './interface';

const THEME_MAP = {}; // 主题映射
/**
 * 获取对应的主题
 * @param type
 */
export const getTheme = (type: string): SpreadSheetTheme => {
  return THEME_MAP[type.toLowerCase()];
};

/**
 * 注册主题
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
  THEME_MAP[type.toLowerCase()] = _.assign({}, DefaultTheme, theme);
  return THEME_MAP[type.toLowerCase()];
};
