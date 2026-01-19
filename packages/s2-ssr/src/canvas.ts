import { Canvas as GCanvas } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import type { Canvas as NodeCanvas } from 'canvas';
import { createCanvas as createNodeCanvas, Image as NodeImage } from 'canvas';
import type { Options } from './types';

/**
 * <zh/> 创建画布
 *
 * <en/> create canvas
 * @param options <zh/> options 画布配置 | <en/> options canvas configuration
 * @returns <zh/> [G 画布, NodeCanvas 画布] | <en/> [GCanvas, NodeCanvas]
 */
export function createCanvas(options: Options): [GCanvas, NodeCanvas] {
  const { width, height, devicePixelRatio = 2, outputType } = options;

  const nodeCanvas = createNodeCanvas(
    width,
    height,
    outputType as 'pdf' | 'svg',
  );
  const offscreenNodeCanvas = createNodeCanvas(1, 1);
  const renderPlugins = options.renderPlugins || [];

  const renderer = new Renderer();
  const htmlRendererPlugin = renderer.getPlugin('html-renderer');
  const domInteractionPlugin = renderer.getPlugin('dom-interaction');

  renderer.unregisterPlugin(htmlRendererPlugin);
  renderer.unregisterPlugin(domInteractionPlugin);

  renderPlugins.forEach((plugin) => {
    renderer.registerPlugin(plugin);
  });

  const gCanvas = new GCanvas({
    width,
    height,
    renderer,
    devicePixelRatio,
    canvas: nodeCanvas as unknown as HTMLCanvasElement,
    offscreenCanvas: offscreenNodeCanvas as unknown as HTMLCanvasElement,
    createImage: () => new NodeImage() as unknown as HTMLImageElement,
  });

  return [gCanvas, nodeCanvas];
}
