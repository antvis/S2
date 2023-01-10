import { get, keys, lowerCase } from 'lodash';
import * as InternalSvgIcons from './svg';

// 所有的 Icon 缓存
const SVGMap: Record<string, string> = {};

export const registerIcon = (name: string, svg: string) => {
  SVGMap[lowerCase(name)] = svg;
};

export const getIcon = (name: string): string => SVGMap[lowerCase(name)];

// 缓存内置 Icon 信息
keys(InternalSvgIcons).forEach((name) => {
  const icon = get(InternalSvgIcons, name);

  registerIcon(name, icon);
});
