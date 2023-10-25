import { Rect } from '@antv/g';
import { each } from 'lodash';
import { SeriesNumberCell } from '../../cell/series-number-cell';
import type { S2CellType } from '../../common/interface';
import type { SpreadSheet } from '../../sheet-type/index';
import type { PanelBBox } from '../bbox/panelBBox';
import type { Hierarchy } from '../layout/hierarchy';
import type { Node } from '../layout/node';
import { translateGroup } from '../utils';
import { BaseHeader } from './base';
import type { BaseHeaderConfig } from './interface';
import { getSeriesNumberNodes } from './util';

export class SeriesNumberHeader extends BaseHeader<BaseHeaderConfig> {
  constructor(cfg: BaseHeaderConfig) {
    super(cfg);
  }

  protected getCellInstance(node: Node): S2CellType {
    const { spreadsheet } = this.headerConfig;
    const { seriesNumberCell } = spreadsheet.options;

    return (
      seriesNumberCell?.(node, spreadsheet, this.headerConfig) ||
      new SeriesNumberCell(node, spreadsheet, this.headerConfig)
    );
  }

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
    const { nodes, scrollY = 0, viewportHeight } = this.headerConfig;

    each(nodes, (node) => {
      const { y, height: cellHeight } = node;
      const isHeaderCellInViewport = this.isHeaderCellInViewport({
        cellPosition: y,
        cellSize: cellHeight,
        viewportPosition: scrollY,
        viewportSize: viewportHeight,
      });

      if (!isHeaderCellInViewport) {
        return;
      }

      const cell = this.getCellInstance(node);

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
