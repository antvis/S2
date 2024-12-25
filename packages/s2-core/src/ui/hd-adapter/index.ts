import { debounce } from 'lodash';
import type { SpreadSheet } from '../../sheet-type';
import { isMobile } from '../../utils/is-mobile';

/**
 * 基于 Canvas 的高清适配方案
 * 1. 双屏切换, devicePixelRatio 变化时
 * 2. Mac 触控板缩放
 * 3. 浏览器窗口缩放
 */
export class HdAdapter {
  private viewport = window as typeof window & {
    visualViewport: VisualViewport;
  };

  private devicePixelRatioMedia: MediaQueryList;

  private spreadsheet: SpreadSheet;

  private isDevicePixelRatioChange;

  private zoomOffsetLeft: number | undefined;

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.isDevicePixelRatioChange = false;
    this.zoomOffsetLeft = 0;
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
  private renderByZoomScaleWithoutResizeEffect = async (event: Event) => {
    this.isDevicePixelRatioChange = false;
    await this.renderByZoomScale(event);
  };

  /**
   * 如果是浏览器窗口的放大缩小 (command +/-), 也会触发
   */
  private renderByDevicePixelRatioChanged = async () => {
    this.isDevicePixelRatioChange = true;
    await this.renderByDevicePixelRatio();
  };

  private renderByDevicePixelRatio = async (
    ratio = window.devicePixelRatio,
  ) => {
    if (this.spreadsheet.destroyed) {
      return;
    }

    const {
      container,
      options: { width, height },
    } = this.spreadsheet;
    const canvas = this.spreadsheet.getCanvasElement();
    const currentRatio = Math.ceil(ratio);
    const lastRatio = container.getConfig().devicePixelRatio ?? 1;

    if (lastRatio === currentRatio || !canvas) {
      return;
    }

    // https://github.com/antvis/G/issues/1143
    container.getConfig().devicePixelRatio = currentRatio;
    container.resize(width!, height!);

    await this.spreadsheet.render(false);
  };

  private renderByZoomScale = debounce(async (event: Event) => {
    if (this.spreadsheet.destroyed) {
      return;
    }

    const target = event.target as VisualViewport;
    const ratio = Math.ceil(target?.scale);

    /**
     * github.com/antvis/S2/issues/2884
     * 如果是触控板双指缩放触发的 resize 事件, offsetLeft 可以获取到值
     * 如果是浏览器窗口的放大缩小 (command +/-), offsetLeft 始终是 0
     */
    const isTouchPadZoom =
      (this.zoomOffsetLeft || 0) !== (target?.offsetLeft || 0);

    if (ratio >= 1 && isTouchPadZoom && !this.isDevicePixelRatioChange) {
      const maxDPR = Math.max(ratio, window.devicePixelRatio);

      await this.renderByDevicePixelRatio(maxDPR);
      this.zoomOffsetLeft = target.offsetLeft;
    }
  }, 350);
}
