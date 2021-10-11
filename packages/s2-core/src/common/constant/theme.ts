import { Palette } from '../interface';
import { paletteColorfulBlue } from '@/theme/palette/colorful-blue';
import { paletteDefault } from '@/theme/palette/default';
import { paletteSimpleBlue } from '@/theme/palette/simple-blue';

// Map of the theme
export const PALETTE_MAP: Record<string, Palette> = {
  default: paletteDefault,
  simple: paletteSimpleBlue,
  colorful: paletteColorfulBlue,
};

export const FONT_FAMILY =
  'Roboto, PingFangSC, BlinkMacSystemFont, Microsoft YaHei, Arial, sans-serif';
export const ICON_SIZE = 14;
export const TEXT_INDENT = 12;

// cell default padding
export const DEFAULT_PADDING = 4;
// tree row default width
export const TREE_ROW_DEFAULT_WIDTH = 120;

export const MINI_BAR_CHART_HEIGHT = 12;
