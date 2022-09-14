import { Group, type DisplayObject, Rect, Text } from '@antv/g';
import { each } from 'lodash';
import { CellBorderPosition, type Padding } from '../../common/interface';
import type { SpreadSheet } from '../../sheet-type/index';
import { getBorderPositionAndStyle } from '../../utils/cell/cell';
import { renderLine, renderRect } from '../../utils/g-renders';
import { getAdjustPosition } from '../../utils/text-absorption';
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
          key: '',
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
    const { width, viewportHeight, scrollY } = this.headerConfig;
    this.style.clipPath = new Rect({
      style: {
        x: 0,
        y: scrollY,
        width,
        height: viewportHeight,
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

    if (spreadsheet.isPivotMode()) {
      //  添加矩形背景
      this.addBackGround();
    }

    const borderGroup = this.appendChild(new Group());
    each(data, (cellData) => {
      const { y, height: cellHeight, isLeaf } = cellData;
      const isHeaderCellInViewport = this.isHeaderCellInViewport({
        cellPosition: y,
        cellSize: cellHeight,
        viewportPosition: scrollY,
        viewportSize: viewportHeight,
      });
      if (isHeaderCellInViewport) {
        // 按需渲染：视窗内的才渲染
        const group = this.appendChild(new Group());

        // 添加文本
        this.addText(group, cellData);

        this.appendChild(group);

        // 添加边框
        if (!isLeaf) {
          this.addBorder(borderGroup, cellData);
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

  private addBackGround() {
    const rowCellTheme = this.getStyle()?.cell;
    const { position, width, viewportHeight } = this.headerConfig;

    this.backgroundShape = renderRect(this, {
      x: position.x,
      y: -position.y,
      width,
      height: viewportHeight,
      fill: rowCellTheme?.backgroundColor,
      stroke: 'transparent',
      opacity: rowCellTheme?.backgroundColorOpacity,
    });

    const { position: borderPosition, style: borderStyle } =
      getBorderPositionAndStyle(
        CellBorderPosition.LEFT,
        {
          x: position.x,
          y: -position.y,
          width,
          height: viewportHeight,
        },
        rowCellTheme!,
      );

    this.leftBorderShape = renderLine(this, borderPosition, borderStyle!);
  }

  private addBorder(group: Group, cellData: Node) {
    const cellTheme = this.getStyle().cell;

    const { position: horizontalPosition, style: horizontalStyle } =
      getBorderPositionAndStyle(
        CellBorderPosition.BOTTOM,
        cellData,
        cellTheme!,
      );

    renderLine(group as Group, horizontalPosition, horizontalStyle!);
  }

  private getStyle() {
    return this.headerConfig.spreadsheet.theme.rowCell!;
  }

  private addText(group: Group, cellData: Node) {
    const { scrollY = 0, viewportHeight: height } = this.headerConfig;
    const textStyle = {
      ...this.getStyle().seriesText,
      textBaseline: 'top' as const,
    };
    const { label, x, y, width: cellWidth, height: cellHeight } = cellData;
    const padding = this.getTextPadding(label, cellWidth);
    const textY = getAdjustPosition(
      y + padding.top!,
      cellHeight - padding.top! - padding.bottom!,
      scrollY,
      height,
      textStyle.fontSize!,
    );

    group.appendChild(
      new Text({
        style: {
          x: x + padding.left!,
          y: textY,
          text: label,
          ...textStyle,
          cursor: 'pointer',
        },
      }),
    );
  }

  private getTextPadding(text: string, cellWidth: number): Padding {
    const rowCellTheme = this.getStyle();
    const textWidth = this.headerConfig.spreadsheet.measureTextWidth(
      text,
      rowCellTheme?.seriesText,
    );
    const padding = Math.max(Math.abs((cellWidth - textWidth) / 2), 4);
    return {
      ...rowCellTheme?.cell?.padding,
      left: padding,
      right: padding,
    };
  }
}
