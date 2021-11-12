import { BaseBBox } from './baseBBox';

export class PanelBBox extends BaseBBox {
  calculateBBox() {
    const { rowsHierarchy, colsHierarchy } = this.layoutResult;
    this.originalWidth = Math.floor(rowsHierarchy.width);
    this.originalHeight = Math.floor(colsHierarchy.height);

    const { cornerBBox } = this.facet;
    const cornerPosition = {
      x: Math.floor(cornerBBox.maxX),
      y: Math.floor(cornerBBox.maxY),
    };

    const scrollBarSize = this.spreadsheet.theme.scrollBar.size;
    const { width: canvasWidth, height: canvasHeight } =
      this.facet.getCanvasHW();

    let panelWidth = canvasWidth - cornerPosition.x - scrollBarSize;
    let panelHeight = canvasHeight - cornerPosition.y - scrollBarSize;

    const realWidth = this.facet.getRealWidth();
    const realHeight = this.facet.getRealHeight();

    panelWidth = Math.abs(Math.floor(Math.min(panelWidth, realWidth)));
    panelHeight = Math.abs(Math.floor(Math.min(panelHeight, realHeight)));

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
