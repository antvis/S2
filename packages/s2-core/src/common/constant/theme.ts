import { paletteColorful } from '../../theme/palette/colorful';
import { paletteDefault } from '../../theme/palette/default';
import { paletteGray } from '../../theme/palette/gray';
import { paletteDark } from '../../theme/palette/dark';

// Map of the theme
export const PALETTE_MAP = {
  default: paletteDefault,
  colorful: paletteColorful,
  gray: paletteGray,
  dark: paletteDark,
} as const;

/**
 * 默认字体
 *
 * -apple-system 会导致 iOS15 崩溃
 * BlinkMacSystemFont 会导致 g5.0 下 jest-electron 测试环境崩溃
 */
export const FONT_FAMILY =
  'Roboto, PingFangSC, Microsoft YaHei, Arial, sans-serif';

export const INTERVAL_BAR_HEIGHT = 12;

/**
 * 注入主题 css 变量的节点名
 */
export const STYLE_ELEMENT_ID = `antv-s2-core-vars`;
