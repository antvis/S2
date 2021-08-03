import { paletteDefault } from '../../theme/palette/default';
import { paletteColorfulBlue } from '../../theme/palette/colorful-blue';
import { paletteSimpleBlue } from '../../theme/palette/simple-blue';
import { Palette } from '../interface';

// Map of the theme
export const PALETTE_MAP: Record<string, Palette> = {
  default: paletteDefault,
  simple: paletteSimpleBlue,
  colorful: paletteColorfulBlue,
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
export const TREE_ROW_DEFAULT_WIDTH = 120;

export const STRATEGY_PADDING = 8; // 各种padding 左右和元素边界
export const STRATEGY_ICON_WIDTH = 10; // 三角icon 宽度
// color
export const COLOR_DEFAULT_RESIZER = 'rgba(33,33,33,0)';
