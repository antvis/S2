import {
  CellData,
  EXTRA_FIELD,
  PivotFacet,
  getDataCellId,
  type LayoutResult,
  type Node,
  type ViewMeta,
} from '@antv/s2';
import { last, merge, omit, reduce } from 'lodash';
import { getHeaderTotalStatus } from '../../../utils/dataset/pivot-data-set';
import { getIndexRangeWithOffsets } from '../../../utils/facet';
import { ColAxisHeader } from '../header/col-axis';
import { CornerHeader } from '../header/corner';
import { RowAxisHeader } from '../header/row-axis';
import { separateRowColLeafNodes } from '../utils/axis';
import { CornerBBox } from './corner-bbox';
import { PanelBBox } from './panel-bbox';

export class PivotChartFacet extends PivotFacet {
  rowAxisHeader: RowAxisHeader | null;

  colAxisHeader: ColAxisHeader | null;

  protected override doLayout(): LayoutResult {
    const layoutResult = super.doLayout();

    return separateRowColLeafNodes(layoutResult, this.spreadsheet);
  }

  protected override calculateCornerBBox(): void {
    this.cornerBBox = new CornerBBox(this, true);
  }

  protected override calculatePanelBBox = () => {
    this.panelBBox = new PanelBBox(this, true);
  };

  protected renderHeaders(): void {
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

  protected getCornerHeader(): CornerHeader {
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
    );

    this.colAxisHeader?.onColScroll(scrollX);
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
  public getCellMeta(rowIndex = 0, colIndex = 0) {
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
        });

        if (current) {
          data.push(current);
        } else {
          data.push(
            CellData.getCellData(
              {
                ...omit(dataQuery, [EXTRA_FIELD]),
                [dataQuery[EXTRA_FIELD]]: undefined,
              },
              dataQuery[EXTRA_FIELD],
            ),
          );
        }
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
      id: getDataCellId(rowAxis.id, colAxis.id),
    };

    return options.layoutCellMeta?.(cellMeta) ?? cellMeta;
  }
}
