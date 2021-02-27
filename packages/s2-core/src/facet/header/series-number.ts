import { SimpleBBox, IGroup } from '@antv/g-canvas';
import { each, get } from 'lodash';
import { measureTextWidth } from '../..';
import { getAdjustPosition } from '../../utils/text-absorption';
import { BaseSpreadSheet } from '../..';
import { Node } from '../..';
import { BaseHeader, BaseHeaderConfig } from './base';
import { getCellPadding } from './util';
import { translateGroup } from '../utils';

const FONT_SIZE = 12;

export class SeriesNumberHeader extends BaseHeader<BaseHeaderConfig> {
  /**
   * Get seriesNumber header by config
   * @param viewportBBox
   * @param seriesNumberWidth
   * @param leafNodes
   * @param spreadsheet
   * @param cornerWidth
   */
  public static getSeriesNumberHeader(
    viewportBBox: SimpleBBox,
    seriesNumberWidth: number,
    leafNodes: Node[],
    spreadsheet: BaseSpreadSheet,
    cornerWidth: number,
  ): SeriesNumberHeader {
    const { width, height } = viewportBBox;
    const seriesNodes: Node[] = [];
    const isSpreadsheetType = spreadsheet.isSpreadsheetType();
    leafNodes.forEach((node: Node): void => {
      // 1、is spreadsheet and node is not total(grand or sub)
      // 2、is listSheet
      if ((isSpreadsheetType && !node.isTotals) || !isSpreadsheetType) {
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

  public clip(): void {
    const { width, height, scrollX, scrollY } = this.headerConfig;
    this.setClip({
      type: 'rect',
      attrs: {
        x: scrollX,
        y: scrollY,
        width: width - scrollX,
        height: height + scrollY,
      },
    });
  }

  public layout() {
    const { data, offset, height } = this.headerConfig;
    each(data, (item: any) => {
      const { y, height: cellHeight } = item;
      const isHeaderCellInViewport = this.isHeaderCellInViewport(
        y,
        cellHeight,
        offset,
        height,
      );
      if (isHeaderCellInViewport) {
        // 按需渲染：视窗内的才渲染

        const group = this.addGroup();
        // 添加矩形背景
        this.addRect(group, item);

        // 添加文本
        this.addText(group, item);

        // group.attr({ appendInfo: item });
        this.add(group);
      }
    });
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
        // 添加边框
        if (!isLeaf) {
          this.addBottomBorder(borderGroup, item);
        }
      }
    });

    // this.addShape('rect', {
    //   attrs: {
    //     x: 0,
    //     y: 0,
    //     width,
    //     height: height + scrollY,
    //     fill: '#f0f'
    //   }
    // });
  }

  protected offset() {
    const { scrollY, scrollX, position } = this.headerConfig;
    translateGroup(this, position.x - scrollX, position.y - scrollY);
  }

  private addRect(group: IGroup, cellData) {
    const { x, y, width, height } = cellData;
    group.addShape('rect', {
      attrs: {
        fill: get(
          this.headerConfig,
          'spreadsheet.theme.header.cell.backgroundColor',
        ),
        stroke: 'transparent',
        x,
        y,
        width,
        height,
        cursor: 'pointer',
      },
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
        stroke: this.headerConfig.spreadsheet.theme.header.cell.borderColor[0],
        lineWidth: 1,
      },
    });
  }

  private addText(group: IGroup, cellData) {
    const { offset, height } = this.headerConfig;
    const {
      label,
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      isLeaf,
      isTotals,
    } = cellData;
    const padding = getCellPadding();
    const labelWidth = measureTextWidth(
      label,
      get(this.headerConfig, 'spreadsheet.theme.header.text'),
    );
    padding.left = Math.max(Math.abs((cellWidth - labelWidth) / 2), 4);
    padding.right = padding.left;
    const textStyle =
      isLeaf && !isTotals
        ? get(this.headerConfig, 'spreadsheet.theme.header.text')
        : get(this.headerConfig, 'spreadsheet.theme.header.bolderText');
    const textY = getAdjustPosition(
      y + padding.top,
      cellHeight - padding.top - padding.bottom,
      offset,
      height,
      FONT_SIZE,
    );
    group.addShape('text', {
      attrs: {
        x: x + padding.left,
        y: textY + FONT_SIZE / 2,
        text: label,
        ...textStyle,
        cursor: 'pointer',
      },
    });
  }
}
