// 主题配置和canvas属性的映射
export const shapeStyleMap = {
  hoverBackgroundColor: 'fill',
  selectedBackgroundColor: 'fill',
  hoverBorderColor: 'stroke',
  selectedBorderColor: 'stroke',
  hoverBorderWidth: 'lineWidth',
  selectedBorderWidth: 'lineWidth',
};

// 设置属性的时候实际对应改变的shape映射
export const shapeAttrsMap = {
  interactiveBgShape: [
    'hoverBackgroundColor',
    'hoverBorderColor',
    'hoverBorderWidth',
  ],
  activeBorderShape: [
    'selectedBorderColor',
    'selectedBorderColor',
    'selectedBorderWidth',
  ],
};
