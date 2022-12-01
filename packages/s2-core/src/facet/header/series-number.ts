import { type DisplayObject, Rect } from '@antv/g';
import { each } from 'lodash';
import { SERIES_NUMBER_FIELD } from '../../common/constant/basic';
import { SeriesNumberCell } from '../../cell/series-number-cell';
import type { SpreadSheet } from '../../sheet-type/index';
import type { PanelBBox } from '../bbox/panelBBox';
import { Node } from '../layout/node';
import { translateGroup } from '../utils';
import { BaseHeader } from './base';
import type { BaseHeaderConfig } from './interface';

export class SeriesNumberHeader extends BaseHeader<BaseHeaderConfig> {
  private backgroundShape: DisplayObject;

  private leftBorderShape: DisplayObject;

  /**
   * Get seriesNumber header by config
   */
  public static getSeriesNumberHeader(options: {
    panelBBox: PanelBBox;
    seriesNumberWidth: number;
    leafNodes: Node[];
    spreadsheet: SpreadSheet;
    cornerWidth: number;
  }): SeriesNumberHeader {
    const {
      panelBBox,
      seriesNumberWidth,
      leafNodes,
      spreadsheet,
      cornerWidth,
    } = options;

    const { height, viewportHeight } = panelBBox;
    const seriesNodes: Node[] = [];
    const isHierarchyTreeType = spreadsheet.isHierarchyTreeType();
    leafNodes.forEach((node: Node): void => {
      // 1、is spreadsheet and node is not total(grand or sub)
      // 2、is listSheet
      if (!node.isTotals || isHierarchyTreeType) {
        const sNode = new Node({
          id: '',
          key: SERIES_NUMBER_FIELD,
          rowIndex: seriesNodes.length,
          value: `${seriesNodes.length + 1}`,
        });
        sNode.x = node.x;
        sNode.y = node.y;
        sNode.height = node.height;
        sNode.width = seriesNumberWidth;
        seriesNodes.push(sNode);
      }
    });
    return new SeriesNumberHeader({
      width: cornerWidth,
      height,
      viewportWidth: cornerWidth,
      viewportHeight,
      position: { x: 0, y: panelBBox.y },
      data: seriesNodes,
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
