import {
  CellData,
  EXTRA_FIELD,
  Node,
  ORIGIN_FIELD,
  PivotFacet,
  ScrollType,
  getAllChildCells,
  getCellWidth,
  getDataCellId,
  getHeaderTotalStatus,
  round,
  type FrameConfig,
  type LayoutResult,
  type S2CellType,
  type ScrollChangeParams,
  type SelectedIds,
  type ViewMeta,
} from '@antv/s2';
import {
  concat,
  floor,
  get,
  isEmpty,
  isNumber,
  last,
  merge,
  sum,
} from 'lodash';
import {
  KEY_GROUP_COL_AXIS_RESIZE_AREA,
  KEY_GROUP_ROW_AXIS_RESIZE_AREA,
  X_FIELD_FORMATTER,
} from '../constant';
import { AxisColHeader } from '../header/axis-col';
import { AxisCornerHeader } from '../header/axis-corner';
import { AxisRowHeader } from '../header/axis-row';
import { CornerHeader } from '../header/corner';

import { AxisColCell } from '../cell/axis-col-cell';
import { AxisCornerCell } from '../cell/axis-corner-cell';
import { AxisRowCell } from '../cell/axis-row-cell';
import { AxisCellType } from '../cell/cell-type';
import type { PivotChartSheet } from '../pivot-chart-sheet';
import { separateRowColLeafNodes } from '../utils/separate-axis';
import { CornerBBox } from './corner-bbox';
import { Frame } from './frame';
import { PanelBBox } from './panel-bbox';

export class PivotChartFacet extends PivotFacet {
  declare spreadsheet: PivotChartSheet;

  axisRowHeader: AxisRowHeader | null;

  axisColumnHeader: AxisColHeader | null;

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
    const isPolar = this.spreadsheet.isPolarCoordinate();

    const size =
      !isValueInCols && !isPolar
        ? get(colNode.relatedNode, 'children', []).length
        : 1;

