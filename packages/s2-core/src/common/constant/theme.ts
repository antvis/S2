import { paletteColorful } from '../../theme/palette/colorful';
import { paletteDark } from '../../theme/palette/dark';
import { paletteDefault } from '../../theme/palette/default';
import { paletteGray } from '../../theme/palette/gray';
import type { ThemeName } from '../interface';
import { S2_PREFIX_CLS } from './classnames';

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

export const DARK_THEME_CLS = `${S2_PREFIX_CLS}-dark-theme`;

/**
 * 兼容 G2 主题: S2 和 G2 的主题名转换
 * https://g2.antv.antgroup.com/manual/core/theme
 */
export const G2_THEME_TYPE: Record<ThemeName, string> = {
  default: 'light',
  colorful: 'light',
  gray: 'light',
  dark: 'dark',
};

export const CELL_PADDING = 8;
