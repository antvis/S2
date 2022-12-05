import type { Palette } from '../interface';
import { paletteColorful } from '../../theme/palette/colorful';
import { paletteDefault } from '../../theme/palette/default';
import { paletteGray } from '../../theme/palette/gray';

// Map of the theme
export const PALETTE_MAP: Record<string, Palette> = {
  default: paletteDefault,
  colorful: paletteColorful,
  gray: paletteGray,
};

/**
 * 默认字体
 *
 * -apple-system 会导致 iOS15 崩溃
 * BlinkMacSystemFont 会导致 g5.0 下 jest-electron 测试环境崩溃
 */
export const FONT_FAMILY =
  'Roboto, PingFangSC, Microsoft YaHei, Arial, sans-serif';

export const INTERVAL_BAR_HEIGHT = 12;
