import { ScrollBarStyle, ScrollBarTheme } from './interface';

const DEFAULT_STYLE: ScrollBarStyle = {
  trackColor: 'rgba(0,0,0,0)',
  thumbColor: 'rgba(0,0,0,0.15)',
  size: 8,
  lineCap: 'round',
};

export const DEFAULT_THEME: ScrollBarTheme = {
  // 默认样式
  default: DEFAULT_STYLE,
  // 鼠标 hover 的样式
  hover: {
    thumbColor: 'rgba(0,0,0,0.2)',
  },
};
