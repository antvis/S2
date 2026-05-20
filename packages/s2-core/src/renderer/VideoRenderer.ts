// 视频渲染器
import type { RectStyleProps } from '@antv/g';
import { Image as GImage, Rect } from '@antv/g';
import { merge } from 'lodash';
import type { BaseCell } from '../cell';
import { VIDEO_RECT_NAME } from '../common/constant/renderer';
import { GuiIcon } from '../common/icons';
import { CellClipBox, VideoRendererConfig } from '../common/interface';
import type { VideoRendererDisplayObjectConfig } from '../common/interface/renderer';
import { SimpleBBox } from '../engine';
import {
  asyncDrawImage,
  calculateImageSize,
} from '../utils/cell/customRenderer';
import { BaseRenderer } from './BaseRenderer';

// 部分浏览器 autoplay=false 时不解码首帧，seek 到此时间点强制解码以展示预览画面
const VIDEO_PREVIEW_FRAME_TIME = 0.001;

const defaultVideoConfig = {
  loop: true,
  autoplay: false,
  preload: 'auto',
  crossOrigin: true,
  controls: false,
  muted: true,
};

export class VideoRenderer extends BaseRenderer {
  public fallback = '';

  async prepare(renderer: VideoRendererConfig, cell: BaseCell<SimpleBBox>) {
    const text = await this.prepareText(renderer, cell);

    return new Promise<HTMLVideoElement | HTMLImageElement | string>(
      (resolve) => {
        const { height, width } = this.getCellInfo(cell);
        const { timeout = 10000, fallback = '' } = renderer;

        this.fallback = fallback;

        const cacheKey = BaseRenderer.getCacheKey('video', text);

        if (BaseRenderer.mediaCache.has(cacheKey)) {
          const cached = BaseRenderer.mediaCache.get(cacheKey);

          if (
            cached instanceof HTMLVideoElement ||
            cached instanceof HTMLImageElement
          ) {
            resolve(cached);

            return;
          }

          if (cached === null) {
            resolve(fallback);

            return;
          }
        }

        const video = document.createElement('video');

        const handleFallback = async () => {
          if (fallback) {
            const img = await asyncDrawImage({
              src: fallback,
              fallback: '',
              timeout: 5000,
              mediaCache: BaseRenderer.mediaCache,
            }).catch(() => null);

            if (img) {
              BaseRenderer.mediaCache.set(cacheKey, img);
              resolve(img);

              return;
            }
          }

          BaseRenderer.mediaCache.set(cacheKey, null);
          resolve(fallback);
        };

        const fallbackTimer = setTimeout(handleFallback, timeout);

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

          // 只在未显式配置 autoplay: true 时才 pause/seek，避免覆盖用户配置
          if (!config.autoplay) {
            video.pause();
            video.currentTime = VIDEO_PREVIEW_FRAME_TIME;
          }

          BaseRenderer.mediaCache.set(cacheKey, video);

          resolve(video);
        };

        const onError = () => {
          clearTimeout(fallbackTimer);
          handleFallback();
        };

        // 错误处理
        ['error', 'abort', 'stalled'].forEach((eventName) => {
          video.addEventListener(eventName, onError);
        });
      },
    );
  }

  public generateConfig(
    renderer: VideoRendererConfig,
    cell: BaseCell<SimpleBBox>,
    element: HTMLVideoElement | HTMLImageElement | string,
  ): VideoRendererDisplayObjectConfig {
    const { y, height } = cell.getBBoxByType(CellClipBox.CONTENT_BOX);
    const availableWidth = Math.max(cell.getMaxTextWidth(), 0);
    let videoWidth = availableWidth;
    let videoHeight = height;
    let fill: RectStyleProps['fill'] = 'transparent';

    const getMediaSize = (el: HTMLVideoElement | HTMLImageElement) =>
      el instanceof HTMLVideoElement
        ? { width: el.videoWidth, height: el.videoHeight }
        : { width: el.naturalWidth, height: el.naturalHeight };

    if (
      element instanceof HTMLVideoElement ||
      element instanceof HTMLImageElement
    ) {
      const { width: srcWidth, height: srcHeight } = getMediaSize(element);
      const { width: finalWidth, height: finalHeight } = calculateImageSize(
        availableWidth,
        height,
        srcWidth,
        srcHeight,
      );

      videoWidth = finalWidth;
      videoHeight = finalHeight;
      fill = {
        image: element,
        repetition: 'no-repeat',
        transform: `scale(${finalWidth / srcWidth}, ${finalHeight / srcHeight})`,
      };
    } else {
      // 加载失败：展示空白
      fill = 'transparent';
    }

    const { x: videoX } = cell.getContentPosition({
      contentWidth: videoWidth,
    });
    const videoY = y + (height - videoHeight) / 2;

    // https://g.antv.antgroup.com/api/css/pattern
    return {
      style: {
        x: videoX,
        y: videoY,
        width: videoWidth,
        height: videoHeight,
        fill,
        ...renderer.config,
      },
      isFallback: element instanceof HTMLImageElement,
    };
  }

  render(cell: BaseCell<SimpleBBox>, config: VideoRendererDisplayObjectConfig) {
    if (config.isFallback) {
      cell.appendChild(
        new GImage(merge({}, config, { style: { src: this.fallback } })),
      );

      return;
    }

    const rect = new Rect({ ...config, name: VIDEO_RECT_NAME });
    const { x, y, width, height } = config.style as {
      x: number;
      y: number;
      width: number;
      height: number;
    };

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
