/**
 * Create By Bruce Too
 * On 2020-10-16
 */
export interface ScrollBarCfg {
  // 布局 横向(horizontal) | 纵向(vertical)
  readonly isHorizontal?: boolean;
  // 滑道长度
  readonly trackLen: number;
  // 滑块长度
  readonly thumbLen: number;
  // scrollBar 的位置
  readonly position: PointObject;
  // 最小滑块长度
  readonly minThumbLen?: number;
  // 滑块相对滑道的偏移量
  readonly thumbOffset?: number;

  // 滚动条样式
  readonly theme?: ScrollBarTheme;
}

export interface PointObject {
  x: number;
  y: number;
}

export interface ScrollBarStyle {
  trackColor: string;
  thumbColor: string;
  size: number;
  lineCap: 'round' | 'butt' | 'square';
}

export interface ScrollBarTheme {
  default?: Partial<Readonly<ScrollBarStyle>>;
  hover?: Partial<Readonly<ScrollBarStyle>>;
}
