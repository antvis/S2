import { debounce } from 'lodash';
import { MIN_DEVICE_PIXEL_RATIO } from '../../common/constant/options';
import type { SpreadSheet } from '../../sheet-type';
import { isMobile } from '../../utils/is-mobile';

export class HdAdapter {
  private viewport = window as typeof window & {
    visualViewport: VisualViewport;
  };

  private devicePixelRatioMedia: MediaQueryList;

  private spreadsheet: SpreadSheet;

  private isDevicePixelRatioChange = false;

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  public init = () => {
    this.initDevicePixelRatioListener();
    this.initDeviceZoomListener();
  };

  public destroy = () => {
    this.removeDevicePixelRatioListener();
    this.removeDeviceZoomListener();
  };

  private initDevicePixelRatioListener() {
    this.devicePixelRatioMedia = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );
    if (this.devicePixelRatioMedia?.addEventListener) {
      this.devicePixelRatioMedia.addEventListener(
        'change',
        this.renderByDevicePixelRatioChanged,
      );
    } else {
      this.devicePixelRatioMedia.addListener(
        this.renderByDevicePixelRatioChanged,
      );
    }
  }

  private removeDevicePixelRatioListener = () => {
    if (this.devicePixelRatioMedia?.removeEventListener) {
      this.devicePixelRatioMedia.removeEventListener(
        'change',
        this.renderByDevicePixelRatioChanged,
      );
    } else {
      this.devicePixelRatioMedia.removeListener(
        this.renderByDevicePixelRatioChanged,
      );
    }
  };

  private initDeviceZoomListener = () => {
    if (isMobile()) {
      return;
    }

    /*
     * VisualViewport support browser zoom & mac touch tablet
     * @ts-ignore
     */
    this.viewport?.visualViewport?.addEventListener(
      'resize',
      this.renderByZoomScaleWithoutResizeEffect,
    );
  };

  private removeDeviceZoomListener = () => {
    if (isMobile()) {
      return;
    }

    this.viewport?.visualViewport?.removeEventListener(
      'resize',
      this.renderByZoomScaleWithoutResizeEffect,
    );
  };

  /**
   * DPR 改变也会触发 visualViewport 的 resize 事件, 预期是只监听双指缩放, 所以这里规避掉
   * @see https://github.com/antvis/S2/issues/2072
   */
  private renderByZoomScaleWithoutResizeEffect = (event: Event) => {
    this.isDevicePixelRatioChange = false;
    this.renderByZoomScale(event);
  };

  private renderByDevicePixelRatioChanged = () => {
    this.isDevicePixelRatioChange = true;
    this.renderByDevicePixelRatio();
  };

  private renderByDevicePixelRatio = (ratio = window.devicePixelRatio) => {
    const {
      container,
      options: { width, height },
    } = this.spreadsheet;
    const canvas = this.spreadsheet.getCanvasElement();
    const lastRatio = container.getConfig().devicePixelRatio;

    if (lastRatio === ratio || !canvas) {
      return;
    }

    /*
     * 缩放时, 以向上取整后的缩放比为准
     * 设备像素比改变时, 取当前和用户配置中最大的, 保证显示效果
     */
    const pixelRatio = Math.max(ratio, lastRatio!, MIN_DEVICE_PIXEL_RATIO);

    // https://github.com/antvis/G/issues/1143
    container.getConfig().devicePixelRatio = pixelRatio;
    container.resize(width!, height!);

    this.spreadsheet.render(false);
  };

  private renderByZoomScale = debounce((event: Event) => {
    const ratio = Math.ceil((event.target as VisualViewport)?.scale);

    if (ratio >= 1 && !this.isDevicePixelRatioChange) {
      this.renderByDevicePixelRatio(ratio);
    }
  }, 350);
}
