import type { RendererPlugin } from '@antv/g';
import type { S2DataConfig, S2Options, ThemeCfg } from '@antv/s2';
import type { Canvas, JpegConfig, PdfConfig, PngConfig } from 'canvas';

/**
 * <zh/> S2 SSR 配置项
 *
 * <en/> S2 SSR Options
 */
export interface Options {
  /**
   * <zh/> 表格类型
   *
   * <en/> Sheet type
   * @defaultValue 'pivot'
   */
  sheetType?: 'pivot' | 'table';
  /**
   * <zh/> 数据配置
   *
   * <en/> Data configuration
   */
  dataCfg: S2DataConfig;
  /**
   * <zh/> 表格配置
   *
   * <en/> Sheet options
   */
  options?: Partial<S2Options>;
  /**
   * <zh/> 主题配置
   *
   * <en/> Theme configuration
   */
  themeCfg?: ThemeCfg;
  /**
   * <zh/> 画布宽度
   *
   * <en/> Canvas width
   */
  width: number;
  /**
   * <zh/> 画布高度
   *
   * <en/> Canvas height
   */
  height: number;
  /**
   * <zh/> 设备像素比
   *
   * <en/> Device pixel ratio
   * @defaultValue 2
   */
  devicePixelRatio?: number;
  /**
   * <zh/> 等待渲染的时间，默认为 100ms
   *
   * <en/> The time to wait for rendering, default is 100ms
   * @defaultValue 100
   */
  waitForRender?: number;
  /**
   * <zh/> 输出文件类型，默认导出为图片
   *
   * <en/> output file type, default export as image
   * @defaultValue 'image'
   */
  outputType?: 'image' | 'pdf' | 'svg';
  /**
   * <zh/> 图片类型，默认为 png
   *
   * <en/> Image type, default is png
   * @defaultValue 'png'
   */
  imageType?: 'png' | 'jpeg';
  /**
   * <zh/> 自动裁剪画布到实际表格大小，去除空白区域
   *
   * <en/> Auto crop canvas to actual table size, remove blank areas
   * @defaultValue true
   */
  autoFit?: boolean;
  /**
   * <zh/> 渲染插件
   *
   * <en/> Render plugins
   */
  renderPlugins?: RendererPlugin[];
}

/**
 * <zh/> PDF/PNG/JPEG 元数据
 *
 * <en/> PDF/PNG/JPEG metadata
 */
export type MetaData = PdfConfig | PngConfig | JpegConfig;

/**
 * <zh/> SSR 表格实例
 *
 * <en/> SSR Spreadsheet instance
 */
export interface Spreadsheet {
  /**
   * <zh/> 导出到文件
   *
   * <en/> Export to file
   */
  exportToFile: (file: string, meta?: MetaData) => void;
  /**
   * <zh/> 导出为 Buffer
   *
   * <en/> Export as Buffer
   */
  toBuffer: (meta?: MetaData) => Buffer;
  /**
   * <zh/> 导出为 DataURL
   *
   * <en/> Export as DataURL
   */
  toDataURL: () => string;
  /**
   * <zh/> 获取 NodeCanvas 画布
   *
   * <en/> Get NodeCanvas
   */
  getCanvas: () => Canvas;
  /**
   * <zh/> 销毁实例
   *
   * <en/> Destroy instance
   */
  destroy: () => void;
}
