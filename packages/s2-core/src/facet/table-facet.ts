import { Group } from '@antv/g';
import { isBoolean, isNumber, last, maxBy, set } from 'lodash';
import { TableColCell, TableDataCell, TableSeriesNumberCell } from '../cell';
import {
  KEY_GROUP_FROZEN_ROW_RESIZE_AREA,
  KEY_GROUP_ROW_RESIZE_AREA,
  LayoutWidthType,
  S2Event,
  SERIES_NUMBER_FIELD,
} from '../common/constant';
import { DebuggerUtil } from '../common/debug';
import type {
  FilterParam,
  LayoutResult,
  ResizeInteractionOptions,
  SortParams,
  TableSortParam,
  ViewMeta,
} from '../common/interface';
import type { TableDataSet } from '../data-set';
import type { SpreadSheet } from '../sheet-type';
import { getDataCellId } from '../utils/cell/data-cell';
import { getOccupiedWidthForTableCol } from '../utils/cell/table-col-cell';
import { getIndexRangeWithOffsets } from '../utils/facet';
import { getAllChildCells } from '../utils/get-all-child-cells';
import { getValidFrozenOptions } from '../utils/layout/frozen';
import { floor } from '../utils/math';
import { CornerBBox } from './bbox/corner-bbox';
import { FrozenFacet } from './frozen-facet';
import { ColHeader, Frame } from './header';
import { buildHeaderHierarchy } from './layout/build-header-hierarchy';
import { Hierarchy } from './layout/hierarchy';
import { layoutCoordinate } from './layout/layout-hooks';
import { Node } from './layout/node';
import { getFrozenLeafNodesCount, isFrozenTrailingRow } from './utils';
import { TableColHeader } from './header/table-col';

