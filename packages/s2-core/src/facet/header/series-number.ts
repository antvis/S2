import { RowCell, SeriesNumberCell } from '../../cell';
import type { SpreadSheet } from '../../sheet-type/index';
import type { PanelBBox } from '../bbox/panelBBox';
import { Node } from '../layout/node';
import { getFrozenRowCfgPivot } from '../utils';
import { BaseFrozenRowHeader } from './base-frozen-row';

export class SeriesNumberHeader extends BaseFrozenRowHeader {
  /**
   * Get seriesNumber header by config
   * @param viewportBBox
   * @param seriesNumberWidth
   * @param leafNodes
   * @param spreadsheet
   * @param cornerWidth
   */
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
    return new SeriesNumberHeader({
      width: cornerWidth,
      height,
      viewportWidth: cornerWidth,
      viewportHeight: enableFrozenFirstRow
        ? viewportHeight - frozenRowHeight
        : viewportHeight,
      position: { x: 0, y: viewportBBox.y },
      data: seriesNodes,
      spreadsheet,
      // There are no other lines before the serial number row
      seriesNumberWidth: 0,
      hierarchyType: spreadsheet.options.hierarchyType,
      linkFields: [],
    });
  }

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
  }
}
