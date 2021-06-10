import { StyleConfig } from '../common/interface/theme';
import { STYLE_MAP } from '../common/constant';

/**
 * @description  calculate the hex color value based on the value of hex color and opacity
 * @param color
 * @param opacity
 */
export const calcColorByOpacity = (color: string, opacity: number) => {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/g;
  if (!reg.test(color)) {
    throw new Error(`Invalid hex color value!`);
  }
  const opacityHex = parseInt((opacity * 255).toString(), 16);
  return `${color}${opacityHex}`;
}

/**
 * get the style config according to the type
 * @param type
 */
 export const getStyleConfig = (type: string): StyleConfig => {
  return STYLE_MAP[type.toLowerCase()];
};
