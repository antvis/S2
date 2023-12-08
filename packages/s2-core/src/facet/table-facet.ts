import type { IElement, IGroup } from '@antv/g-canvas';
import { get, isBoolean, isNumber, last, maxBy, set, values } from 'lodash';
import { TableDataCell } from '../cell';
import {
  KEY_GROUP_FROZEN_ROW_RESIZE_AREA,
  KEY_GROUP_ROW_RESIZE_AREA,
  LayoutWidthTypes,
  S2Event,
  SERIES_NUMBER_FIELD,
} from '../common/constant';
import { FrozenCellGroupMap } from '../common/constant/frozen';
import { DebuggerUtil } from '../common/debug';
import type {
  FilterParam,
  LayoutResult,
  ResizeInteractionOptions,
  SpreadSheetFacetCfg,
  TableSortParam,
  ViewMeta,
} from '../common/interface';
import type { TableDataSet } from '../data-set';
import { getDataCellId } from '../utils/cell/data-cell';
import { getOccupiedWidthForTableCol } from '../utils/cell/table-col-cell';
import { getIndexRangeWithOffsets } from '../utils/facet';
import { getAllChildCells } from '../utils/get-all-child-cells';
import { getValidFrozenOptions } from '../utils/layout/frozen';
import { CornerBBox } from './bbox/cornerBBox';
import type { SeriesNumberHeader } from './header';
import type { ColHeader } from './header/col';
import { TableColHeader } from './header/table-col';
import { buildHeaderHierarchy } from './layout/build-header-hierarchy';
import { Hierarchy } from './layout/hierarchy';
import { layoutCoordinate } from './layout/layout-hooks';
import { Node } from './layout/node';
import {
  calculateFrozenCornerCells,
  isFrozenTrailingRow,
  getFrozenLeafNodesCount,
  isTopLevelNode,
} from './utils';
import { FrozenFacet } from './frozen-facet';

export class TableFacet extends FrozenFacet {
  protected updateRowResizeArea(): void {
    const { foregroundGroup, options } = this.spreadsheet;
    const resize = get(options, 'interaction.resize');

    const shouldDrawResize = isBoolean(resize)
      ? resize
      : (resize as ResizeInteractionOptions)?.rowCellVertical;
    if (!shouldDrawResize) {
      return;
    }

    const rowResizeGroup = foregroundGroup.findById(KEY_GROUP_ROW_RESIZE_AREA);
    const rowResizeFrozenGroup = foregroundGroup.findById(
      KEY_GROUP_FROZEN_ROW_RESIZE_AREA,
    );
    if (rowResizeGroup) {
      rowResizeGroup.set('children', []);
    }
    if (rowResizeFrozenGroup) {
      rowResizeFrozenGroup.set('children', []);
    }

    const allCells = getAllChildCells<TableDataCell>(
      this.panelGroup.getChildren() as IElement[],
      TableDataCell,
    ).filter((cell: TableDataCell) => cell.shouldDrawResizeArea());

    allCells?.forEach((cell) => {
      cell.drawResizeArea();
    });
  }

  protected clip(scrollX: number, scrollY: number): void {
    super.clip(scrollX, scrollY);
    this.clipResizeAreaGroup();
  }

  protected clipResizeAreaGroup() {
    const rowResizeGroup = this.spreadsheet.foregroundGroup.findById(
      KEY_GROUP_ROW_RESIZE_AREA,
    );
    if (rowResizeGroup) {
      const colLeafNodes = this.layoutResult.colLeafNodes;
      const { frozenRowGroup, frozenTrailingRowGroup } = this.spreadsheet;
      let frozenRowGroupHeight = 0;
      let frozenTrailingRowGroupHeight = 0;
      if (frozenRowGroup) {
        frozenRowGroupHeight = frozenRowGroup.getBBox().height;
      }
      if (frozenTrailingRowGroup) {
        frozenTrailingRowGroupHeight = frozenTrailingRowGroup.getBBox().height;
      }
      const panelScrollGroupHeight =
        this.panelBBox.height -
        frozenRowGroupHeight -
        frozenTrailingRowGroupHeight;
      rowResizeGroup.setClip({
        type: 'rect',
        attrs: {
          x: 0,
          y: frozenRowGroupHeight + this.cornerBBox.height,
          width: colLeafNodes?.[0]?.width ?? 0,
          height: panelScrollGroupHeight,
        },
      });
    }
  }

  public constructor(cfg: SpreadSheetFacetCfg) {
    super(cfg);

    const s2 = this.spreadsheet;
    s2.on(S2Event.RANGE_SORT, this.onSortHandler);
    s2.on(S2Event.RANGE_FILTER, this.onFilterHandler);
  }

