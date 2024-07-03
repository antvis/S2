import {
  CellData,
  EXTRA_FIELD,
  Node,
  ORIGIN_FIELD,
  PivotFacet,
  getCellWidth,
  getDataCellId,
  type FrameConfig,
  type LayoutResult,
  type ScrollChangeParams,
  type ViewMeta,
} from '@antv/s2';
import { floor, get, isNumber, last, merge, reduce, sum } from 'lodash';
import { ScrollType } from '../../../ui/scrollbar';
import { getHeaderTotalStatus } from '../../../utils/dataset/pivot-data-set';
import { getIndexRangeWithOffsets } from '../../../utils/facet';
import {
  KEY_GROUP_COL_AXIS_RESIZE_AREA,
  KEY_GROUP_ROW_AXIS_RESIZE_AREA,
} from '../constant';
import { AxisColHeader } from '../header/axis-col';
import { AxisCornerHeader } from '../header/axis-corner';
import { AxisRowHeader } from '../header/axis-row';
import { CornerHeader } from '../header/corner';

import type { PivotChart } from '../index';
import { separateRowColLeafNodes } from '../utils/separate-axis';
import { CornerBBox } from './corner-bbox';
import { Frame } from './frame';
import { PanelBBox } from './panel-bbox';

export class PivotChartFacet extends PivotFacet {
  spreadsheet: PivotChart;

  axisRowHeader: AxisRowHeader | null;

  axisColHeader: AxisColHeader | null;

  axisCornerHeader: AxisCornerHeader | null;

  protected override doLayout(): LayoutResult {
    let layoutResult = this.buildAllHeaderHierarchy() as LayoutResult;

    layoutResult = separateRowColLeafNodes(layoutResult, this.spreadsheet);

    this.calculateHeaderNodesCoordinate(layoutResult);

    this.calculateAxisHierarchyCoordinate(layoutResult);

    const {
      rowsHierarchy,
      colsHierarchy,
      axisRowsHierarchy,
      axisColsHierarchy,
    } = layoutResult;

    return {
      axisRowsHierarchy,
      axisColsHierarchy,
      rowsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowLeafNodes: rowsHierarchy.getLeaves(),
      colsHierarchy,
      colNodes: colsHierarchy.getNodes(),
      colLeafNodes: colsHierarchy.getLeaves(),
    };
  }

  protected getColLeafNodeRelatedCount(colNode: Node) {
    const isValueInCols = this.spreadsheet.isValueInCols();
    const isPolar = this.spreadsheet.isPolarChart();

    const size =
      !isValueInCols && !isPolar
        ? get(colNode.relatedNode, 'children', []).length
        : 1;

    return size;
  }

  protected getRowLeafNodeRelatedCount(rowNode: Node) {
    const isValueInCols = this.spreadsheet.isValueInCols();
    const isPolar = this.spreadsheet.isPolarChart();

    const size =
      isValueInCols && !isPolar
        ? get(rowNode.relatedNode, 'children', []).length
        : 1;

    return size;
  }

  protected getRowAxisWidth() {
    const { rowCell } = this.spreadsheet.options.style!;

    const { rows = [] } = this.spreadsheet.dataSet.fields;
    const lastRow = last(rows) as string;

    return rowCell?.widthByField?.[lastRow] ?? 0;
  }

  protected getColAxisHeight() {
    const { colCell } = this.spreadsheet.options.style!;

    const { columns = [] } = this.spreadsheet.dataSet.fields;
    const lastCol = last(columns) as string;

    return colCell?.heightByField?.[lastCol] ?? 0;
  }

  protected override getCompactGridColNodeWidth(colNode: Node) {
    const { dataCell } = this.spreadsheet.options.style!;
    const dataCellWidth = getCellWidth(
      dataCell!,
      this.getColLeafNodeRelatedCount(colNode),
    );

    return dataCellWidth;
  }

  protected override getAdaptGridColWidth(
    colLeafNodes: Node[],
    colNode?: Node,
    rowHeaderWidth?: number,
  ) {
    const { rows = [] } = this.spreadsheet.dataSet.fields;
    const { dataCell } = this.spreadsheet.options.style!;

    const rowHeaderColSize = Math.max(0, rows.length - 1);

    const colHeaderColSize = sum(
      colLeafNodes.map((node) => this.getColLeafNodeRelatedCount(node)),
    );
    const { width } = this.getCanvasSize();
    const availableWidth =
      width -
      this.getSeriesNumberWidth() -
      this.getRowAxisWidth() -
      Frame.getVerticalBorderWidth(this.spreadsheet);

    const colSize = Math.max(1, rowHeaderColSize + colHeaderColSize);

    const currentSize = colNode ? this.getColLeafNodeRelatedCount(colNode) : 1;

    if (!rowHeaderWidth) {
      return (
        currentSize *
        Math.max(getCellWidth(dataCell!), floor(availableWidth / colSize))
      );
    }

    return (
      currentSize *
      Math.max(
        getCellWidth(dataCell!),
        floor((availableWidth - rowHeaderWidth) / colHeaderColSize),
      )
    );
  }

