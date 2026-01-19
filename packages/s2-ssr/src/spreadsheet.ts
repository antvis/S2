/* eslint-disable max-classes-per-file,max-lines-per-function */
import { existsSync, lstatSync, writeFileSync } from 'fs';

import { Renderer } from '@antv/g-canvas';
import {
  PivotSheet as BasePivotSheet,
  TableSheet as BaseTableSheet,
} from '@antv/s2';
import type { Canvas as NodeCanvas } from 'canvas';
import { Image as NodeImage, createCanvas as createNodeCanvas } from 'canvas';
import type { MetaData, Options, Spreadsheet } from './types';

// Store nodeCanvas for each spreadsheet instance
const nodeCanvasMap = new WeakMap<object, NodeCanvas>();

/**
 * <zh/> SSR 版本的 PivotSheet
 *
 * <en/> SSR version of PivotSheet
 */
class SSRPivotSheet extends BasePivotSheet {
  protected setupContainerStyle(): void {
    // No-op in SSR - canvas.style doesn't exist
  }
}

/**
 * <zh/> SSR 版本的 TableSheet
 *
 * <en/> SSR version of TableSheet
 */
class SSRTableSheet extends BaseTableSheet {
  protected setupContainerStyle(): void {
    // No-op in SSR - canvas.style doesn't exist
  }
}

/**
 * <zh/> 获取输出文件的扩展名
 *
 * <en/> Get the extension name of the output file
 */
function getInfoOf(options: Options) {
  const { outputType, imageType } = options;

  if (outputType === 'pdf') {
    return ['.pdf', 'application/pdf'] as const;
  }

  if (outputType === 'svg') {
    return ['.svg', undefined] as const;
  }

  if (imageType === 'jpeg') {
    return ['.jpeg', 'image/jpeg'] as const;
  }

  return ['.png', 'image/png'] as const;
}

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * <zh/> 创建表格并等待渲染完成
 *
 * <en/> Create a spreadsheet and wait for the rendering to complete
 */
export async function createSpreadsheet(
  options: Options,
): Promise<Spreadsheet> {
  const {
    sheetType = 'pivot',
    dataCfg,
    options: s2Options = {},
    themeCfg,
    width,
    height,
    devicePixelRatio = 2,
    waitForRender = 100,
    outputType,
    autoFit = true,
    renderPlugins = [],
  } = options;

  // Create node-canvas instances
  const nodeCanvas = createNodeCanvas(
    width,
    height,
    outputType as 'pdf' | 'svg',
  );
  const offscreenNodeCanvas = createNodeCanvas(1, 1);

  // Add required DOM-like properties to nodeCanvas for S2 compatibility
  const canvas = nodeCanvas as NodeCanvas & {
    isConnected?: boolean;
    addEventListener?: () => void;
    removeEventListener?: () => void;
    style?: Record<string, string>;
  };

  Object.defineProperty(canvas, 'isConnected', {
    value: true,
    writable: false,
    configurable: true,
  });
  canvas.addEventListener = () => {};
  canvas.removeEventListener = () => {};
  canvas.style = {};

  // Create a minimal mock container for SSR
  const mockContainer = {
    getBoundingClientRect: () => ({
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
    appendChild: () => {},
    removeChild: () => {},
    contains: () => true,
    style: {},
    offsetWidth: width,
    offsetHeight: height,
  };

  // Choose the SSR-compatible sheet class
  const SheetClass = sheetType === 'table' ? SSRTableSheet : SSRPivotSheet;

  // Create the spreadsheet instance with transformCanvasConfig to inject node-canvas
  const spreadsheet = new SheetClass(
    mockContainer as unknown as HTMLElement,
    dataCfg,
    {
      width,
      height,
      // Disable HD adapter for SSR
      hd: false,
      ...s2Options,
      // Disable tooltip in SSR mode
      tooltip: {
        enable: false,
        ...s2Options.tooltip,
      },
      // Configure G Canvas to use our node-canvas
      transformCanvasConfig: (renderer: Renderer) => {
        // Disable DOM-related plugins that don't work in SSR
        const htmlRendererPlugin = renderer.getPlugin('html-renderer');
        const domInteractionPlugin = renderer.getPlugin('dom-interaction');

        if (htmlRendererPlugin) {
          renderer.unregisterPlugin(htmlRendererPlugin);
        }

        if (domInteractionPlugin) {
          renderer.unregisterPlugin(domInteractionPlugin);
        }

        // Register additional plugins
        renderPlugins.forEach((plugin) => {
          renderer.registerPlugin(plugin);
        });

        return {
          // Pass our node-canvas as the underlying canvas element
          canvas: canvas as unknown as HTMLCanvasElement,
          offscreenCanvas: offscreenNodeCanvas as unknown as HTMLCanvasElement,
          devicePixelRatio,
          createImage: () => new NodeImage() as unknown as HTMLImageElement,
        };
      },
    },
  );

  // Store node canvas reference
  nodeCanvasMap.set(spreadsheet, nodeCanvas);

  // Apply theme configuration if provided
  if (themeCfg) {
    spreadsheet.setThemeCfg(themeCfg);
  }

  // Render the spreadsheet
  await spreadsheet.render();

  // Wait for async rendering to complete
  await sleep(waitForRender);

  // Determine the output canvas (cropped if autoFit)
  let outputCanvas = nodeCanvas;

  if (autoFit && outputType !== 'svg' && outputType !== 'pdf') {
    // Get actual table dimensions from facet
    const facet = spreadsheet.facet;

    if (facet) {
      const panelBBox = facet.panelBBox;
      // Actual width/height is the max extent of the table content
      const actualWidth = Math.ceil(panelBBox.maxX);
      const actualHeight = Math.ceil(panelBBox.maxY);

      // Only crop if actual dimensions are smaller than canvas
      if (actualWidth < width || actualHeight < height) {
        const croppedWidth = Math.min(actualWidth, width);
        const croppedHeight = Math.min(actualHeight, height);

        const realWidth = Math.ceil(croppedWidth * devicePixelRatio);
        const realHeight = Math.ceil(croppedHeight * devicePixelRatio);

        // Create a new canvas with physical dimensions to preserve quality
        const croppedCanvas = createNodeCanvas(realWidth, realHeight);
        const ctx = croppedCanvas.getContext('2d');

        if (ctx) {
          // Copy the rendered content from original canvas 1:1
          ctx.drawImage(
            nodeCanvas,
            0,
            0,
            realWidth,
            realHeight,
            0,
            0,
            realWidth,
            realHeight,
          );
        }

        outputCanvas = croppedCanvas;
      }
    }
  }

  const [extendName, mimeType] = getInfoOf(options);

  const result: Spreadsheet = {
    getCanvas: () => outputCanvas,
    destroy: () => spreadsheet.destroy(),
    exportToFile: (file: string, meta?: MetaData) => {
      let outputPath = file;

      if (!outputPath.endsWith(extendName)) {
        if (!existsSync(outputPath)) {
          outputPath += extendName;
        } else if (lstatSync(outputPath).isDirectory()) {
          outputPath = `${outputPath}/image${extendName}`;
        } else {
          outputPath += extendName;
        }
      }

      // @ts-expect-error skip type check for node-canvas specific API
      writeFileSync(outputPath, outputCanvas.toBuffer(mimeType, meta));
    },
    // @ts-expect-error skip type check for node-canvas specific API
    toBuffer: (meta?: MetaData) => outputCanvas.toBuffer(mimeType, meta),
    toDataURL: () => outputCanvas.toDataURL(mimeType as 'image/png'),
  };

  return result;
}
