import { Image, type DisplayObjectConfig, type ImageStyleProps } from '@antv/g';

/**
 * 自定义 g Image 图形
 */
export class CustomImage extends Image {
  /** 自定义 type */
  public type: string;

  constructor(type: string, options?: DisplayObjectConfig<ImageStyleProps>) {
    super(options);

    this.type = type;
  }
}
