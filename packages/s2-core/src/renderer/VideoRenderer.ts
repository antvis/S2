// 视频渲染器
import { DisplayObjectConfig, HTML, HTMLStyleProps } from '@antv/g';
import type { BaseCell } from '../cell';
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
    const { text, height, width } = this.getCellInfo(cell);

    if (BaseRenderer.mediaCache.has(text)) {
      const video = BaseRenderer.mediaCache.get(text)! as HTMLVideoElement;

      Object.assign(video, {
        height,
        width,
        ...defaultVideoConfig,
        ...renderer.config,
      });

      // video元素被移除可视区域后，再进入可视区域，自动播放
      if (video.autoplay) {
        video.play();
      }

      return Promise.resolve(video);
    }

    const video = document.createElement('video');

    const config = {
      height,
      width,
      ...defaultVideoConfig,
      ...renderer.config,
      src: text,
    };

    Object.assign(video, config);
    BaseRenderer.mediaCache.set(text, video);

    return Promise.resolve(video);
  }

  public generateConfig(
    renderer: VideoRendererConfig,
    cell: BaseCell<SimpleBBox>,
    element: HTMLElement,
  ): DisplayObjectConfig<HTMLStyleProps> {
    const { x, y } = this.getCellInfo(cell);

    return {
      style: {
        x,
        y,
        innerHTML: element,
        pointerEvents: 'none',
      },
    };
  }

  render(
    cell: BaseCell<SimpleBBox>,
    config: DisplayObjectConfig<HTMLStyleProps>,
  ) {
    cell.appendChild(new HTML(config));
  }
}