  public getContentHeight(): number {
    const { getTotalHeight } = this.getViewCellHeights();
    const { colsHierarchy } = this.layoutResult;

    return getTotalHeight() + colsHierarchy.height;
  }

  private onSortHandler = (sortParams) => {
    const s2 = this.spreadsheet;
    let params = sortParams;
    // 兼容之前 sortParams 为对象的用法
    if (!Array.isArray(sortParams)) {
      params = [sortParams];
    }

    const currentParams = s2.dataCfg.sortParams || [];

    params = params.map((item: TableSortParam) => {
      const newItem = {
        ...item,
        // 兼容之前 sortKey 的用法
        sortFieldId: item.sortKey ?? item.sortFieldId,
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

  private onFilterHandler = (params: FilterParam) => {
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

    s2.render(true);
    s2.emit(
      S2Event.RANGE_FILTERED,
      (s2.dataSet as TableDataSet).getDisplayDataSet(),
    );
  };

  get dataCellTheme() {
    return this.spreadsheet.theme.dataCell.cell;
  }

  public destroy(): void {
    const s2 = this.spreadsheet;
    s2.off(S2Event.RANGE_SORT, this.onSortHandler);
    s2.off(S2Event.RANGE_FILTER, this.onFilterHandler);
    super.destroy();
  }

  protected calculateCornerBBox() {
    const { colsHierarchy } = this.layoutResult;
    const height = Math.floor(colsHierarchy.height);

    this.cornerBBox = new CornerBBox(this);

    this.cornerBBox.height = height;
    this.cornerBBox.maxY = height;
  }

  protected doLayout(): LayoutResult {
    const { dataSet, spreadsheet } = this.cfg;

    const rowsHierarchy = new Hierarchy();
    const { leafNodes: colLeafNodes, hierarchy: colsHierarchy } =
      buildHeaderHierarchy({
        isRowHeader: false,
        facetCfg: this.cfg,
      });
    this.calculateColNodesCoordinate(colLeafNodes, colsHierarchy);

    const getCellMeta = (rowIndex: number, colIndex: number) => {
      const showSeriesNumber = this.cfg.showSeriesNumber;
      const col = colLeafNodes[colIndex];
      const cellHeight = this.getCellHeight(rowIndex);

      const cellRange = this.getCellRange();
      const { frozenTrailingRowCount } = getValidFrozenOptions(
        this.cfg,
        colLeafNodes.length,
        cellRange.end - cellRange.start + 1,
      );

      let data;

      const x = col.x;
      let y = this.viewCellHeights.getCellOffsetY(rowIndex);

      if (
        isFrozenTrailingRow(rowIndex, cellRange.end, frozenTrailingRowCount)
      ) {
        y =
          this.panelBBox.maxY -
          this.getTotalHeightForRange(rowIndex, cellRange.end);
      }

      if (showSeriesNumber && col.field === SERIES_NUMBER_FIELD) {
        data = `${rowIndex + 1}`;
      } else {
        data = dataSet.getCellData({
          query: {
            field: col.field,
            rowIndex,
          },
        });
      }
      return {
        spreadsheet,
        x,
        y,
        width: col.width,
        height: cellHeight,
        data: {
          [col.field]: data,
        },
        rowIndex,
        colIndex,
        isTotals: false,
        colId: col.id,
        rowId: String(rowIndex),
        valueField: col.field,
        fieldValue: data,
        id: getDataCellId(String(rowIndex), col.id),
      } as ViewMeta;
    };

    const layoutResult = {
      colNodes: colsHierarchy.getNodes(),
      colsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowsHierarchy,
      rowLeafNodes: rowsHierarchy.getLeaves(),
      colLeafNodes,
      getCellMeta,
      spreadsheet,
    } as LayoutResult;

    return layoutResult;
  }

  private getAdaptiveColWidth(colLeafNodes: Node[]) {
    const { cellCfg } = this.cfg;
    const { showSeriesNumber } = this.cfg;
    if (this.spreadsheet.getLayoutWidthType() !== LayoutWidthTypes.Compact) {
      const seriesNumberWidth = this.getSeriesNumberWidth();
      const colHeaderColSize = colLeafNodes.length - (showSeriesNumber ? 1 : 0);
      const canvasW = this.getCanvasHW().width - seriesNumberWidth;
      return Math.max(cellCfg?.width, canvasW / Math.max(1, colHeaderColSize));
    }
    return cellCfg?.width;
  }

  private getColNodeHeight(col: Node, totalHeight?: number) {
    const { colCfg } = this.cfg;
    // 明细表所有列节点高度保持一致
    const userDragHeight = values(colCfg?.heightByField)[0];
    const height = userDragHeight || colCfg?.height;
    if (!totalHeight) {
      return height;
    }
    // 如果传递了总高，则需要根据层级情况获得高度
    if (col.children && col.children.length) {
      return height;
    }
    while (col.parent) {
      totalHeight -= isTopLevelNode(col) ? 0 : height;
      col = col.parent;
    }
    return totalHeight;
  }

  private calculateColNodesCoordinate(
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
  ) {
    let preLeafNode = Node.blankNode();
    const allNodes = colsHierarchy.getNodes();
    for (const levelSample of colsHierarchy.sampleNodesForAllLevels) {
      levelSample.height = this.getColNodeHeight(levelSample);
      colsHierarchy.height += levelSample.height;
    }
    const adaptiveColWidth = this.getAdaptiveColWidth(colLeafNodes);
    let currentCollIndex = 0;

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
        layoutCoordinate(this.cfg, null, currentNode);
        colsHierarchy.width += currentNode.width;
        preLeafNode = currentNode;
      }

      if (currentNode.level === 0) {
        currentNode.y = 0;
      } else {
        currentNode.y = currentNode.parent?.y + currentNode.parent?.height ?? 0;
      }
      currentNode.height = this.getColNodeHeight(
        currentNode,
        colsHierarchy.height,
      );
    }
    const topLevelNodes = allNodes.filter((node) => isTopLevelNode(node));
    const { frozenTrailingColCount } = getValidFrozenOptions(
      this.spreadsheet?.options,
      topLevelNodes.length,
    );
    preLeafNode = Node.blankNode();
    const canvasW = this.getCanvasHW().width;
    if (frozenTrailingColCount > 0) {
      const { trailingColCount: realFrozenTrailingColCount } =
        getFrozenLeafNodesCount(topLevelNodes, 0, frozenTrailingColCount);
      const leafNodes = allNodes.filter((node) => node.isLeaf);
      for (let i = 1; i <= realFrozenTrailingColCount; i++) {
        const currentNode = leafNodes[leafNodes.length - i];
        if (i === 1) {
          currentNode.x = canvasW - currentNode.width;
        } else {
          currentNode.x = preLeafNode.x - currentNode.width;
        }
        preLeafNode = currentNode;
      }
    }
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
      const parent = node.parent;
      if (prevColParent !== parent && parent) {
        leafNodes.push(parent);
        // parent's x = first child's x
        parent.x = parent.children[0].x;
        // parent's width = all children's width
        parent.width = parent.children
          .map((value: Node) => value.width)
          .reduce((sum, current) => sum + current, 0);
        prevColParent = parent;
      }
    }
  }

  private calculateColLeafNodesWidth(
    col: Node,
    adaptiveColWidth: number,
  ): number {
    const { colCfg, dataSet, spreadsheet } = this.cfg;
    const layoutWidthType = this.spreadsheet.getLayoutWidthType();

    const cellDraggedWidth = this.getCellDraggedWidth(col);

    // 1. 拖拽后的宽度优先级最高
    if (isNumber(cellDraggedWidth)) {
      return cellDraggedWidth;
    }

    // 2. 其次是自定义, 返回 null 则使用默认宽度
    const cellCustomWidth = this.getCellCustomWidth(col, colCfg?.width);
    if (isNumber(cellCustomWidth)) {
      return cellCustomWidth;
    }

    let colWidth: number;
    if (layoutWidthType === LayoutWidthTypes.Compact) {
      const datas = dataSet.getDisplayDataSet();
      const formatter = dataSet.getFieldFormatter(col.field);

      // 采样前50，找出表身最长的数据
      const maxLabel = maxBy(
        datas
          ?.slice(0, 50)
          .map((data) => `${formatter?.(data[col.field]) ?? data[col.field]}`),
        (label) => spreadsheet.measureTextWidthRoughly(label),
      );

      DebuggerUtil.getInstance().logger(
        'Max Label In Col:',
        col.field,
        maxLabel,
      );

      const { bolderText: colCellTextStyle } = spreadsheet.theme.colCell;
      const { text: dataCellTextStyle, cell: cellStyle } =
        spreadsheet.theme.dataCell;

      // 额外添加一像素余量，防止 maxLabel 有多个同样长度情况下，一些 label 不能展示完全
      const EXTRA_PIXEL = 1;
      const maxLabelWidth =
        spreadsheet.measureTextWidth(maxLabel, dataCellTextStyle) +
        cellStyle.padding.left +
        cellStyle.padding.right +
        EXTRA_PIXEL;

      // 计算表头 label+icon 占用的空间
      const colHeaderNodeWidth =
        spreadsheet.measureTextWidth(col.label, colCellTextStyle) +
        getOccupiedWidthForTableCol(
          this.spreadsheet,
          col,
          spreadsheet.theme.colCell,
        );

      colWidth = Math.max(colHeaderNodeWidth, maxLabelWidth);
    } else {
      colWidth = adaptiveColWidth;
    }

    if (col.field === SERIES_NUMBER_FIELD) {
      colWidth = this.getSeriesNumberWidth();
    }

    return colWidth;
  }

  public getCellHeight(index: number) {
    if (this.rowOffsets) {
      const heightByField = get(
        this.spreadsheet,
        'options.style.rowCfg.heightByField',
        {},
      );

      const customHeight = heightByField?.[String(index)];
      if (isNumber(customHeight)) {
        return customHeight;
      }
    }
    return this.getDefaultCellHeight();
  }

  public getViewCellHeights() {
    const { dataSet } = this.cfg;

    const defaultCellHeight = this.getDefaultCellHeight();

    return {
      getTotalHeight: () => {
        if (this.rowOffsets) {
          return last(this.rowOffsets);
        }
        return defaultCellHeight * dataSet.getDisplayDataSet().length;
      },

      getCellOffsetY: (offset: number) => {
        if (offset <= 0) {
          return 0;
        }
        if (this.rowOffsets) {
          return this.rowOffsets[offset];
        }
        let totalOffset = 0;
        for (let index = 0; index < offset; index++) {
          totalOffset += defaultCellHeight;
        }
        return totalOffset;
      },

      getTotalLength: () => {
        return dataSet.getDisplayDataSet().length;
      },

      getIndexRange: (minHeight: number, maxHeight: number) => {
        if (this.rowOffsets) {
          return getIndexRangeWithOffsets(
            this.rowOffsets,
            minHeight,
            maxHeight,
          );
        }
        const yMin = Math.floor(minHeight / defaultCellHeight);
        // 防止数组index溢出导致报错
        const yMax =
          maxHeight % defaultCellHeight === 0
            ? maxHeight / defaultCellHeight - 1
            : Math.floor(maxHeight / defaultCellHeight);
        return {
          start: Math.max(0, yMin),
          end: Math.max(0, yMax),
        };
      },
    };
  }

  private renderFrozenPanelCornerGroup = () => {
    const topLevelNodes = this.layoutResult.colNodes.filter((node) => {
      return isTopLevelNode(node);
    });
    const cellRange = this.getCellRange();

    const {
      frozenRowCount,
      frozenColCount,
      frozenTrailingRowCount,
      frozenTrailingColCount,
    } = getValidFrozenOptions(
      this.spreadsheet.options,
      topLevelNodes.length,
      cellRange.end - cellRange.start + 1,
    );

    const { colCount, trailingColCount } = getFrozenLeafNodesCount(
      topLevelNodes,
      frozenColCount,
      frozenTrailingColCount,
    );

    const result = calculateFrozenCornerCells(
      {
        frozenRowCount,
        frozenColCount: colCount,
        frozenTrailingRowCount,
        frozenTrailingColCount: trailingColCount,
      },
      this.layoutResult.colLeafNodes.length,
      cellRange,
    );

    Object.keys(result).forEach((key) => {
      const cells = result[key];
      const group = this.spreadsheet[FrozenCellGroupMap[key]];
      if (group) {
        cells.forEach((cell) => {
          this.addFrozenCell(cell.x, cell.y, group);
        });
      }
    });
  };

  addFrozenCell = (colIndex: number, rowIndex: number, group: IGroup) => {
    const viewMeta = this.layoutResult.getCellMeta(rowIndex, colIndex);
    viewMeta.isFrozenCorner = true;
    if (viewMeta) {
      const cell = this.cfg.dataCell(viewMeta);
      group.add(cell);
    }
  };

  public init() {
    super.init();
    const { width, height } = this.panelBBox;
    this.spreadsheet.panelGroup.setClip({
      type: 'rect',
      attrs: {
        x: 0,
        y: this.cornerBBox.height,
        width,
        height,
      },
    });
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
        data: this.layoutResult.colNodes,
        scrollContainsRowHeader:
          this.cfg.spreadsheet.isScrollContainsRowHeader(),
        sortParam: this.cfg.spreadsheet.store.get('sortParam'),
        spreadsheet: this.spreadsheet,
      });
    }
    return this.columnHeader;
  }

  public render() {
    this.renderFrozenPanelCornerGroup();
    super.render();
  }

  protected getRowHeader() {
    return null;
  }

  protected getSeriesNumberHeader(): SeriesNumberHeader {
    return null;
  }
}
