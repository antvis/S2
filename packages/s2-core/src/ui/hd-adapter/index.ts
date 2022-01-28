import { debounce } from 'lodash';
import { MIN_DEVICE_PIXEL_RATIO } from '@/common/constant/options';
import { isMobile } from '@/utils/is-mobile';
import type { SpreadSheet } from '@/sheet-type';

export class HdAdapter {
  private viewport = window as typeof window & { visualViewport: Element };

  private devicePixelRatioMedia: MediaQueryList;

  private spreadsheet: SpreadSheet;

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
    // VisualViewport support browser zoom & mac touch tablet
    this.viewport?.visualViewport?.addEventListener(
      'resize',
      this.renderByZoomScale,
    );
  };

  private removeDeviceZoomListener = () => {
    if (isMobile()) {
      return;
    }
    this.viewport?.visualViewport?.removeEventListener(
      'resize',
      this.renderByZoomScale,
    );
  };

  private renderByDevicePixelRatioChanged = () => {
    this.renderByDevicePixelRatio();
  };

  private renderByDevicePixelRatio = (ratio = window.devicePixelRatio) => {
    const {
      container,
      options: { width, height, devicePixelRatio },
    } = this.spreadsheet;

    // 缩放时, 以向上取整后的缩放比为准
    // 设备像素比改变时, 取当前和用户配置中最大的, 保证显示效果
    const pixelRatio = Math.max(
      ratio,
      devicePixelRatio,
      MIN_DEVICE_PIXEL_RATIO,
    );

    container.set('pixelRatio', pixelRatio);
    container.changeSize(width, height);

    this.spreadsheet.render(false);
  };

  private renderByZoomScale = debounce(
    (event: Event & { target: VisualViewport }) => {
      const ratio = Math.ceil(event.target.scale);
      if (ratio >= 1) {
        this.renderByDevicePixelRatio(ratio);
      }
    },
    350,
  );
}
