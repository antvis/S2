<<<<<<< HEAD
import { Rect } from '@antv/g';
import { each } from 'lodash';
import { SeriesNumberCell } from '../../cell/series-number-cell';
import type { SpreadSheet } from '../../sheet-type/index';
import type { PanelBBox } from '../bbox/panelBBox';
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
=======
import { RowCell, SeriesNumberCell } from '../../cell';
import type { SpreadSheet } from '../../sheet-type/index';
import type { PanelBBox } from '../bbox/panelBBox';
import { Node } from '../layout/node';
import { getFrozenRowCfgPivot } from '../utils';
import { BaseFrozenRowHeader } from './base-frozen-row';
>>>>>>> origin/master

export class SeriesNumberHeader extends BaseFrozenRowHeader {
  /**
   * Get seriesNumber header by config
   */
<<<<<<< HEAD
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

=======
  public static getSeriesNumberHeader({
    viewportBBox,
    seriesNumberWidth,
    leafNodes,
    spreadsheet,
    cornerWidth,
  }: {
    viewportBBox: PanelBBox;
    seriesNumberWidth: number;
    leafNodes: Node[];
    spreadsheet: SpreadSheet;
    cornerWidth: number;
  }): SeriesNumberHeader {
    const { height, viewportHeight } = viewportBBox;
    const seriesNodes: Node[] = [];
    const isHierarchyTreeType = spreadsheet.isHierarchyTreeType();

    leafNodes.forEach((node: Node): void => {
      // 1、is spreadsheet and node is not total(grand or sub)
      // 2、is listSheet
      const sNode = new Node({
        id: '',
        key: '',
        value: `${seriesNodes.length + 1}`,
      });
      sNode.x = node.x;
      sNode.y = node.y;
      sNode.height = isHierarchyTreeType
        ? node.getTotalHeightForTreeHierarchy()
        : node.height;
      sNode.width = seriesNumberWidth;
      sNode.rowIndex = node.rowIndex;
      sNode.spreadsheet = spreadsheet;
      sNode.isLeaf = true;
      seriesNodes.push(sNode);
    });
    const { facet } = spreadsheet;
    const { frozenRowCount, frozenRowHeight } = getFrozenRowCfgPivot(
      spreadsheet.options,
      facet.layoutResult?.rowNodes,
    );
    const enableFrozenFirstRow = !!frozenRowCount;
>>>>>>> origin/master
    return new SeriesNumberHeader({
      width: cornerWidth,
      height,
      viewportWidth: cornerWidth,
<<<<<<< HEAD
      viewportHeight,
      position: { x: 0, y: panelBBox.y },
      nodes: layoutSeriesNumberNodes(
        rowsHierarchy,
        seriesNumberWidth,
        spreadsheet,
      ),
=======
      viewportHeight: enableFrozenFirstRow
        ? viewportHeight - frozenRowHeight
        : viewportHeight,
      position: { x: 0, y: viewportBBox.y },
      data: seriesNodes,
>>>>>>> origin/master
      spreadsheet,
      // There are no other lines before the serial number row
      seriesNumberWidth: 0,
      hierarchyType: spreadsheet.options.hierarchyType,
      linkFields: [],
    });
  }

<<<<<<< HEAD
  public clip(): void {
    const { width, height, viewportHeight } = this.getHeaderConfig();

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
=======
  public createCellInstance(node: Node): RowCell {
    const frozenRow = this.isFrozenRow(node);
    return new SeriesNumberCell(
      node,
      this.headerConfig.spreadsheet,
      {
        ...this.headerConfig,
        scrollY: frozenRow ? 0 : this.headerConfig.scrollY,
      },
      frozenRow,
    );
  }

  protected override getCustomRowCell() {
    return null;
>>>>>>> origin/master
  }
}
