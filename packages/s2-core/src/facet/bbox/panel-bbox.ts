import { floor } from '../../utils/math';
import { Frame } from '../header/frame';
import { BaseBBox } from './base-bbox';

export class PanelBBox extends BaseBBox {
  calculateBBox() {
    this.originalWidth = this.facet.getRealWidth();
    this.originalHeight = this.facet.getRealHeight();

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

    const scrollBarSize = this.spreadsheet.theme.scrollBar!.size;
    const { width: canvasWidth, height: canvasHeight } =
      this.spreadsheet.options;

    const panelWidth = Math.max(0, canvasWidth! - this.x);
    const panelHeight = Math.max(0, canvasHeight! - this.y - scrollBarSize!);

    this.width = panelWidth;
    this.height = panelHeight;
    this.viewportHeight = Math.abs(
      floor(Math.min(panelHeight, this.originalHeight)),
    );
    this.viewportWidth = Math.abs(
      floor(Math.min(panelWidth, this.originalWidth)),
    );
    this.maxX = this.x + this.viewportWidth;
    this.maxY = this.y + this.viewportHeight;
  }
}