    return size;
  }

  protected getRowLeafNodeRelatedCount(rowNode: Node) {
    const isValueInCols = this.spreadsheet.isValueInCols();
    const isPolar = this.spreadsheet.isPolarCoordinate();

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

    return round(rowCell?.widthByField?.[lastRow] ?? 0);
  }

  protected getColAxisHeight() {
    const { colCell } = this.spreadsheet.options.style!;

    const { columns = [] } = this.spreadsheet.dataSet.fields;
    const lastCol = last(columns) as string;

    return round(colCell?.heightByField?.[lastCol] ?? 0);
  }

  protected override getCompactGridColNodeWidth(colNode: Node) {
    const { dataCell } = this.spreadsheet.options.style!;
    const dataCellWidth = getCellWidth(
      dataCell!,
      this.getColLeafNodeRelatedCount(colNode),
    );

    return round(dataCellWidth);
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
      return round(
        currentSize *
          Math.max(getCellWidth(dataCell!), floor(availableWidth / colSize)),
      );
    }

    return round(
      currentSize *
        Math.max(
          getCellWidth(dataCell!),
          floor((availableWidth - rowHeaderWidth) / colHeaderColSize),
        ),
    );
  }

  protected getRowLeafNodeHeight(rowLeafNode: Node) {
    const customHeight = this.getCustomRowCellHeight(rowLeafNode);

    // 1. 拖拽后的宽度优先级最高
    if (isNumber(customHeight)) {
      return round(customHeight);
    }

    const { dataCell } = this.spreadsheet.options.style!;
    const dataCellHeight = round(dataCell?.height ?? 0);

    return this.getRowLeafNodeRelatedCount(rowLeafNode) * dataCellHeight;
  }

  protected calculateAxisHierarchyCoordinate(layoutResult: LayoutResult) {
    this.adjustTotalNodesCoordinateAfterSeparateAxisHierarchy(layoutResult);
    this.calculateAxisRowsHierarchyCoordinate(layoutResult);
    this.calculateAxisColsHierarchyCoordinate(layoutResult);
  }

  protected adjustTotalNodesCoordinateAfterSeparateAxisHierarchy(
    layoutResult: LayoutResult,
  ) {
    // 最后一个维度分离出去后，再存在总计、小计分组时，会存在总计、小计格子出现空缺，因为 pivot-facet 层是按照未拆分的逻辑做的补全。
    // 拆分后需要再处理一下，而且只需要针对维度拆分的部分做处理即可，指标拆分正常显示

    const { rowsHierarchy, colsHierarchy } = layoutResult;

    if (
      !isEmpty(this.spreadsheet.options.totals?.row) &&
      this.spreadsheet.isValueInCols()
    ) {
      const sampleNodeForLastLevel = rowsHierarchy.sampleNodeForLastLevel!;
      const maxX = sampleNodeForLastLevel.x + sampleNodeForLastLevel.width;

      rowsHierarchy.getLeaves().forEach((leaf) => {
        const rightX = leaf.x + leaf.width;

        if (maxX > rightX) {
          leaf.width += maxX - rightX;
        }
      });
    }

    if (
      !isEmpty(this.spreadsheet.options.totals?.col) &&
      !this.spreadsheet.isValueInCols()
    ) {
      const sampleNodeForLastLevel = colsHierarchy.sampleNodeForLastLevel!;
      const maxY = sampleNodeForLastLevel.y + sampleNodeForLastLevel.height;

      colsHierarchy.getLeaves().forEach((leaf) => {
        const bottomY = leaf.y + leaf.height;

        if (maxY > bottomY) {
          leaf.height += maxY - bottomY;
        }
      });
    }
  }

  protected calculateAxisRowsHierarchyCoordinate(layoutResult: LayoutResult) {
    const { rowsHierarchy, axisRowsHierarchy } = layoutResult;

    if (!axisRowsHierarchy) {
      return;
    }

    const isValueInCols = this.spreadsheet.isValueInCols();
    const isPolar = this.spreadsheet.isPolarCoordinate();

    rowsHierarchy.width =
      rowsHierarchy.isPlaceholder && isValueInCols && !isPolar
        ? 0
        : rowsHierarchy.width;

    const rowAxisWidth = this.getRowAxisWidth();

    rowsHierarchy.getLeaves().forEach((leaf) => {
      const relatedNode = leaf.relatedNode;

      if (!relatedNode) {
        return;
      }

      relatedNode.y = leaf.y;
      relatedNode.width = rowAxisWidth;
      relatedNode.height = leaf.height;
    });

    if (isValueInCols && isPolar) {
      axisRowsHierarchy.width = 0;
      axisRowsHierarchy.getNodes().forEach((node) => {
        node.width = 0;
      });
    } else {
      axisRowsHierarchy.width = rowAxisWidth;
    }

    axisRowsHierarchy.height = rowsHierarchy.height;
  }

  protected calculateAxisColsHierarchyCoordinate(layoutResult: LayoutResult) {
    const { colsHierarchy, axisColsHierarchy } = layoutResult;

    if (!axisColsHierarchy) {
      return;
    }

    const isValueInCols = this.spreadsheet.isValueInCols();
    const isPolar = this.spreadsheet.isPolarCoordinate();

    const colAxisHeight = this.getColAxisHeight();

    colsHierarchy.getLeaves().forEach((leaf) => {
      const relatedNode = leaf.relatedNode;

      if (!relatedNode) {
        return;
      }

      relatedNode.x = leaf.x;
      relatedNode.width = leaf.width;
      relatedNode.height = colAxisHeight;
    });

    axisColsHierarchy.width = colsHierarchy.width;

    if (!isValueInCols && isPolar) {
      axisColsHierarchy.height = 0;
      axisColsHierarchy.getNodes().forEach((node) => {
        node.height = 0;
      });
    } else {
      axisColsHierarchy.height = colAxisHeight;
    }
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

    this.axisColumnHeader = this.getAxisColHeader();
    if (this.axisColumnHeader) {
      this.foregroundGroup.appendChild(this.axisColumnHeader);
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
    if (this.axisColumnHeader) {
      return this.axisColumnHeader;
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

    this.axisColumnHeader?.onColScroll(scrollX, KEY_GROUP_COL_AXIS_RESIZE_AREA);

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

        let xValue;
        let xValueShouldFormatter = true;

        if (rowChild.field === EXTRA_FIELD) {
          xValue = colChild.value;
          xValueShouldFormatter = !colChild.isTotalRoot;
        } else {
          xValue = rowChild.value;
          xValueShouldFormatter = !rowChild.isTotalRoot;
        }

        const origin = {
          [xField]: xValue,
          [X_FIELD_FORMATTER]: xValueShouldFormatter,
          ...current?.[ORIGIN_FIELD],
        };

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

  public getAxisCornerCells(): AxisCornerCell[] {
    const headerChildren = (this.getAxisCornerHeader()?.children ||
      []) as AxisCornerCell[];

    return getAllChildCells(headerChildren, AxisCornerCell).filter(
      (cell: S2CellType) =>
        cell.cellType === (AxisCellType.AXIS_CORNER_CELL as any),
    );
  }

  public getAxisRowCells(): AxisRowCell[] {
    const headerChildren = (this.getAxisRowHeader()?.children ||
      []) as AxisRowCell[];

    return getAllChildCells(headerChildren, AxisRowCell).filter(
      (cell: S2CellType) =>
        cell.cellType === (AxisCellType.AXIS_ROW_CELL as any),
    );
  }

  public getAxisColCells(): AxisColCell[] {
    const headerChildren = (this.getAxisColHeader()?.children ||
      []) as AxisColCell[];

    return getAllChildCells(headerChildren, AxisColCell).filter(
      (cell: S2CellType) =>
        cell.cellType === (AxisCellType.AXIS_COL_CELL as any),
    );
  }

  /**
   * 获取表头单元格 (序号,角头,行头,列头) (不含可视区域)
   * @example 获取全部: facet.getHeaderCells()
   * @example 获取一组 facet.getHeaderCells(['root[&]浙江省[&]宁波市', 'root[&]浙江省[&]杭州市'])
   */
  public getHeaderCells(
    cellIds?: string[] | SelectedIds,
  ): S2CellType<ViewMeta>[] {
    const headerCells = concat<S2CellType>(
      this.getCornerCells(),
      this.getSeriesNumberCells(),
      this.getRowCells(),
      this.getColCells(),
      this.getAxisCornerCells(),
      this.getAxisRowCells(),
      this.getAxisColCells(),
    );

    return this.filterCells(headerCells, cellIds);
  }

  public getAxisCornerNodes(): Node[] {
    return this.axisCornerHeader?.getNodes() || [];
  }

  public getAxisRowNodes(): Node[] {
    return this.axisRowHeader?.getNodes() || [];
  }

  public getAxisColNodes(): Node[] {
    return this.axisColumnHeader?.getNodes() || [];
  }

  /**
   * 获取表头节点 (角头,序号,行头,列头) (含可视区域)
   * @example 获取全部: facet.getHeaderNodes()
   * @example 获取一组 facet.getHeaderNodes(['root[&]浙江省[&]宁波市', 'root[&]浙江省[&]杭州市'])
   */
  public getHeaderNodes(nodeIds?: string[]): Node[] {
    const headerNodes = concat<Node>(
      this.getCornerNodes(),
      this.getSeriesNumberNodes(),
      this.getRowNodes(),
      this.getColNodes(),
      this.getAxisCornerNodes(),
      this.getAxisRowNodes(),
      this.getAxisColNodes(),
    );

    if (!nodeIds) {
      return headerNodes;
    }

    return headerNodes.filter((node) => nodeIds.includes(node.id));
  }

  /**
   * 获取单元格的所有子节点 (含非可视区域)
   * @example
   * const rowCell = facet.getRowCells()[0]
   * facet.getCellChildrenNodes(rowCell)
   */
  public getCellChildrenNodes = (cell: S2CellType): Node[] => {
    const selectNode = cell?.getMeta?.() as Node;

    return Node.getAllChildrenNodes(selectNode, (node) => {
      // 行列头区域，也把对应的 axis 区域 node 返回
      return node.relatedNode ? [node, node.relatedNode] : [node];
    });
  };
}
