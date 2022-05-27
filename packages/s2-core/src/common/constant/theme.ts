import { Palette } from '../interface';
import { paletteColorful } from '@/theme/palette/colorful';
import { paletteDefault } from '@/theme/palette/default';
import { paletteGray } from '@/theme/palette/gray';

// Map of the theme
export const PALETTE_MAP: Record<string, Palette> = {
  default: paletteDefault,
  colorful: paletteColorful,
  gray: paletteGray,
};

export const FONT_FAMILY =
  'Roboto, PingFangSC, BlinkMacSystemFont, Microsoft YaHei, Arial, sans-serif';

export const MINI_BAR_CHART_HEIGHT = 12;
