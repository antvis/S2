import { BaseBBox } from './baseBBox';

export class PanelBBox extends BaseBBox {
  calculateBBox() {
    this.originalWidth = this.facet.getRealWidth();
    this.originalHeight = this.facet.getRealHeight();

    const { cornerBBox } = this.facet;
    const cornerPosition = {
      x: Math.floor(cornerBBox.maxX),
      y: Math.floor(cornerBBox.maxY),
    };

    const scrollBarSize = this.spreadsheet.theme.scrollBar.size;
    const { width: canvasWidth, height: canvasHeight } =
      this.spreadsheet.options;

    let panelWidth = Math.max(0, canvasWidth - cornerPosition.x);
    let panelHeight = Math.max(
      0,
      canvasHeight - cornerPosition.y - scrollBarSize,
    );

    panelWidth = Math.abs(Math.floor(Math.min(panelWidth, this.originalWidth)));
    panelHeight = Math.abs(
      Math.floor(Math.min(panelHeight, this.originalHeight)),
    );

    this.x = cornerPosition.x;
    this.y = cornerPosition.y;
    this.width = panelWidth;
    this.height = panelHeight;
    this.maxX = cornerPosition.x + panelWidth;
    this.maxY = cornerPosition.y + panelHeight;
    this.minX = cornerPosition.x;
    this.minY = cornerPosition.y;
  }
}
