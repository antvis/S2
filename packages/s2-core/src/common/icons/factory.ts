import { lowerCase } from 'lodash';

// 所有的 Icon 缓存
const SVGMap: Record<string, string> = {};

export const registerIcon = (type: string, svg: string) => {
  SVGMap[lowerCase(type)] = svg;
};

export const getIcon = (type: string): string => {
  return SVGMap[lowerCase(type)];
};
