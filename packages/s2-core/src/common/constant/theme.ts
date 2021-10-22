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

export const MINI_BAR_CHART_HEIGHT = 12;
