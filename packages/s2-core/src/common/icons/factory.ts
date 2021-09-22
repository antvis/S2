import { lowerCase } from 'lodash';

// 所有的 Icon 缓存
const SVGMap: Record<string, string> = {};

export const registerIcon = (name: string, svg: string) => {
  SVGMap[lowerCase(name)] = svg;
};

export const getIcon = (name: string): string => {
  return SVGMap[lowerCase(name)];
};
