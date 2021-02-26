// shape的属性和css属性的映射
export const shapeStyleMap = {
  backgroundColor: 'fillStyle',
  opacity: 'fillOpacity',
  prepareSelectBorderColor: 'stroke',
};

// 设置属性的时候实际对应改变的shape映射
export const shapeAttrsMap = {
  interactiveBgShape: [
    'backgroundColor',
    'opacity'
  ],
  prepareSelectBorderShape: [
    'prepareSelectBorderColor',
  ],
};
