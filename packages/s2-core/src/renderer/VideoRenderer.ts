// 视频渲染器
import { DisplayObjectConfig, Rect, RectStyleProps } from '@antv/g';
import type { BaseCell } from '../cell';
import { GuiIcon } from '../common/icons';
import { VideoRendererConfig } from '../common/interface';
import { SimpleBBox } from '../engine';
import { BaseRenderer } from './BaseRenderer';

const defaultVideoConfig = {
  loop: true,
  autoplay: true,
  crossOrigin: true,
  controls: false,
  muted: true,
};

export class VideoRenderer extends BaseRenderer {
  prepare(renderer: VideoRendererConfig, cell: BaseCell<SimpleBBox>) {
    return new Promise<HTMLVideoElement | string>((resolve) => {
      const { text, height, width } = this.getCellInfo(cell);
      const { timeout = 10000, fallback = '' } = renderer;

      if (BaseRenderer.mediaCache.has(text)) {
        const video = BaseRenderer.mediaCache.get(text)! as HTMLVideoElement;

        resolve(video);

        return;
      }

      const video = document.createElement('video');

      const fallbackTimer = setTimeout(() => {
        resolve(fallback);
      }, timeout);

      const config = {
        height,
        width,
        src: text,
        ...defaultVideoConfig,
        ...renderer.videoConfig,
      };

      Object.assign(video, config);

      video.onloadeddata = () => {
        clearTimeout(fallbackTimer);
        BaseRenderer.mediaCache.set(text, video);

        resolve(video);
      };

      const onError = () => {
        clearTimeout(fallbackTimer);
        resolve(fallback);
      };

      // 错误处理
      ['error', 'abort', 'stalled'].forEach((eventName) => {
        video.addEventListener(eventName, onError);
      });
    });
  }

  public generateConfig(
    renderer: VideoRendererConfig,
    cell: BaseCell<SimpleBBox>,
    element: HTMLVideoElement | string,
  ): DisplayObjectConfig<RectStyleProps> {
    const { x, y, width, height } = this.getCellInfo(cell);
    let transform = '';

    if (element instanceof HTMLVideoElement) {
      const scaleX = width / element.videoWidth;
      const scaleY = height / element.videoHeight;

      transform = `scale(${scaleX}, ${scaleY})`;
    }

    // https://g.antv.antgroup.com/api/css/pattern
    return {
      style: {
        x,
        y,
        width,
        height,
        fill: {
          image: element,
          repetition: 'no-repeat',
          transform,
        },
        ...renderer.config,
      },
    };
  }

  render(
    cell: BaseCell<SimpleBBox>,
    config: DisplayObjectConfig<RectStyleProps>,
  ) {
    const rect = new Rect(config);
    const { x, y, width, height } = this.getCellInfo(cell);
    const calcSize = Math.min(width, height) * 0.25;

    rect.appendChild(
      new GuiIcon({
        name: 'Play',
        width: calcSize,
        height: calcSize,
        x: x + width / 2 - calcSize / 2,
        y: y + height / 2 - calcSize / 2,
        pointerEvents: 'none',
        cursor: 'pointer',
      }),
    );

    cell.appendChild(rect);
  }
}
