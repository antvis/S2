import {
  CellData,
  EXTRA_FIELD,
  Node,
  ORIGIN_FIELD,
  PivotFacet,
  getDataCellId,
  type LayoutResult,
  type ViewMeta,
} from '@antv/s2';
import { isNumber, last, merge, reduce } from 'lodash';
import { getHeaderTotalStatus } from '../../../utils/dataset/pivot-data-set';
import { getIndexRangeWithOffsets } from '../../../utils/facet';
import {
  KEY_GROUP_COL_AXIS_RESIZE_AREA,
  KEY_GROUP_ROW_AXIS_RESIZE_AREA,
} from '../constant';
import { ColAxisHeader } from '../header/col-axis';
import { CornerHeader } from '../header/corner';
import { RowAxisHeader } from '../header/row-axis';
import { getAxisLeafNodes, separateRowColLeafNodes } from '../utils/axis';
import { CornerBBox } from './corner-bbox';
import { PanelBBox } from './panel-bbox';

export class PivotChartFacet extends PivotFacet {
  rowAxisHeader: RowAxisHeader | null;

  colAxisHeader: ColAxisHeader | null;

  protected override doLayout(): LayoutResult {
    const layoutResult = super.doLayout();

    return separateRowColLeafNodes(layoutResult, this.spreadsheet);
  }

  protected calculateHeaderNodesCoordinate(layoutResult: LayoutResult) {
    super.calculateHeaderNodesCoordinate(layoutResult);
    this.adjustAxisLeafCoordinate(layoutResult);
  }

  protected adjustAxisLeafCoordinate(layoutResult: LayoutResult) {
    // 指标置于列头时，行头的最后一个维度会被分离出来，因此 resize 的 row node 节点是倒数第二个节点，不是 leaf 节点
    // 正常的逻辑只会处理 leaf 节点，所以这里需要增加对该情况的处理，因为在 axis node 被分离出去后，该节点展示上就是叶子节点了
    // 在分离 axis node 之前处理了，就不需要在分离后既需要处理 hierarchy 又需要处理 axisHierarchy
    const { rowsHierarchy, colsHierarchy } = layoutResult;

    if (this.spreadsheet.isValueInCols()) {
      const axisNodes = getAxisLeafNodes(rowsHierarchy);

      let preLeafNode: Node;

      axisNodes.forEach((currentNode) => {
        if (preLeafNode) {
          currentNode.y = preLeafNode.y + preLeafNode.height;
        }

        const cellDraggedHeight = this.getRowCellDraggedHeight(currentNode);

        if (isNumber(cellDraggedHeight)) {
          const changeSize = cellDraggedHeight - currentNode.height;

          currentNode.height = cellDraggedHeight;
          rowsHierarchy.height += changeSize;
        }

        preLeafNode = currentNode;
      });

      this.calculateRowNodeHeightAndY(axisNodes);
    } else {
      // 另一种情况同理
      const axisNodes = getAxisLeafNodes(colsHierarchy);

      let preLeafNode: Node;

      axisNodes.forEach((currentNode) => {
        if (preLeafNode) {
          currentNode.x = preLeafNode.x + preLeafNode.width;
        }

        const cellDraggedWidth = this.getColCellDraggedWidth(currentNode);

        if (isNumber(cellDraggedWidth)) {
          const changeSize = cellDraggedWidth - currentNode.width;

          currentNode.width = cellDraggedWidth;
          colsHierarchy.width += changeSize;
        }

        preLeafNode = currentNode;
      });

      this.calculateColNodeWidthAndX(axisNodes);
    }
  }

  protected override calculateCornerBBox(): void {
    this.cornerBBox = new CornerBBox(this, true);
  }

  protected override calculatePanelBBox() {
    this.panelBBox = new PanelBBox(this, true);
  }

  protected override renderHeaders(): void {
    super.renderHeaders();
    this.rowAxisHeader = this.getRowAxisHeader();

    if (this.rowAxisHeader) {
      this.foregroundGroup.appendChild(this.rowAxisHeader);
    }

    this.colAxisHeader = this.getColAxisHeader();
    if (this.colAxisHeader) {
      this.foregroundGroup.appendChild(this.colAxisHeader);
    }
  }

  protected override getCornerHeader(): CornerHeader {
    return (
      this.cornerHeader ||
      CornerHeader.getCornerHeader({
        panelBBox: this.panelBBox,
        cornerBBox: this.cornerBBox,
        seriesNumberWidth: this.getSeriesNumberWidth(),
        layoutResult: this.layoutResult,
        spreadsheet: this.spreadsheet,
      })
    );
  }