  protected getRowLeafNodeHeight(rowLeafNode: Node) {
    const customHeight = this.getCustomRowCellHeight(rowLeafNode);

    // 1. 拖拽后的宽度优先级最高
    if (isNumber(customHeight)) {
      return customHeight;
    }

    const { dataCell } = this.spreadsheet.options.style!;
    const dataCellHeight = dataCell?.height ?? 0;

    return this.getRowLeafNodeRelatedCount(rowLeafNode) * dataCellHeight;
  }

  protected calculateAxisHierarchyCoordinate(layoutResult: LayoutResult) {
    this.calculateAxisRowsHierarchyCoordinate(layoutResult);
    this.calculateAxisColsHierarchyCoordinate(layoutResult);
  }

  protected calculateAxisRowsHierarchyCoordinate(layoutResult: LayoutResult) {
    const { rowsHierarchy, axisRowsHierarchy } = layoutResult;

    if (!axisRowsHierarchy) {
      return;
    }

    const isValueInCols = this.spreadsheet.isValueInCols();
    const isPolar = this.spreadsheet.isPolarChart();

    rowsHierarchy.width =
      rowsHierarchy.isPlaceholder && isValueInCols && !isPolar
        ? 0
        : rowsHierarchy.width;

    const rowAxisWidth = this.getRowAxisWidth();

    axisRowsHierarchy.width = isValueInCols && isPolar ? 0 : rowAxisWidth;
    axisRowsHierarchy.height = rowsHierarchy.height;

    rowsHierarchy.getLeaves().forEach((leaf) => {
      const relatedNode = leaf.relatedNode;

      if (!relatedNode) {
        return;
      }

      relatedNode.y = leaf.y;
      relatedNode.width = rowAxisWidth;
      relatedNode.height = leaf.height;
    });
  }

  protected calculateAxisColsHierarchyCoordinate(layoutResult: LayoutResult) {
    const { colsHierarchy, axisColsHierarchy } = layoutResult;

    if (!axisColsHierarchy) {
      return;
    }

    const isValueInCols = this.spreadsheet.isValueInCols();
    const isPolar = this.spreadsheet.isPolarChart();

    const colAxisHeight = this.getColAxisHeight();

    axisColsHierarchy.width = colsHierarchy.width;
    axisColsHierarchy.height = !isValueInCols && isPolar ? 0 : colAxisHeight;

    colsHierarchy.getLeaves().forEach((leaf) => {
      const relatedNode = leaf.relatedNode;

      if (!relatedNode) {
        return;
      }

      relatedNode.x = leaf.x;
      relatedNode.width = leaf.width;
      relatedNode.height = colAxisHeight;
    });
  }

  protected override calculateCornerBBox(): void {
    this.cornerBBox = new CornerBBox(this, true);
  }

  protected override calculatePanelBBox() {
    this.panelBBox = new PanelBBox(this, true);
  }

  protected override getCenterFrame() {
    if (!this.centerFrame) {
      const { viewportWidth, viewportHeight } = this.panelBBox;
      const cornerWidth = this.cornerBBox.width;
      const cornerHeight = this.cornerBBox.height;
      const frame = this.spreadsheet.options?.frame;
      const frameCfg: FrameConfig = {
        position: {
          x: this.cornerBBox.x,
          y: this.cornerBBox.y,
        },
        cornerWidth,
        cornerHeight,
        viewportWidth,
        viewportHeight,
        showViewportLeftShadow: false,
        showViewportRightShadow: false,
        spreadsheet: this.spreadsheet,
      };

      return frame ? frame(frameCfg) : new Frame(frameCfg);
    }

    return this.centerFrame;
  }

