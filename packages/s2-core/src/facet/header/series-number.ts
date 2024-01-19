import { Rect } from '@antv/g';
import { each } from 'lodash';
import { SeriesNumberCell } from '../../cell/series-number-cell';
import type { SpreadSheet } from '../../sheet-type/index';
import type { PanelBBox } from '../bbox/panel-bbox';
import type { Hierarchy } from '../layout/hierarchy';
import type { Node } from '../layout/node';
import { translateGroup } from '../utils';
import { S2Event } from '../../common';
import { BaseHeader } from './base';
import type { BaseHeaderConfig } from './interface';
import { getSeriesNumberNodes } from './util';

export class SeriesNumberHeader extends BaseHeader<BaseHeaderConfig> {
  constructor(config: BaseHeaderConfig) {
    super(config);
  }

  protected getCellInstance(node: Node) {
    const headerConfig = this.getHeaderConfig();
    const { spreadsheet } = headerConfig;
    const { seriesNumberCell } = spreadsheet.options;

    return (
      seriesNumberCell?.(node, spreadsheet, headerConfig) ||
      new SeriesNumberCell(node, spreadsheet, headerConfig)
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
    const { width, height, viewportHeight, position, spreadsheet } =
      this.getHeaderConfig();

    this.style.clipPath = new Rect({
      style: {
        x: spreadsheet.facet.cornerBBox.x,
        y: position.y,
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
    } = this.getHeaderConfig();

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
      spreadsheet.emit(S2Event.SERIES_NUMBER_CELL_RENDER, cell);
      spreadsheet.emit(S2Event.LAYOUT_CELL_RENDER, cell);
    });
  }

  protected offset() {
    const { scrollY = 0, scrollX = 0, position } = this.getHeaderConfig();

    translateGroup(this, position.x - scrollX, position.y - scrollY);
  }

  public getNodes(): Node[] {
    const { nodes } = this.getHeaderConfig();

    return nodes || [];
  }
}
