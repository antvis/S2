import { ImageStyleProps, RectStyleProps } from '@antv/g';
import { CellRendererType } from '../constant/renderer';

type RendererType = keyof typeof CellRendererType;
// 基础渲染配置
interface BaseRendererConfig<T extends RendererType | CellRendererType> {
  /**
   * 渲染类型
   */
  type: T;
  /** 当渲染失败时的回退内容（文字/HTML） */
  fallback?: string;
  /** 是否开启点击预览 */
  clickToPreview?: boolean;
  timeout?: number;
}

// 图片渲染配置
export interface ImageRendererConfig
  extends BaseRendererConfig<CellRendererType.IMAGE> {
  config?: Partial<ImageStyleProps>;
}

// 视频渲染配置
export interface VideoRendererConfig
  extends BaseRendererConfig<CellRendererType.VIDEO> {
  config?: Partial<RectStyleProps>;
  videoConfig?: Partial<HTMLVideoElement>;
}

export type CustomRendererConfig = ImageRendererConfig | VideoRendererConfig;
