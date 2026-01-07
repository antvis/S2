/* eslint-disable max-classes-per-file */
import { existsSync, lstatSync, writeFileSync } from 'fs';

import {
  PivotSheet as BasePivotSheet,
  TableSheet as BaseTableSheet,
  type SpreadSheet,
} from '@antv/s2';
import { createCanvas } from './canvas';
import type { MetaData, Options, Spreadsheet } from './types';

/**
 * <zh/> SSR 版本的 PivotSheet，覆盖了需要 DOM 的方法
 *
 * <en/> SSR version of PivotSheet with DOM methods overridden
 */
class SSRPivotSheet extends BasePivotSheet {
  protected setupContainerStyle(): void {
    // No-op in SSR - canvas.style doesn't exist
  }
}

/**
 * <zh/> SSR 版本的 TableSheet，覆盖了需要 DOM 的方法
 *
 * <en/> SSR version of TableSheet with DOM methods overridden
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
 * @param options - <zh/>配置项 | <en/>options
 * @returns <zh/>输出文件的扩展名 | <en/>The extension name of the output file
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
 * @param options - <zh/>表格配置项 | <en/>Spreadsheet options
 * @returns <zh/>扩展表格实例 | <en/>Extended spreadsheet instance
 */
export async function createSpreadsheet(
  options: Options,
): Promise<Spreadsheet> {
  const {
    sheetType = 'pivot',
    dataCfg,
    options: s2Options = {},
    width,
    height,
    waitForRender = 32,
  } = options;

  const [gCanvas, nodeCanvas] = createCanvas(options);

  // Wait for canvas to be ready
  await gCanvas.ready;

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

  // Get the Image class from canvas module for image creation
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const { Image: NodeImage } = require('canvas');

  // Choose the SSR-compatible sheet class
  const SheetClass = sheetType === 'table' ? SSRTableSheet : SSRPivotSheet;

  const spreadsheet: SpreadSheet = new SheetClass(
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
      // Use our SSR canvas instead of creating a new one
      transformCanvasConfig: (renderer) => {
        // Disable DOM-related plugins
        const htmlRendererPlugin = renderer.getPlugin('html-renderer');
        const domInteractionPlugin = renderer.getPlugin('dom-interaction');

        if (htmlRendererPlugin) {
          renderer.unregisterPlugin(htmlRendererPlugin);
        }

        if (domInteractionPlugin) {
          renderer.unregisterPlugin(domInteractionPlugin);
        }

        return {
          container: mockContainer as unknown as HTMLElement,
          canvas: nodeCanvas as unknown as HTMLCanvasElement,
          offscreenCanvas: nodeCanvas as unknown as HTMLCanvasElement,
          createImage: () => new NodeImage() as HTMLImageElement,
        };
      },
    },
  );

  // Render the spreadsheet
  await spreadsheet.render();

  // Wait for async rendering to complete
  await sleep(waitForRender);

  const [extendName, mimeType] = getInfoOf(options);

  const result: Spreadsheet = {
    getCanvas: () => nodeCanvas,
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
      writeFileSync(outputPath, nodeCanvas.toBuffer(mimeType, meta));
    },
    // @ts-expect-error skip type check for node-canvas specific API
    toBuffer: (meta?: MetaData) => nodeCanvas.toBuffer(mimeType, meta),
    toDataURL: () => nodeCanvas.toDataURL(mimeType as 'image/png'),
  };

  return result;
}
