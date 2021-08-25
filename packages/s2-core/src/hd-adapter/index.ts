import { isMobile } from '@/utils/is-mobile';
import { ext } from '@antv/matrix-util';
import { debounce } from 'lodash';
import { SpreadSheet } from '../sheet-type';

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
    const matrixTransform = ext.transform;

    const {
      container,
      options: { width, height },
    } = this.spreadsheet;
    const newWidth = Math.floor(width * ratio);
    const newHeight = Math.floor(height * ratio);

    container.resetMatrix();
    container.set('pixelRatio', ratio);
    container.changeSize(newWidth, newHeight);

    matrixTransform(container.getMatrix(), [['scale', ratio, ratio]]);

    this.spreadsheet.render(false);
  };

  private renderByZoomScale = debounce((e) => {
    const ratio = Math.max(e.target.scale, window.devicePixelRatio);
    if (ratio > 1) {
      this.renderByDevicePixelRatio(ratio);
    }
  }, 350);
}
