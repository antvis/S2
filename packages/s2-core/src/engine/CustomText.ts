import { Text, type DisplayObjectConfig, type TextStyleProps } from '@antv/g';

/**
 * 自定义 text 图形
 * - 有 appendInfo 属性
 */
export class CustomText<T = Record<string, any>> extends Text {
  public declare appendInfo: T;

  constructor(options: DisplayObjectConfig<TextStyleProps>, appendInfo: T) {
    super(options);

    this.appendInfo = appendInfo;
  }
}
