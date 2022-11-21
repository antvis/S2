import { Image, type DisplayObjectConfig, type ImageStyleProps } from '@antv/g';

/**
 * 自定义 g Image 图形
 */
export class CustomImage extends Image {
  /** 自定义 imgType （不能命名为 type，影响 g5.0 渲染） */
  public imgType: string;

  constructor(imgType: string, options?: DisplayObjectConfig<ImageStyleProps>) {
    super(options);

    this.imgType = imgType;
  }
}
