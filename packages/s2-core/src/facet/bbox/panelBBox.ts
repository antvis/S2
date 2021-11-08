import { get } from 'lodash';
import { BaseBBox } from './baseBBox';

export class PanelBBox extends BaseBBox {
  calculateBBox() {
    const { rowsHierarchy, colsHierarchy } = this.layoutResult;
    this.originalWidth = Math.floor(rowsHierarchy.width);
    this.originalHeight = Math.floor(colsHierarchy.height);

    const corner = this.facet.cornerBBox;
    const br = {
      x: Math.floor(corner.maxX),
      y: Math.floor(corner.maxY),
    };
    const box = this.facet.getCanvasHW();
    let width = box.width - br.x;
    let height =
      box.height -
      br.y -
      (get(this.facet.cfg, 'spreadsheet.theme.scrollBar.size') as number);

    const realWidth = this.facet.getRealWidth();
    const realHeight = this.facet.getRealHeight();

    width = Math.floor(Math.min(width, realWidth));
    height = Math.floor(Math.min(height, realHeight));

    this.x = br.x;
    this.y = br.y;
    this.width = width;
    this.height = height;
    this.maxX = br.x + width;
    this.maxY = br.y + height;
    this.minX = br.x;
    this.minY = br.y;
  }
}
