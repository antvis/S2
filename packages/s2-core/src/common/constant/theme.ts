import { defaultStyle } from '../../theme/style/default';
import { StyleConfig } from '../interface';

// Map of the theme
export const STYLE_MAP: Record<string, StyleConfig> = {
  default: defaultStyle,
};

export const FONT_FAMILY =
  'Roboto, PingFangSC, -apple-system, BlinkMacSystemFont, Microsoft YaHei, Arial, sans-serif';
export const ICON_SIZE = 14;
export const TEXT_INDENT = 12;
export const MINI_BAR_CHART_HEIGHT = 12;
// icon radius
export const ICON_RADIUS = 6;
// cell default padding
export const DEFAULT_PADDING = 4;
// tree row default width
export const TREE_ROW_DEFAULT_WIDTH = 100;

export const STRATEGY_PADDING = 8; // 各种padding 左右和元素边界
export const STRATEGY_ICON_WIDTH = 10; // 三角icon 宽度
// color
export const COLOR_DEFAULT_RESIZER = 'rgba(33,33,33,0)';
