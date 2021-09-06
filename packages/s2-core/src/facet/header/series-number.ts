import { Node } from '@/facet/layout/node';
import { SpreadSheet } from '@/sheet-type/index';
import { renderRect } from '@/utils/g-renders';
import { measureTextWidth } from '@/utils/text';
import { getAdjustPosition } from '@/utils/text-absorption';
import { BBox, IGroup, IShape } from '@antv/g-canvas';
import { each } from 'lodash';
import { Padding, ViewMeta } from '@/common/interface';
import { translateGroup } from '../utils';
import { BaseHeader, BaseHeaderConfig } from './base';

export class SeriesNumberHeader extends BaseHeader<BaseHeaderConfig> {
  private backgroundShape: IShape;

  /**
   * Get seriesNumber header by config
   * @param viewportBBox
   * @param seriesNumberWidth
   * @param leafNodes
   * @param spreadsheet
   * @param cornerWidth
   */

  public static getSeriesNumberHeader(
    viewportBBox: BBox,
    seriesNumberWidth: number,
    leafNodes: Node[],
    spreadsheet: SpreadSheet,
    cornerWidth: number,
  ): SeriesNumberHeader {
    const { width, height } = viewportBBox;
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
      viewportWidth: width,
      viewportHeight: height,
      position: { x: 0, y: viewportBBox.y },
      data: seriesNodes,
      offset: 0,
      spreadsheet,
    });
  }

  constructor(cfg: BaseHeaderConfig) {
    super(cfg);
  }

  public clip(): void {}

  public layout() {
    const { data, offset, height, spreadsheet } = this.headerConfig;
    if (spreadsheet.isPivotMode) {
      //  添加矩形背景
      this.addBackGround();
    }

    const borderGroup = this.addGroup();
    each(data, (item: any) => {
      const { y, height: cellHeight, isLeaf } = item;
      const isHeaderCellInViewport = this.isHeaderCellInViewport(
        y,
        cellHeight,
        offset,
        height,
      );
      if (isHeaderCellInViewport) {
        // 按需渲染：视窗内的才渲染
        const group = this.addGroup();

        // 添加文本
        this.addText(group, item);

        this.add(group);

        // 添加边框
        if (!isLeaf) {
          this.addBottomBorder(borderGroup, item);
        }
      }
    });
  }

  protected offset() {
    const { scrollY, scrollX, position } = this.headerConfig;
    translateGroup(this, position.x - scrollX, position.y - scrollY);
    if (this.backgroundShape) {
      this.backgroundShape.translate(position.x, position.y + scrollY);
    }
  }

  private addBackGround() {
    const rowCellTheme = this.headerConfig.spreadsheet.theme.rowCell.cell;
    const { position, width, height } = this.headerConfig;

    this.backgroundShape = renderRect(this, {
      x: position.x,
      y: -position.y,
      width,
      height,
      fill: rowCellTheme.backgroundColor,
      stroke: 'transparent',
      opacity: rowCellTheme.backgroundColorOpacity,
    });
  }

  private addBottomBorder(group: IGroup, cellData) {
    const { position, width } = this.headerConfig;
    const { x, y } = cellData;
    group.addShape('line', {
      attrs: {
        x1: x,
        y1: y,
        x2: position.x + width,
        y2: y,
        stroke:
          this.headerConfig.spreadsheet.theme.rowCell.cell
            .horizontalBorderColor,
        lineWidth: 1,
      },
    });
  }

  private addText(group: IGroup, cellData: ViewMeta) {
    const { offset, height } = this.headerConfig;
    const rowCellTheme = this.headerConfig.spreadsheet.theme.rowCell;
    const {
      label,
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      isLeaf,
      isTotals,
    } = cellData;
    const padding = this.getTextPadding(label, cellWidth);
    const textStyle =
      isLeaf && !isTotals ? rowCellTheme.text : rowCellTheme.bolderText;
    const textY = getAdjustPosition(
      y + padding.top,
      cellHeight - padding.top - padding.bottom,
      offset,
      height,
      textStyle.fontSize,
    );

    group.addShape('text', {
      attrs: {
        x: x + padding.left,
        y: textY + textStyle.fontSize / 2,
        text: label,
        ...textStyle,
        cursor: 'pointer',
      },
    });
  }

  private getTextPadding(text: string, cellWidth: number): Padding {
    const rowCellTheme = this.headerConfig.spreadsheet.theme.rowCell;
    const textWidth = measureTextWidth(text, rowCellTheme.text);
    const padding = Math.max(Math.abs((cellWidth - textWidth) / 2), 4);
    return {
      ...rowCellTheme.cell.padding,
      left: padding,
      right: padding,
    };
  }
}
