import { Rect } from '@antv/g';
import { each, isEmpty } from 'lodash';
import { SeriesNumberCell } from '../../cell/series-number-cell';
import type { SpreadSheet } from '../../sheet-type/index';
import type { PanelBBox } from '../bbox/panelBBox';
import { translateGroup } from '../utils';
import type { Hierarchy } from '../layout/hierarchy';
import type { S2CellType } from '../../common/interface';
import type { Node } from '../layout/node';
import { BaseHeader } from './base';
import type { BaseHeaderConfig } from './interface';
import { getSeriesNumberNodes } from './util';

export class SeriesNumberHeader extends BaseHeader<BaseHeaderConfig> {
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

    const layoutSeriesNumberNodes =
      spreadsheet.options?.layoutSeriesNumberNodes ?? getSeriesNumberNodes;

    return new SeriesNumberHeader({
      width: cornerWidth,
      height,
      viewportWidth: cornerWidth,
      viewportHeight,
      position: { x: 0, y: panelBBox.y },
      nodes: layoutSeriesNumberNodes(
        rowsHierarchy,
        seriesNumberWidth,
        spreadsheet,
      ),
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
      nodes,
      scrollY = 0,
      viewportHeight,
      spreadsheet,
    } = this.headerConfig;
    const seriesNumberCell = spreadsheet?.options?.seriesNumberCell;

    each(nodes, (node) => {
      const { y, height: cellHeight } = node;
      const isHeaderCellInViewport = this.isHeaderCellInViewport({
        cellPosition: y,
        cellSize: cellHeight,
        viewportPosition: scrollY,
        viewportSize: viewportHeight,
      });
      // 按需渲染：视窗内的才渲染

      if (!isHeaderCellInViewport) {
        return;
      }

      let cell: S2CellType | null = null;

      if (seriesNumberCell) {
        cell = seriesNumberCell(node, spreadsheet, this.headerConfig);
      }

      if (isEmpty(cell)) {
        cell = new SeriesNumberCell(node, spreadsheet, this.headerConfig);
      }

      node.belongsCell = cell;
      this.appendChild(cell);
    });
  }

  protected offset() {
    const { scrollY = 0, scrollX = 0, position } = this.headerConfig;

    translateGroup(this, position.x - scrollX, position.y - scrollY);
  }

  public getNodes(): Node[] {
    return this.headerConfig.nodes || [];
  }
}
