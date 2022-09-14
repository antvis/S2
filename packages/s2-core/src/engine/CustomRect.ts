import { Rect, type DisplayObjectConfig, type RectStyleProps } from '@antv/g';

/**
 * 自定义 rect 图形
 * - 有 appendInfo 属性
 */
export class CustomRect<T = Record<string, any>> extends Rect {
  public appendInfo: T;

  constructor(options: DisplayObjectConfig<RectStyleProps>, appendInfo: T) {
    super(options);

    this.appendInfo = appendInfo;
  }
}
