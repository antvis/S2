import { get, keys, lowerCase } from 'lodash';
import * as InternalSvgIcons from './svg';

const SVGCache: Record<string, string> = {};

export const registerIcon = (name: string, src: string) => {
  SVGCache[lowerCase(name)] = src;
};

export const getIcon = (name: string): string => SVGCache[lowerCase(name)];

// 缓存内置 Icon 信息
keys(InternalSvgIcons).forEach((name) => {
  const icon = get(InternalSvgIcons, name);

  registerIcon(name, icon);
});
