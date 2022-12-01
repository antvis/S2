import { type DisplayObject, Rect } from '@antv/g';
import { each } from 'lodash';
import { SeriesNumberCell } from '../../cell/series-number-cell';
import type { SpreadSheet } from '../../sheet-type/index';
import type { PanelBBox } from '../bbox/panelBBox';
import { translateGroup } from '../utils';
import type { Hierarchy } from '../layout/hierarchy';
import { BaseHeader } from './base';
import type { BaseHeaderConfig } from './interface';
import { getSeriesNumberNodes } from './util';

export class SeriesNumberHeader extends BaseHeader<BaseHeaderConfig> {
  private backgroundShape: DisplayObject;

  private leftBorderShape: DisplayObject;

  /**
   * Get seriesNumber header by config
   */
  public static getSeriesNumberHeader(options: {
    panelBBox: PanelBBox;
    seriesNumberWidth: number;
    rowsHierarchy: Hierarchy;
    spreadsheet: SpreadSheet;
    cornerWidth: number;
  }): SeriesNumberHeader {
    const {
      panelBBox,
      seriesNumberWidth,
      rowsHierarchy,
      spreadsheet,
      cornerWidth,
    } = options;
    const { height, viewportHeight } = panelBBox;
    return new SeriesNumberHeader({
      width: cornerWidth,
      height,
      viewportWidth: cornerWidth,
      viewportHeight,
      position: { x: 0, y: panelBBox.y },
      data: getSeriesNumberNodes(rowsHierarchy, seriesNumberWidth, spreadsheet),
      spreadsheet,
    });
  }

  constructor(cfg: BaseHeaderConfig) {
    super(cfg);
  }

  public clip(): void {
    const { width, height, viewportHeight } = this.headerConfig;
    this.style.clipPath = new Rect({
      style: {
        x: 0,
        y: 0,
        width,
        height: height + viewportHeight,
      },
    });
  }

  public layout() {
    const {
      data,
      scrollY = 0,
      viewportHeight,
      spreadsheet,
    } = this.headerConfig;

    each(data, (item) => {
      const { y, height: cellHeight } = item;
      const isHeaderCellInViewport = this.isHeaderCellInViewport({
        cellPosition: y,
        cellSize: cellHeight,
        viewportPosition: scrollY,
        viewportSize: viewportHeight,
      });
      if (isHeaderCellInViewport) {
        // 按需渲染：视窗内的才渲染
        const cell = new SeriesNumberCell(item, spreadsheet, this.headerConfig);
        item.belongsCell = cell;
        if (cell) {
          this.appendChild(cell);
        }
      }
    });
  }

  protected offset() {
    const { scrollY = 0, scrollX = 0, position } = this.headerConfig;
    translateGroup(this, position.x - scrollX, position.y - scrollY);
    if (this.backgroundShape) {
      this.backgroundShape.translate(position.x, position.y + scrollY);
    }
    if (this.leftBorderShape) {
      this.leftBorderShape.translate(position.x, position.y + scrollY);
    }
  }
}
