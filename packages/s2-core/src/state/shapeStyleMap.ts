// 主题配置和canvas属性的映射
export const shapeStyleMap = {
  backgroundColor: 'fill',
  opacity: 'fillOpacity',
  prepareSelectBorderColor: 'stroke',
  hoverBorderColor: 'stroke'
};

// 设置属性的时候实际对应改变的shape映射
export const shapeAttrsMap = {
  interactiveBgShape: ['backgroundColor', 'opacity'],
  activeBorderShape: ['prepareSelectBorderColor', 'hoverBorderColor'],
};
