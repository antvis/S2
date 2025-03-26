import { DisplayObjectConfig, Image as GImage, ImageStyleProps } from '@antv/g';
import type { BaseCell } from '../cell';
import {
  CellClipBox,
  CustomRendererConfig,
  ImageRendererConfig,
} from '../common/interface';
import { SimpleBBox } from '../engine';
import {
  asyncDrawImage,
  calculateImageSize,
} from '../utils/cell/customRenderer';
import { BaseRenderer } from './BaseRenderer';

// 图片渲染器
export class ImageRenderer extends BaseRenderer {
  prepare(renderer: ImageRendererConfig, cell: BaseCell<SimpleBBox>) {
    const { text } = this.getCellInfo(cell);

    return asyncDrawImage({
      src: text,
      fallback: renderer.fallback,
      timeout: renderer.timeout,
      mediaCache: BaseRenderer.mediaCache,
    });
  }

  public generateConfig(
    renderer: CustomRendererConfig,
    cell: BaseCell<SimpleBBox>,
    element: HTMLImageElement,
  ) {
    const { y, height, width } = cell.getBBoxByType(CellClipBox.CONTENT_BOX);
    const { width: calcWidth, height: calcHeight } = calculateImageSize(
      width,
      height,
      element.naturalWidth,
      element.naturalHeight,
    );

    const { x: calcX } = cell.getContentPosition({
      contentWidth: calcWidth,
    });

    return {
      style: {
        x: calcX,
        y,
        src: element,
        width: calcWidth,
        height: calcHeight,
        ...renderer.config,
      },
    };
  }

  render(
    cell: BaseCell<SimpleBBox>,
    config: DisplayObjectConfig<ImageStyleProps>,
  ) {
    cell.appendChild(new GImage(config));
  }

  destroy() {}
}
