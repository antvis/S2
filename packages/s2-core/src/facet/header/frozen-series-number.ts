import { RowCell, SeriesNumberCell } from '@antv/s2';
import type { SpreadSheet } from '../../sheet-type/index';
import type { PanelBBox } from '../bbox/panelBBox';
import { Node } from '../layout/node';
import { BaseFrozenRowHeader } from './base-frozen-row';

export class FrozenSeriesNumber extends BaseFrozenRowHeader {
  /**
   * Get seriesNumber header by config
   * @param viewportBBox
   * @param seriesNumberWidth
   * @param leafNodes
   * @param spreadsheet
   * @param cornerWidth
   */

  public static getFrozenSeriesNumberHeader({
    viewportBBox,
    seriesNumberWidth,
    leafNodes,
    spreadsheet,
    cornerWidth,
    frozenRowCount,
    frozenRowHeight,
  }: {
    viewportBBox: PanelBBox;
    seriesNumberWidth: number;
    leafNodes: Node[];
    spreadsheet: SpreadSheet;
    cornerWidth: number;
    frozenRowCount: number;
    frozenRowHeight: number;
  }): FrozenSeriesNumber {
    const { height, viewportHeight } = viewportBBox;
    const seriesNodes: Node[] = [];
    const isHierarchyTreeType = spreadsheet.isHierarchyTreeType();
    leafNodes.forEach((node: Node): void => {
      // 1、is spreadsheet and node is not total(grand or sub)
      // 2、is listSheet
      const frozenRow = frozenRowCount > 0 && node.rowIndex < frozenRowCount;
      const sNode = new Node({
        id: '',
        key: '',
        value: `${seriesNodes.length + 1}`,
      });
      sNode.x = node.x;
      sNode.y = frozenRow ? node.y : node.y - frozenRowHeight;
      sNode.height = isHierarchyTreeType
        ? node.getTotalHeightForTreeHierarchy()
        : node.height;
      sNode.width = seriesNumberWidth;
      sNode.rowIndex = node.rowIndex;
      seriesNodes.push(sNode);
    });
    return new FrozenSeriesNumber({
      width: cornerWidth,
      height,
      viewportWidth: cornerWidth,
      viewportHeight:
        frozenRowCount > 0 ? viewportHeight - frozenRowHeight : viewportHeight,
      position: { x: 0, y: viewportBBox.y },
      data: seriesNodes,
      spreadsheet,
      // There are no other lines before the serial number row
      seriesNumberWidth: 0,
      hierarchyType: spreadsheet.facet.cfg.hierarchyType,
      linkFields: [],
    });
  }

  protected createCellInstance(item: Node): RowCell {
    const frozenRow = this.isFrozenRow(item);
    const cell = new SeriesNumberCell(item, this.headerConfig.spreadsheet, {
      ...this.headerConfig,
      scrollY: frozenRow ? 0 : this.headerConfig.scrollY,
    });
    return cell;
  }
}