export class TableFacet extends FrozenFacet {
  public constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
    this.spreadsheet.on(S2Event.RANGE_SORT, this.onSortHandler);
    this.spreadsheet.on(S2Event.RANGE_FILTER, this.onFilterHandler);
  }

  private onSortHandler = (sortParams: SortParams) => {
    const s2 = this.spreadsheet;
    let params = sortParams;

    // 兼容之前 sortParams 为对象的用法
    if (!Array.isArray(sortParams)) {
      params = [sortParams];
    }

    const currentParams = s2.dataCfg.sortParams || [];

    params = params.map((item) => {
      const newItem = {
        ...item,
        // 兼容之前 sortKey 的用法
        sortFieldId: (item as TableSortParam).sortKey ?? item.sortFieldId,
      };

      const oldItem =
        currentParams.find((p) => p.sortFieldId === newItem.sortFieldId) ?? {};

      return {
        ...oldItem,
        ...newItem,
      };
    });

    const oldConfigs = currentParams.filter((config) => {
      const newItem = params.find((p) => p.sortFieldId === config.sortFieldId);

      if (newItem) {
        return false;
      }

      return true;
    });

    set(s2.dataCfg, 'sortParams', [...oldConfigs, ...params]);
    s2.setDataCfg(s2.dataCfg);
    s2.render(true);
    s2.emit(
      S2Event.RANGE_SORTED,
      (s2.dataSet as TableDataSet).getDisplayDataSet(),
    );
  };

  private onFilterHandler = async (params: FilterParam) => {
    const s2 = this.spreadsheet;
    const unFilter =
      !params.filteredValues || params.filteredValues.length === 0;

    const oldConfig = s2.dataCfg.filterParams || [];
    // check whether filter condition already exists on column, if so, modify it instead.
    const oldIndex = oldConfig.findIndex(
      (item) => item.filterKey === params.filterKey,
    );

    if (oldIndex !== -1) {
      if (unFilter) {
        // remove filter params on current key if passed an empty filterValues field
        oldConfig.splice(oldIndex, 1);
      } else {
        // if filter with same key already exists, replace it
        oldConfig[oldIndex] = params;
      }
    } else {
      oldConfig.push(params);
    }

    set(s2.dataCfg, 'filterParams', oldConfig);

    await s2.render(true);
    s2.emit(
      S2Event.RANGE_FILTERED,
      (s2.dataSet as TableDataSet).getDisplayDataSet(),
    );
  };

  get dataCellTheme() {
    return this.spreadsheet.theme.dataCell?.cell;
  }

  public destroy(): void {
    super.destroy();
    this.spreadsheet.off(S2Event.RANGE_SORT, this.onSortHandler);
    this.spreadsheet.off(S2Event.RANGE_FILTER, this.onFilterHandler);
  }

  protected calculateCornerBBox() {
    const { colsHierarchy } = this.getLayoutResult();
    const height = floor(colsHierarchy.height);

    this.cornerBBox = new CornerBBox(this);

    this.cornerBBox.height = height;
    this.cornerBBox.maxY = height;
  }

  protected doLayout(): LayoutResult {
    const rowsHierarchy = new Hierarchy();
    const { colLeafNodes, colsHierarchy } = this.buildColHeaderHierarchy();

    this.calculateColNodesCoordinate(colLeafNodes, colsHierarchy);

    return {
      colNodes: colsHierarchy.getNodes(),
      colLeafNodes,
      colsHierarchy,
      rowNodes: [],
      rowsHierarchy,
      rowLeafNodes: [],
      cornerNodes: [],
    };
  }

  private buildColHeaderHierarchy() {
    const colHierarchy = buildHeaderHierarchy({
      isRowHeader: false,
      spreadsheet: this.spreadsheet,
    });

    return {
      colLeafNodes: colHierarchy.leafNodes,
      colsHierarchy: colHierarchy.hierarchy,
    };
  }

  public getCellMeta = (rowIndex = 0, colIndex = 0) => {
    const { colLeafNodes } = this.getLayoutResult();
    const colNode = colLeafNodes[colIndex];

    if (!colNode) {
      return null;
    }

    const { showSeriesNumber } = this.spreadsheet.options;
    const cellHeight = this.getCellHeightByRowIndex(rowIndex);
    const cellRange = this.getCellRange();
    const { trailingRowCount = 0 } = getValidFrozenOptions(
      this.spreadsheet.options.frozen!,
      colLeafNodes.length,
      cellRange.end - cellRange.start + 1,
    );

    let data;

    const x = colNode.x;
    let y = this.viewCellHeights.getCellOffsetY(rowIndex);

    if (isFrozenTrailingRow(rowIndex, cellRange.end, trailingRowCount)) {
      y =
        this.panelBBox.height -
        this.getTotalHeightForRange(rowIndex, cellRange.end);
    }

    if (showSeriesNumber && colNode.field === SERIES_NUMBER_FIELD) {
      data = rowIndex + 1;
    } else {
      data = this.spreadsheet.dataSet.getCellData({
        query: {
          field: colNode.field,
          rowIndex,
        },
      });
    }

    return {
      spreadsheet: this.spreadsheet,
      x,
      y,
      width: colNode.width,
      height: cellHeight,
      data: {
        [colNode.field]: data,
      },
      rowIndex,
      colIndex,
      isTotals: false,
      colId: colNode.id,
      rowId: String(rowIndex),
      valueField: colNode.field,
      fieldValue: data,
      id: getDataCellId(String(rowIndex), colNode.id),
    } as ViewMeta;
  };

  private getAdaptiveColWidth(colLeafNodes: Node[]) {
    const { dataCell } = this.spreadsheet.options.style!;
    const { showSeriesNumber } = this.spreadsheet.options;

    if (this.spreadsheet.getLayoutWidthType() !== LayoutWidthType.Compact) {
      const seriesNumberWidth = this.getSeriesNumberWidth();
      const colHeaderColSize = colLeafNodes.length - (showSeriesNumber ? 1 : 0);
      const canvasW =
        this.getCanvasSize().width -
        seriesNumberWidth -
        Frame.getVerticalBorderWidth(this.spreadsheet);

      // TODO: 向下取整, 导致单元格未撑满 canvas, 在冻结情况下会有问题, 待冻结重构后解决
      return Math.max(
        dataCell?.width!,
        floor(canvasW / Math.max(1, colHeaderColSize)),
      );
    }

    return dataCell?.width ?? 0;
  }

  public getContentHeight(): number {
    const { getTotalHeight } = this.getViewCellHeights();
    const { colsHierarchy } = this.layoutResult;

    return getTotalHeight() + colsHierarchy.height;
  }

  protected getColNodeHeight(colNode: Node, colsHierarchy: Hierarchy) {
    const colCell = new TableColCell(colNode, this.spreadsheet, {
      shallowRender: true,
    });
    const defaultHeight = this.getDefaultColNodeHeight(colNode, colsHierarchy);

    return this.getCellAdaptiveHeight(colCell, defaultHeight);
  }

  private calculateColNodesCoordinate(
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
  ) {
    this.updateColsHierarchySampleMaxHeightNodes(colsHierarchy);

    let preLeafNode = Node.blankNode();
    let currentCollIndex = 0;

    const allNodes = colsHierarchy.getNodes();
    const adaptiveColWidth = this.getAdaptiveColWidth(colLeafNodes);

    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];

      if (currentNode.isLeaf) {
        currentNode.colIndex = currentCollIndex;
        currentCollIndex += 1;
        currentNode.x = preLeafNode.x + preLeafNode.width;
        currentNode.width = this.calculateColLeafNodesWidth(
          currentNode,
          adaptiveColWidth,
        );
        layoutCoordinate(this.spreadsheet, null, currentNode);
        colsHierarchy.width += currentNode.width;
        preLeafNode = currentNode;
      }

      if (currentNode.level === 0) {
        currentNode.y = 0;
      } else {
        currentNode.y =
          currentNode?.parent?.y! + currentNode?.parent?.height! ?? 0;
      }

      currentNode.height = this.getColNodeHeight(currentNode, colsHierarchy);
    }

    const topLevelNodes = colsHierarchy.getNodes(0);
    const { trailingColCount = 0 } = getValidFrozenOptions(
      this.spreadsheet.options.frozen!,
      topLevelNodes.length,
    );

    preLeafNode = Node.blankNode();

    const width =
      this.getCanvasSize().width -
      Frame.getVerticalBorderWidth(this.spreadsheet);

    if (trailingColCount > 0) {
      const { trailingColCount: realFrozenTrailingColCount } =
        getFrozenLeafNodesCount(topLevelNodes, 0, trailingColCount);
      const leafNodes = allNodes.filter((node) => node.isLeaf);

      for (let i = 1; i <= realFrozenTrailingColCount; i++) {
        const currentNode = leafNodes[leafNodes.length - i];

        if (i === 1) {
          currentNode.x = width - currentNode.width;
        } else {
          currentNode.x = preLeafNode.x - currentNode.width;
        }

        preLeafNode = currentNode;
      }
    }

    this.updateCustomFieldsSampleNodes(colsHierarchy);
    this.adjustColLeafNodesHeight({
      leafNodes: colLeafNodes,
      hierarchy: colsHierarchy,
    });
    this.autoCalculateColNodeWidthAndX(colLeafNodes);
  }

  /**
   * Auto column no-leaf node's width and x coordinate
   * @param colLeafNodes
   */
  private autoCalculateColNodeWidthAndX(colLeafNodes: Node[]) {
    let prevColParent = null;
    const leafNodes = colLeafNodes.slice(0);

    while (leafNodes.length) {
      const node = leafNodes.shift();
      const parent = node?.parent;

      if (prevColParent !== parent && parent) {
        leafNodes.push(parent);
        // parent's x = first child's x
        parent.x = parent.children[0].x;
        // parent's width = all children's width
        parent.width = parent.children
          .map((childNode) => childNode.width)
          .reduce((sum, current) => sum + current, 0);
        prevColParent = parent;
      }
    }
  }

  private calculateColLeafNodesWidth(
    colNode: Node,
    adaptiveColWidth: number,
  ): number {
    const { spreadsheet } = this;
    const { dataSet } = spreadsheet;
    const { colCell } = spreadsheet.options.style!;
    const layoutWidthType = spreadsheet.getLayoutWidthType();
    const cellDraggedWidth = this.getColCellDraggedWidth(colNode);

    // 1. 拖拽后的宽度优先级最高
    if (isNumber(cellDraggedWidth)) {
      return cellDraggedWidth;
    }

    // 2. 其次是自定义, 返回 null 则使用默认宽度
    const cellCustomWidth = this.getCellCustomSize(colNode, colCell?.width);

    if (isNumber(cellCustomWidth)) {
      return cellCustomWidth;
    }

    let colWidth: number;

    if (layoutWidthType === LayoutWidthType.Compact) {
      const datas = dataSet.getDisplayDataSet();
      const formatter = dataSet.getFieldFormatter(colNode.field);

      // 采样前50，找出表身最长的数据
      const maxLabel = maxBy(
        datas
          ?.slice(0, 50)
          .map(
            (data) =>
              `${formatter?.(data[colNode.field]) ?? data[colNode.field]}`,
          ),
        (label) => spreadsheet.measureTextWidthRoughly(label),
      );

      DebuggerUtil.getInstance().logger(
        'Max Label In Col:',
        colNode.field,
        maxLabel,
      );

      const { bolderText: colCellTextStyle } = spreadsheet.theme.colCell!;
      const { text: dataCellTextStyle, cell: cellStyle } =
        spreadsheet.theme.dataCell!;

      // 额外添加一像素余量，防止 maxLabel 有多个同样长度情况下，一些 label 不能展示完全
      const EXTRA_PIXEL = 1;
      const maxLabelWidth =
        spreadsheet.measureTextWidth(maxLabel, dataCellTextStyle) +
        cellStyle!.padding!.left! +
        cellStyle!.padding!.right! +
        EXTRA_PIXEL;

      // 计算表头 label+icon 占用的空间
      const colHeaderNodeWidth =
        spreadsheet.measureTextWidth(colNode.value, colCellTextStyle) +
        getOccupiedWidthForTableCol(
          this.spreadsheet,
          colNode,
          spreadsheet.theme.colCell!,
        );

      colWidth = Math.max(colHeaderNodeWidth, maxLabelWidth);
    } else {
      colWidth = adaptiveColWidth;
    }

    if (colNode.field === SERIES_NUMBER_FIELD) {
      colWidth = this.getSeriesNumberWidth();
    }

    return colWidth;
  }

  public getViewCellHeights() {
    const defaultCellHeight = this.getDefaultCellHeight();

    return {
      getTotalHeight: () => {
        if (this.rowOffsets) {
          return last(this.rowOffsets) || 0;
        }

        return (
          defaultCellHeight *
          this.spreadsheet.dataSet.getDisplayDataSet().length
        );
      },

      getCellOffsetY: (offset: number) => {
        if (offset <= 0) {
          return 0;
        }

        if (this.rowOffsets) {
          return this.rowOffsets[offset];
        }

        return offset * defaultCellHeight;
      },

      getTotalLength: () => this.spreadsheet.dataSet.getDisplayDataSet().length,

      getIndexRange: (minHeight: number, maxHeight: number) => {
        if (this.rowOffsets) {
          return getIndexRangeWithOffsets(
            this.rowOffsets,
            minHeight,
            maxHeight,
          );
        }

        const yMin = floor(minHeight / defaultCellHeight, 0);
        // 防止数组index溢出导致报错
        const yMax =
          maxHeight % defaultCellHeight === 0
            ? maxHeight / defaultCellHeight - 1
            : floor(maxHeight / defaultCellHeight, 0);

        return {
          start: Math.max(0, yMin),
          end: Math.max(0, yMax),
        };
      },
    };
  }

  protected updateRowResizeArea() {
    const { resize } = this.spreadsheet.options.interaction!;

    const shouldDrawResize = isBoolean(resize)
      ? resize
      : (resize as ResizeInteractionOptions)?.rowCellVertical;

    if (!shouldDrawResize) {
      return;
    }

    const rowResizeGroup = this.foregroundGroup.getElementById<Group>(
      KEY_GROUP_ROW_RESIZE_AREA,
    );
    const rowResizeFrozenGroup = this.foregroundGroup.getElementById<Group>(
      KEY_GROUP_FROZEN_ROW_RESIZE_AREA,
    );

    if (rowResizeGroup) {
      rowResizeGroup.removeChildren();
    }

    if (rowResizeFrozenGroup) {
      rowResizeFrozenGroup.removeChildren();
    }

    const cells = getAllChildCells<TableDataCell>(
      this.panelGroup.children as TableDataCell[],
      TableDataCell,
    );

    cells.forEach((cell) => {
      cell.drawResizeArea();
    });
  }

  protected getRowHeader() {
    return null;
  }

  protected getColHeader(): ColHeader {
    if (!this.columnHeader) {
      const { x, width, viewportHeight, viewportWidth } = this.panelBBox;

      return new TableColHeader({
        width,
        height: this.cornerBBox.height,
        viewportWidth,
        viewportHeight,
        cornerWidth: this.cornerBBox.width,
        position: { x, y: 0 },
        nodes: this.getColNodes(),
        sortParam: this.spreadsheet.store.get('sortParam'),
        spreadsheet: this.spreadsheet,
      });
    }

    return this.columnHeader;
  }

  protected getSeriesNumberHeader() {
    return null;
  }

  /**
   * 获取序号单元格
   * @description 明细表序号单元格是基于 DataCell 实现
   */
  public getSeriesNumberCells(): TableSeriesNumberCell[] {
    return this.getDataCells().filter((cell) => {
      return cell.getMeta().valueField === SERIES_NUMBER_FIELD;
    }) as TableSeriesNumberCell[];
  }
}
