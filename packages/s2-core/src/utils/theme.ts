import { Palette } from '../common/interface/theme';
import { PALETTE_MAP } from '../common/constant';

/**
 * get the palette according to the theme type
 * @param type
 */
export const getPaletteByType = (type: string): Palette => {
  return PALETTE_MAP[type.toLowerCase()];
};
