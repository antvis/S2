// 视频渲染器
import { DisplayObjectConfig, Rect, RectStyleProps } from '@antv/g';
import type { BaseCell } from '../cell';
import { VIDEO_RECT_NAME } from '../common/constant/renderer';
import { GuiIcon } from '../common/icons';
import { CellClipBox, VideoRendererConfig } from '../common/interface';
import { SimpleBBox } from '../engine';
import { calculateImageSize } from '../utils/cell/customRenderer';
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
  async prepare(renderer: VideoRendererConfig, cell: BaseCell<SimpleBBox>) {
    const text = await this.prepareText(renderer, cell);

    return new Promise<HTMLVideoElement | string>((resolve) => {
      const { height, width } = this.getCellInfo(cell);
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
        video.pause();
        video.currentTime = VIDEO_PREVIEW_FRAME_TIME;
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
    const { y, height } = cell.getBBoxByType(CellClipBox.CONTENT_BOX);
    const availableWidth = Math.max(cell.getMaxTextWidth(), 0);
    let videoWidth = availableWidth;
    let videoHeight = height;
    let fill: RectStyleProps['fill'] = 'transparent';

    if (element instanceof HTMLVideoElement) {
      const calculated = calculateImageSize(
        availableWidth,
        height,
        element.videoWidth,
        element.videoHeight,
      );

      videoWidth = calculated.width;
      videoHeight = calculated.height;

      const scaleX = videoWidth / element.videoWidth;
      const scaleY = videoHeight / element.videoHeight;

      fill = {
        image: element,
        repetition: 'no-repeat',
        transform: `scale(${scaleX}, ${scaleY})`,
      };
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
    };
  }

  render(
    cell: BaseCell<SimpleBBox>,
    config: DisplayObjectConfig<RectStyleProps>,
  ) {
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