  protected getRowAxisHeader(): RowAxisHeader | null {
    if (this.rowAxisHeader) {
      return this.rowAxisHeader;
    }

    const { y, viewportHeight, viewportWidth, height } = this.panelBBox;
    const { rowsHierarchy, rowAxisHierarchy } = this.layoutResult;
    const seriesNumberWidth = this.getSeriesNumberWidth();

    return new RowAxisHeader({
      width: this.cornerBBox.width,
      height,
      viewportWidth,
      viewportHeight,
      position: { x: seriesNumberWidth + rowsHierarchy.width, y },
      nodes: rowAxisHierarchy?.getNodes() ?? [],
      spreadsheet: this.spreadsheet,
    });
  }

  protected getColAxisHeader(): ColAxisHeader | null {
    if (this.colAxisHeader) {
      return this.colAxisHeader;
    }

    const { x, width, viewportWidth, y, viewportHeight } = this.panelBBox;
    const { colAxisHierarchy } = this.layoutResult;

    return new ColAxisHeader({
      width,
      cornerWidth: this.cornerBBox.width,
      height: colAxisHierarchy?.height ?? 0,
      viewportWidth,
      viewportHeight,
      position: { x, y: y + viewportHeight },
      nodes: colAxisHierarchy?.getNodes() ?? [],
      spreadsheet: this.spreadsheet,
    });
  }

  protected override translateRelatedGroups(
    scrollX: number,
    scrollY: number,
    hRowScroll: number,
  ): void {
    super.translateRelatedGroups(scrollX, scrollY, hRowScroll);

    this.rowAxisHeader?.onScrollXY(
      this.getRealScrollX(scrollX, hRowScroll),
      scrollY,
      KEY_GROUP_ROW_AXIS_RESIZE_AREA,
    );

    this.colAxisHeader?.onColScroll(scrollX, KEY_GROUP_COL_AXIS_RESIZE_AREA);
  }

  public getViewCellHeights() {
    const rowLeafNodes = this.layoutResult.rowAxisHierarchy?.getLeaves() ?? [];

    const heights = reduce(
      rowLeafNodes,
      (result: number[], node: Node) => {
        const currentNodeHeight = last(result) || 0;

        result.push(currentNodeHeight + node.height);

        return result;
      },
      [0],
    );

    return {
      getTotalHeight: () => last(heights) || 0,
      getCellOffsetY: (index: number) => heights[index] || 0,
      // 多了一个数据 [0]
      getTotalLength: () => heights.length - 1,
      getIndexRange: (minHeight: number, maxHeight: number) =>
        getIndexRangeWithOffsets(heights, minHeight, maxHeight),
    };
  }

  /**
   * 根据行列索引获取单元格元数据
   */
  public override getCellMeta(rowIndex = 0, colIndex = 0) {
    const { options, dataSet } = this.spreadsheet;
    const { rowAxisHierarchy, colAxisHierarchy } = this.getLayoutResult();

    const rowAxisLeafNodes = rowAxisHierarchy?.getLeaves() ?? [];
    const colAxisLeafNodes = colAxisHierarchy?.getLeaves() ?? [];

    const rowAxis = rowAxisLeafNodes[rowIndex];
    const colAxis = colAxisLeafNodes[colIndex];

    if (!rowAxis || !colAxis) {
      return null;
    }

    const data: any = [];

    const xField =
      rowAxis.field === EXTRA_FIELD ? colAxis.field : rowAxis.field;
    const yField =
      rowAxis.field === EXTRA_FIELD ? rowAxis.value : colAxis.value;

    for (const rowChild of rowAxis.children) {
      for (const colChild of colAxis.children) {
        const rowQuery = rowChild.query;
        const colQuery = colChild.query;

        const isTotals =
          rowChild.isTotals ||
          rowChild.isTotalMeasure ||
          colChild.isTotals ||
          colChild.isTotalMeasure;

        const totalStatus = getHeaderTotalStatus(rowChild, colChild);

        const dataQuery = merge({}, rowQuery, colQuery);
        const current = dataSet.getCellData({
          query: dataQuery,
          isTotals,
          totalStatus,
        }) as CellData;

        const xValue =
          rowChild.field === EXTRA_FIELD ? colChild.value : rowChild.value;

        const origin = { [xField]: xValue, ...current?.[ORIGIN_FIELD] };

        data.push(origin);
      }
    }

    const cellMeta: ViewMeta = {
      spreadsheet: this.spreadsheet,
      x: colAxis.x,
      y: rowAxis.y,
      width: colAxis.width,
      height: rowAxis.height,
      data,
      rowIndex,
      colIndex,
      rowId: rowAxis.id,
      colId: colAxis.id,
      fieldValue: data,
      valueField: yField,
      xField,
      yField,
      id: getDataCellId(rowAxis.id, colAxis.id),
    };

    return options.layoutCellMeta?.(cellMeta) ?? cellMeta;
  }
}