  protected override renderHeaders(): void {
    super.renderHeaders();
    this.axisRowHeader = this.getAxisRowHeader();

    if (this.axisRowHeader) {
      this.foregroundGroup.appendChild(this.axisRowHeader);
    }

    this.axisColHeader = this.getAxisColHeader();
    if (this.axisColHeader) {
      this.foregroundGroup.appendChild(this.axisColHeader);
    }

    this.axisCornerHeader = this.getAxisCornerHeader();
    if (this.axisCornerHeader) {
      this.foregroundGroup.appendChild(this.axisCornerHeader);
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

  protected getAxisRowHeader(): AxisRowHeader | null {
    if (this.axisRowHeader) {
      return this.axisRowHeader;
    }

    const { y, viewportHeight, viewportWidth, height } = this.panelBBox;
    const { rowsHierarchy, axisRowsHierarchy } = this.layoutResult;
    const seriesNumberWidth = this.getSeriesNumberWidth();

    return new AxisRowHeader({
      width: this.cornerBBox.width,
      height,
      viewportWidth,
      viewportHeight,
      position: { x: seriesNumberWidth + rowsHierarchy.width, y },
      nodes: axisRowsHierarchy?.getNodes() ?? [],
      spreadsheet: this.spreadsheet,
    });
  }

  protected getAxisColHeader(): AxisColHeader | null {
    if (this.axisColHeader) {
      return this.axisColHeader;
    }

    const { x, width, viewportWidth, y, viewportHeight } = this.panelBBox;
    const { axisColsHierarchy } = this.layoutResult;

    return new AxisColHeader({
      width,
      cornerWidth: this.cornerBBox.width,
      height: axisColsHierarchy?.height ?? 0,
      viewportWidth,
      viewportHeight,
      position: { x, y: y + viewportHeight },
      nodes: axisColsHierarchy?.getNodes() ?? [],
      spreadsheet: this.spreadsheet,
    });
  }

  protected getAxisCornerHeader(): AxisCornerHeader | null {
    return (
      this.axisCornerHeader ||
      AxisCornerHeader.getCornerHeader({
        panelBBox: this.panelBBox,
        cornerBBox: this.cornerBBox,
        seriesNumberWidth: this.getSeriesNumberWidth(),
        layoutResult: this.layoutResult,
        spreadsheet: this.spreadsheet,
      })
    );
  }

  protected override translateRelatedGroups(
    scrollX: number,
    scrollY: number,
    hRowScroll: number,
  ): void {
    super.translateRelatedGroups(scrollX, scrollY, hRowScroll);

    this.axisRowHeader?.onScrollXY(
      this.getRealScrollX(scrollX, hRowScroll),
      scrollY,
      KEY_GROUP_ROW_AXIS_RESIZE_AREA,
    );

    this.axisColHeader?.onColScroll(scrollX, KEY_GROUP_COL_AXIS_RESIZE_AREA);

    this.axisCornerHeader?.onCorScroll(
      this.getRealScrollX(scrollX, hRowScroll),
    );
  }

  protected override renderRowScrollBar(rowHeaderScrollX: number) {
    super.renderRowScrollBar(rowHeaderScrollX);

    if (this.hRowScrollBar) {
      const maxOffset = this.cornerBBox.originalWidth - this.cornerBBox.width;

      this.hRowScrollBar.addEventListener(
        ScrollType.ScrollChange,
        ({ offset }: ScrollChangeParams) => {
          const newOffset = this.getValidScrollBarOffset(offset, maxOffset);
          const newRowHeaderScrollX = floor(newOffset);

          this.setScrollOffset({ rowHeaderScrollX: newRowHeaderScrollX });

          this.axisRowHeader?.onRowScrollX(
            newRowHeaderScrollX,
            KEY_GROUP_ROW_AXIS_RESIZE_AREA,
          );

          this.axisCornerHeader?.onRowScrollX(newRowHeaderScrollX);
        },
      );
    }
  }

  public override getViewCellHeights() {
    const rowLeafNodes = this.layoutResult.axisRowsHierarchy?.getLeaves() ?? [];

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
    const { axisRowsHierarchy, axisColsHierarchy } = this.getLayoutResult();

    const rowAxisLeafNodes = axisRowsHierarchy?.getLeaves() ?? [];
    const colAxisLeafNodes = axisColsHierarchy?.getLeaves() ?? [];

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

  protected getFrozenColSplitLineSize() {
    const { viewportHeight, y: panelBBoxStartY } = this.panelBBox;
    const { axisColsHierarchy } = this.layoutResult;
    const height =
      viewportHeight + panelBBoxStartY + (axisColsHierarchy?.height ?? 0);

    return {
      y: 0,
      height,
    };
  }
}
