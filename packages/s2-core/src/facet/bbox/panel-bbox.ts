import { floor } from '../../utils/math';
import { Frame } from '../header/frame';
import { BaseBBox } from './base-bbox';

export class PanelBBox extends BaseBBox {
  calculateBBox() {
    this.calculateOriginWidth();
    this.calculateOriginalHeight();

    const { cornerBBox } = this.facet;
    const cornerPosition = {
      x: floor(cornerBBox.maxX),
      y: floor(cornerBBox.maxY),
    };

    // splitLine 也应该占位，panelBBox = canvasBBox - cornerBBox - splitLineBBox
    this.x = cornerPosition.x + Frame.getVerticalBorderWidth(this.spreadsheet);
    this.y =
      cornerPosition.y + Frame.getHorizontalBorderWidth(this.spreadsheet);
    this.minX = this.x;
    this.minY = this.y;

    this.width = this.getPanelWidth();
    this.height = this.getPanelHeight();
    this.viewportHeight = Math.abs(
      floor(Math.min(this.height, this.originalHeight)),
    );
    this.viewportWidth = Math.abs(
      floor(Math.min(this.width, this.originalWidth)),
    );
    this.maxX = this.x + this.viewportWidth;
    this.maxY = this.y + this.viewportHeight;
  }

  protected calculateOriginalHeight() {
    this.originalHeight = this.facet.getRealHeight();
  }

  protected calculateOriginWidth() {
    this.originalWidth = this.facet.getRealWidth();
  }

  protected getPanelWidth() {
    const { width: canvasWidth } = this.spreadsheet.options;
    const panelWidth = Math.max(0, canvasWidth! - this.x);

    return panelWidth;
  }

  protected getPanelHeight() {
    const scrollBarSize = this.spreadsheet.theme.scrollBar!.size;
    const { height: canvasHeight } = this.spreadsheet.options;
    const panelHeight = Math.max(0, canvasHeight! - this.y - scrollBarSize!);

    return panelHeight;
  }
}
