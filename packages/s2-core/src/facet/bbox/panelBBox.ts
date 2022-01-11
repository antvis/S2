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

    const panelWidth = Math.max(0, canvasWidth - cornerPosition.x);
    const panelHeight = Math.max(
      0,
      canvasHeight - cornerPosition.y - scrollBarSize,
    );

    this.x = cornerPosition.x;
    this.y = cornerPosition.y;
    this.width = panelWidth;
    this.height = panelHeight;
    this.viewportHeight = Math.abs(
      Math.floor(Math.min(panelHeight, this.originalHeight)),
    );
    this.viewportWidth = Math.abs(
      Math.floor(Math.min(panelWidth, this.originalWidth)),
    );
    this.maxX = cornerPosition.x + this.viewportWidth;
    this.maxY = cornerPosition.y + this.viewportHeight;
    this.minX = cornerPosition.x;
    this.minY = cornerPosition.y;

    const { frozenTrailingColCount, frozenTrailingRowCount } =
      this.spreadsheet.options;
    if (frozenTrailingColCount > 0) {
      this.viewportWidth = this.width;
      this.maxX = cornerPosition.x + this.width;
    }
    if (frozenTrailingRowCount > 0) {
      this.viewportHeight = this.height;
      this.maxY = cornerPosition.y + this.height;
    }
  }
}
