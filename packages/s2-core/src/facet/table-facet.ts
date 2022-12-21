import { Group, Rect } from '@antv/g';
import { get, isBoolean, isEmpty, isNil, keys, last, maxBy, set } from 'lodash';
import { TableDataCell } from '../cell';
import {
  FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX,
  KEY_GROUP_FROZEN_ROW_RESIZE_AREA,
  KEY_GROUP_FROZEN_SPLIT_LINE,
  KEY_GROUP_PANEL_FROZEN_BOTTOM,
  KEY_GROUP_PANEL_FROZEN_COL,
  KEY_GROUP_PANEL_FROZEN_ROW,
  KEY_GROUP_PANEL_FROZEN_TOP,
  KEY_GROUP_PANEL_FROZEN_TRAILING_COL,
  KEY_GROUP_PANEL_FROZEN_TRAILING_ROW,
  KEY_GROUP_ROW_RESIZE_AREA,
  LayoutWidthTypes,
  PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
  S2Event,
  SERIES_NUMBER_FIELD,
  SPLIT_LINE_WIDTH,
} from '../common/constant';
import { FrozenCellGroupMap, FrozenGroupType } from '../common/constant/frozen';
import { DebuggerUtil } from '../common/debug';
import type {
  FilterParam,
  GetCellMeta,
  LayoutResult,
  ResizeInteractionOptions,
  S2CellType,
  SortParams,
  TableSortParam,
  ViewMeta,
} from '../common/interface';
import type { TableDataSet } from '../data-set';
import { FrozenGroup } from '../group/frozen-group';
import type { SpreadSheet } from '../sheet-type';
import { getDataCellId } from '../utils/cell/data-cell';
import { getOccupiedWidthForTableCol } from '../utils/cell/table-col-cell';
import { getIndexRangeWithOffsets } from '../utils/facet';
import { renderLine } from '../utils/g-renders';
import { getAllChildCells } from '../utils/get-all-child-cells';
import {
  getColsForGrid,
  getFrozenRowsForGrid,
  getRowsForGrid,
} from '../utils/grid';
import type { Indexes, PanelIndexes } from '../utils/indexes';
import { getValidFrozenOptions } from '../utils/layout/frozen';
import { BaseFacet } from './base-facet';
import { CornerBBox } from './bbox/cornerBBox';
import { Frame, type SeriesNumberHeader } from './header';
import type { ColHeader } from './header/col';
import { TableColHeader } from './header/table-col';
import { buildHeaderHierarchy } from './layout/build-header-hierarchy';
import { Hierarchy } from './layout/hierarchy';
import { layoutCoordinate } from './layout/layout-hooks';
import { Node } from './layout/node';
import {
  calculateFrozenCornerCells,
  calculateInViewIndexes,
  getFrozenDataCellType,
  getFrozenLeafNodesCount,
  isFrozenTrailingRow,
  isTopLevelNode,
  splitInViewIndexesWithFrozen,
  translateGroup,
} from './utils';

export class TableFacet extends BaseFacet {
  public declare rowOffsets: number[];

  public frozenGroupInfo: Record<
    FrozenGroupType,
    {
      width?: number;
      height?: number;
      range?: number[];
    }
  > = {
    [FrozenGroupType.FROZEN_COL]: {
      width: 0,
    },
    [FrozenGroupType.FROZEN_ROW]: {
      height: 0,
    },
    [FrozenGroupType.FROZEN_TRAILING_ROW]: {
      height: 0,
    },
    [FrozenGroupType.FROZEN_TRAILING_COL]: {
      width: 0,
    },
  };

  public panelScrollGroupIndexes: Indexes = [] as unknown as Indexes;

  public constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);

    this.spreadsheet.on(S2Event.RANGE_SORT, this.onSortHandler);
    this.spreadsheet.on(S2Event.RANGE_FILTER, this.onFilterHandler);
  }

  protected override initPanelGroups(): void {
    super.initPanelGroups();
    [
      this.frozenRowGroup,
      this.frozenColGroup,
      this.frozenTrailingRowGroup,
      this.frozenTrailingColGroup,
      this.frozenTopGroup,
      this.frozenBottomGroup,
    ] = [
      KEY_GROUP_PANEL_FROZEN_ROW,
      KEY_GROUP_PANEL_FROZEN_COL,
      KEY_GROUP_PANEL_FROZEN_TRAILING_ROW,
      KEY_GROUP_PANEL_FROZEN_TRAILING_COL,
      KEY_GROUP_PANEL_FROZEN_TOP,
      KEY_GROUP_PANEL_FROZEN_BOTTOM,
    ].map((name) => {
      const g = new FrozenGroup({
        name,
        zIndex: PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
        s2: this.spreadsheet,
      });
      this.panelGroup.add(g);
      return g;
    });
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
        oldConfig.splice(oldIndex);
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
    return this.spreadsheet.theme.dataCell?.cell;
  }

  override clearAllGroup() {
    super.clearAllGroup();
    this.frozenRowGroup.removeChildren();
    this.frozenColGroup.removeChildren();
    this.frozenTrailingRowGroup.removeChildren();
    this.frozenTrailingColGroup.removeChildren();
    this.frozenTopGroup.removeChildren();
    this.frozenBottomGroup.removeChildren();
  }

  public destroy(): void {
    super.destroy();
    const s2 = this.spreadsheet;
    s2.off(S2Event.RANGE_SORT, this.onSortHandler);
    s2.off(S2Event.RANGE_FILTER, this.onFilterHandler);
  }

  protected calculateCornerBBox() {
    const { colsHierarchy } = this.layoutResult;
    const height = Math.floor(colsHierarchy.height);

    this.cornerBBox = new CornerBBox(this);

    this.cornerBBox.height = height;
    this.cornerBBox.maxY = height;
  }

  protected doLayout(): LayoutResult {
    const rowsHierarchy = new Hierarchy();
    const { leafNodes: colLeafNodes, hierarchy: colsHierarchy } =
      buildHeaderHierarchy({
        isRowHeader: false,
        spreadsheet: this.spreadsheet,
      });
    this.calculateColNodesCoordinate(colLeafNodes, colsHierarchy);

    const getCellMeta: GetCellMeta = (rowIndex, colIndex) => {
      const { showSeriesNumber } = this.spreadsheet.options;
      const col = colLeafNodes[colIndex];
      const cellHeight = this.getCellHeightByRowIndex(rowIndex);

      const cellRange = this.getCellRange();
      const { frozenTrailingRowCount = 0 } = getValidFrozenOptions(
        this.spreadsheet.options,
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
          this.panelBBox.height -
          this.getTotalHeightForRange(rowIndex, cellRange.end);
      }

      if (showSeriesNumber && col.field === SERIES_NUMBER_FIELD) {
        data = rowIndex + 1;
      } else {
        data = this.spreadsheet.dataSet.getCellData({
          query: {
            col: col.field,
            rowIndex,
          },
        });
      }
      return {
        spreadsheet: this.spreadsheet,
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

    return {
      colNodes: colsHierarchy.getNodes(),
      colsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowsHierarchy,
      rowLeafNodes: rowsHierarchy.getLeaves(),
      colLeafNodes,
      getCellMeta,
      spreadsheet: this.spreadsheet,
    };
  }

  private getAdaptiveColWidth(colLeafNodes: Node[]) {
    const { cellCfg } = this.spreadsheet.options.style!;
    const { showSeriesNumber } = this.spreadsheet.options;

    if (this.spreadsheet.getLayoutWidthType() !== LayoutWidthTypes.Compact) {
      const seriesNumberWidth = this.getSeriesNumberWidth();
      const colHeaderColSize = colLeafNodes.length - (showSeriesNumber ? 1 : 0);
      const canvasW =
        this.getCanvasSize().width -
        seriesNumberWidth -
        Frame.getVerticalBorderWidth(this.spreadsheet);

      return Math.max(
        cellCfg?.width!,
        Math.floor(canvasW / Math.max(1, colHeaderColSize)),
      );
    }
    return cellCfg?.width ?? 0;
  }

  private getColNodeHeight(colNode: Node, totalHeight?: number) {
    const height = this.getDefaultColNodeHeight(colNode);

    if (!totalHeight) {
      return height;
    }

    // 如果传递了总高，则需要根据层级情况获得高度
    if (!isEmpty(colNode?.children)) {
      return height;
    }

    while (colNode.parent) {
      totalHeight -= isTopLevelNode(colNode) ? 0 : height;
      colNode = colNode.parent;
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
      currentNode.height = this.getColNodeHeight(
        currentNode,
        colsHierarchy.height,
      );
    }
    const topLevelNodes = allNodes.filter((node) => isTopLevelNode(node));
    const { frozenTrailingColCount = 0 } = getValidFrozenOptions(
      this.spreadsheet?.options,
      topLevelNodes.length,
    );
    preLeafNode = Node.blankNode();

    const { width } = this.getCanvasSize();
    if (frozenTrailingColCount > 0) {
      const { trailingColCount: realFrozenTrailingColCount } =
        getFrozenLeafNodesCount(topLevelNodes, 0, frozenTrailingColCount);
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
          .map((value: Node) => value.width)
          .reduce((sum, current) => sum + current, 0);
        prevColParent = parent;
      }
    }
  }

  private calculateColLeafNodesWidth(
    colNode: Node,
    adaptiveColWidth: number,
  ): number {
    const { colCfg } = this.spreadsheet.options.style!;
    const layoutWidthType = this.spreadsheet.getLayoutWidthType();
    const cellDraggedWidth = this.getColCellDraggedWidth(colNode);

    // 1. 拖拽后的宽度优先级最高
    if (cellDraggedWidth) {
      return cellDraggedWidth;
    }

    // 2. 其次是自定义, 返回 null 则使用默认宽度
    const cellCustomWidth = this.getCellCustomSize(colNode, colCfg?.width);
    if (!isNil(cellCustomWidth)) {
      return cellCustomWidth;
    }

    let colWidth: number;
    if (layoutWidthType === LayoutWidthTypes.Compact) {
      const datas = this.spreadsheet.dataSet.getDisplayDataSet();
      const colLabel = colNode.value;

      const allLabels =
        datas?.map((data) => `${data[colNode.field]}`)?.slice(0, 50) || []; // 采样取了前50
      allLabels.push(colLabel);
      const maxLabel = maxBy(allLabels, (label) =>
        this.spreadsheet.measureTextWidthRoughly(label),
      );

      const { bolderText: colCellTextStyle } = this.spreadsheet.theme.colCell!;
      const { text: dataCellTextStyle, cell: cellStyle } =
        this.spreadsheet.theme.dataCell!;

      DebuggerUtil.getInstance().logger(
        'Max Label In Col:',
        colNode.field,
        maxLabel,
      );

      // 最长的 Label 如果是列名，按列名的标准计算宽度
      if (colLabel === maxLabel) {
        colWidth =
          this.spreadsheet.measureTextWidth(maxLabel, colCellTextStyle) +
          getOccupiedWidthForTableCol(
            this.spreadsheet,
            colNode,
            this.spreadsheet.theme.colCell!,
          );
      } else {
        // 额外添加一像素余量，防止 maxLabel 有多个同样长度情况下，一些 label 不能展示完全
        const EXTRA_PIXEL = 1;
        colWidth =
          this.spreadsheet.measureTextWidth(maxLabel, dataCellTextStyle) +
          cellStyle!.padding!.left! +
          cellStyle!.padding!.right! +
          EXTRA_PIXEL;
      }
    } else {
      colWidth = adaptiveColWidth;
    }

    if (colNode.field === SERIES_NUMBER_FIELD) {
      colWidth = this.getSeriesNumberWidth();
    }

    return colWidth;
  }

  protected getDefaultCellHeight(): number {
    return this.getRowCellHeight(null as unknown as Node);
  }

  public getCellHeightByRowIndex(rowIndex: number) {
    if (this.rowOffsets) {
      return this.getRowCellHeight({ id: String(rowIndex) } as Node);
    }
    return this.getDefaultCellHeight();
  }

  protected initRowOffsets() {
    const heightByField = this.spreadsheet.options.style?.rowCfg?.heightByField;

    if (keys(heightByField!).length) {
      const data = this.spreadsheet.dataSet.getDisplayDataSet();
      this.rowOffsets = [0];
      let lastOffset = 0;
      data.forEach((_, rowIndex) => {
        const currentHeight = this.getCellHeightByRowIndex(rowIndex);
        const currentOffset = lastOffset + currentHeight;
        this.rowOffsets.push(currentOffset);
        lastOffset = currentOffset;
      });
    }
  }

  public getViewCellHeights() {
    this.initRowOffsets();

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
        let totalOffset = 0;
        for (let index = 0; index < offset; index++) {
          totalOffset += defaultCellHeight;
        }
        return totalOffset;
      },

      getTotalLength: () => {
        return this.spreadsheet.dataSet.getDisplayDataSet().length;
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

  protected translateFrozenGroups = () => {
    const { scrollY, scrollX } = this.getScrollOffset();
    const paginationScrollY = this.getPaginationScrollY();

    const { x, y } = this.panelBBox;

    translateGroup(this.frozenTopGroup, x, y - paginationScrollY);
    translateGroup(this.frozenBottomGroup, x, y);

    translateGroup(this.frozenRowGroup, x - scrollX, y - paginationScrollY);
    translateGroup(this.frozenTrailingRowGroup, x - scrollX, y);

    translateGroup(this.frozenColGroup, x, y - scrollY - paginationScrollY);
    translateGroup(
      this.frozenTrailingColGroup,
      x,
      y - scrollY - paginationScrollY,
    );
  };

  public getTotalHeightForRange = (start: number, end: number) => {
    if (start < 0 || end < 0) {
      return 0;
    }

    if (this.rowOffsets) {
      return this.rowOffsets[end + 1] - this.rowOffsets[start];
    }

    let totalHeight = 0;
    for (let index = start; index < end + 1; index++) {
      const height = this.getDefaultCellHeight();
      totalHeight += height;
    }
    return totalHeight;
  };

  private getShadowFill = (angle: number) => {
    const { splitLine } = this.spreadsheet.theme;
    return `l (${angle}) 0:${splitLine?.shadowColors?.left} 1:${splitLine?.shadowColors?.right}`;
  };

  protected renderFrozenGroupSplitLine = (scrollX: number, scrollY: number) => {
    const {
      width: panelWidth,
      height: panelHeight,
      viewportWidth,
      viewportHeight,
      x: panelBBoxStartX,
      y: panelBBoxStartY,
    } = this.panelBBox;
    const colLeafNodes = this.layoutResult.colNodes.filter((node) => {
      return isTopLevelNode(node);
    });
    const cellRange = this.getCellRange();
    const dataLength = cellRange.end - cellRange.start;
    const {
      frozenRowCount = 0,
      frozenColCount = 0,
      frozenTrailingColCount = 0,
      frozenTrailingRowCount = 0,
    } = getValidFrozenOptions(
      this.spreadsheet.options,
      colLeafNodes.length,
      dataLength,
    );

    // 在分页条件下需要额外处理 Y 轴滚动值
    const relativeScrollY = Math.floor(scrollY - this.getPaginationScrollY());

    // scroll boundary
    const maxScrollX = Math.max(0, last(this.viewCellWidths)! - viewportWidth);
    const maxScrollY = Math.max(
      0,
      this.viewCellHeights.getCellOffsetY(cellRange.end + 1) -
        this.viewCellHeights.getCellOffsetY(cellRange.start) -
        viewportHeight,
    );

    // remove previous splitline group
    this.foregroundGroup.getElementById(KEY_GROUP_FROZEN_SPLIT_LINE)?.remove();

    const { splitLine } = this.spreadsheet.theme;
    const splitLineGroup = this.foregroundGroup.appendChild(
      new Group({
        id: KEY_GROUP_FROZEN_SPLIT_LINE,
        style: {
          zIndex: FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX,
        },
      }),
    );

    const verticalBorderStyle = {
      lineWidth: SPLIT_LINE_WIDTH,
      stroke: splitLine?.verticalBorderColor,
      opacity: splitLine?.verticalBorderColorOpacity,
    };

    const horizontalBorderStyle = {
      lineWidth: SPLIT_LINE_WIDTH,
      stroke: splitLine?.horizontalBorderColor,
      opacity: splitLine?.horizontalBorderColorOpacity,
    };

    const frameVerticalBorderWidth = Frame.getVerticalBorderWidth(
      this.spreadsheet,
    );

    if (frozenColCount > 0) {
      const x = colLeafNodes.reduce((prev, item, idx) => {
        if (idx < frozenColCount) {
          return prev + item.width;
        }
        return prev;
      }, 0);

      const height = frozenTrailingRowCount > 0 ? panelHeight : viewportHeight;

      renderLine(
        splitLineGroup as Group,
        {
          x1: x + panelBBoxStartX,
          x2: x + panelBBoxStartX,
          y1: panelBBoxStartY,
          y2: panelBBoxStartY + height,
        },
        {
          ...verticalBorderStyle,
        },
      );

      if (splitLine?.showShadow && scrollX > 0) {
        splitLineGroup.appendChild(
          new Rect({
            style: {
              x: x + panelBBoxStartX,
              y: panelBBoxStartY,
              width: splitLine?.shadowWidth!,
              height,
              fill: this.getShadowFill(0),
            },
          }),
        );
      }
    }

    if (frozenRowCount > 0) {
      const y =
        panelBBoxStartY +
        this.getTotalHeightForRange(
          cellRange.start,
          cellRange.start + frozenRowCount - 1,
        );
      const width = frozenTrailingColCount > 0 ? panelWidth : viewportWidth;
      renderLine(
        splitLineGroup as Group,
        {
          x1: 0,
          x2: width + frameVerticalBorderWidth,
          y1: y,
          y2: y,
        },
        {
          ...horizontalBorderStyle,
        },
      );

      if (splitLine?.showShadow && relativeScrollY > 0) {
        splitLineGroup.appendChild(
          new Rect({
            style: {
              x: 0,
              y,
              width: width + frameVerticalBorderWidth,
              height: splitLine?.shadowWidth!,
              fill: this.getShadowFill(90),
            },
          }),
        );
      }
    }

    if (frozenTrailingColCount > 0) {
      // const width = colLeafNodes.reduceRight((prev, item, idx) => {
      //   if (idx >= colLeafNodes.length - frozenTrailingColCount) {
      //     return prev + item.width;
      //   }
      //   return prev;
      // }, 0);
      const { x } = colLeafNodes[colLeafNodes.length - frozenTrailingColCount];
      const height = frozenTrailingRowCount ? panelHeight : viewportHeight;
      renderLine(
        splitLineGroup as Group,
        {
          x1: x,
          x2: x,
          y1: panelBBoxStartY,
          y2: panelBBoxStartY + height,
        },
        {
          ...verticalBorderStyle,
        },
      );

      if (
        splitLine?.showShadow &&
        Math.floor(scrollX) < Math.floor(maxScrollX)
      ) {
        splitLineGroup.appendChild(
          new Rect({
            style: {
              x: x - splitLine.shadowWidth!,
              y: panelBBoxStartY,
              width: splitLine.shadowWidth!,
              height,
              fill: this.getShadowFill(180),
            },
          }),
        );
      }
    }

    if (frozenTrailingRowCount > 0) {
      const y =
        this.panelBBox.maxY -
        this.getTotalHeightForRange(
          cellRange.end - frozenTrailingRowCount + 1,
          cellRange.end,
        );
      const width = frozenTrailingColCount > 0 ? panelWidth : viewportWidth;
      renderLine(
        splitLineGroup as Group,
        {
          x1: 0,
          x2: width + frameVerticalBorderWidth,
          y1: y,
          y2: y,
        },
        {
          ...horizontalBorderStyle,
        },
      );

      if (splitLine?.showShadow && relativeScrollY < Math.floor(maxScrollY)) {
        splitLineGroup.appendChild(
          new Rect({
            style: {
              x: 0,
              y: y - splitLine.shadowWidth!,
              width: width + frameVerticalBorderWidth,
              height: splitLine.shadowWidth!,
              fill: this.getShadowFill(270),
            },
          }),
        );
      }
    }
    // TODO: g5.0 没有这个排序方法，好像也没啥用
    // this.foregroundGroup.sort();
  };

  protected renderFrozenPanelCornerGroup = () => {
    const topLevelNodes = this.layoutResult.colNodes.filter((node) => {
      return isTopLevelNode(node);
    });
    const cellRange = this.getCellRange();

    const {
      frozenRowCount = 0,
      frozenColCount = 0,
      frozenTrailingRowCount = 0,
      frozenTrailingColCount = 0,
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const group = this[FrozenCellGroupMap[key]];
      if (group) {
        cells.forEach((cell) => {
          this.addFrozenCell(cell.x, cell.y, group);
        });
      }
    });
  };

  addFrozenCell = (colIndex: number, rowIndex: number, group: Group) => {
    const viewMeta = this.layoutResult.getCellMeta(rowIndex, colIndex);
    if (viewMeta) {
      viewMeta.isFrozenCorner = true;
      const cell = this.spreadsheet.options.dataCell?.(viewMeta)!;
      group.appendChild(cell);
    }
  };

  getRealFrozenColumns = (
    frozenColCount: number,
    frozenTrailingColCount: number,
  ) => {
    let colCount = frozenColCount;
    let trailingColCount = frozenTrailingColCount;
    if (frozenColCount || frozenTrailingColCount) {
      let nodes = this.layoutResult.colsHierarchy.getNodes();
      nodes = nodes.filter((node) => isTopLevelNode(node));
      ({ colCount, trailingColCount } = getFrozenLeafNodesCount(
        nodes,
        frozenColCount,
        frozenTrailingColCount,
      ));
    }
    return { colCount, trailingColCount };
  };

  addCell = (cell: S2CellType<ViewMeta>) => {
    const {
      frozenRowCount = 0,
      frozenColCount = 0,
      frozenTrailingRowCount = 0,
      frozenTrailingColCount = 0,
    } = this.spreadsheet.options;
    const colLength = this.layoutResult.colsHierarchy.getLeaves().length;
    const cellRange = this.getCellRange();

    const { colCount, trailingColCount } = this.getRealFrozenColumns(
      frozenColCount,
      frozenTrailingColCount,
    );

    const frozenCellType = getFrozenDataCellType(
      cell.getMeta(),
      {
        frozenRowCount,
        frozenColCount: colCount,
        frozenTrailingRowCount,
        frozenTrailingColCount: trailingColCount,
      },
      colLength,
      cellRange,
    );

    const group = FrozenCellGroupMap[frozenCellType];
    if (group) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (this[group] as Group).appendChild(cell);
    }
  };

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
        sortParam: this.spreadsheet.store.get('sortParam'),
        spreadsheet: this.spreadsheet,
      });
    }
    return this.columnHeader;
  }

  protected updateRowResizeArea() {
    const { options } = this.spreadsheet;
    const resize = get(options, 'interaction.resize');

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

  public render() {
    this.calculateFrozenGroupInfo();
    this.renderFrozenPanelCornerGroup();
    super.render();
  }

  private getFrozenOptions = () => {
    const colLength = this.layoutResult.colLeafNodes.length;
    const cellRange = this.getCellRange();

    return getValidFrozenOptions(
      this.spreadsheet.options,
      colLength,
      cellRange.end - cellRange.start + 1,
    );
  };

  public calculateFrozenGroupInfo() {
    const {
      frozenColCount = 0,
      frozenRowCount = 0,
      frozenTrailingColCount = 0,
      frozenTrailingRowCount = 0,
    } = this.getFrozenOptions();

    const colLeafNodes = this.layoutResult.colNodes.filter((node) => {
      return isTopLevelNode(node);
    });
    const viewCellHeights = this.viewCellHeights;
    const cellRange = this.getCellRange();
    const { frozenCol, frozenTrailingCol, frozenRow, frozenTrailingRow } =
      this.frozenGroupInfo;

    if (frozenColCount > 0) {
      frozenCol.width =
        colLeafNodes[frozenColCount - 1].x +
        colLeafNodes[frozenColCount - 1].width -
        0;
      frozenCol.range = [0, frozenColCount - 1];
    }

    if (frozenRowCount > 0) {
      frozenRow.height =
        viewCellHeights.getCellOffsetY(cellRange.start + frozenRowCount) -
        viewCellHeights.getCellOffsetY(cellRange.start);
      frozenRow.range = [cellRange.start, cellRange.start + frozenRowCount - 1];
    }

    if (frozenTrailingColCount > 0) {
      frozenTrailingCol.width =
        colLeafNodes[colLeafNodes.length - 1].x -
        colLeafNodes[colLeafNodes.length - frozenTrailingColCount].x +
        colLeafNodes[colLeafNodes.length - 1].width;
      frozenTrailingCol.range = [
        colLeafNodes.length - frozenTrailingColCount,
        colLeafNodes.length - 1,
      ];
    }

    if (frozenTrailingRowCount > 0) {
      frozenTrailingRow.height =
        viewCellHeights.getCellOffsetY(cellRange.end + 1) -
        viewCellHeights.getCellOffsetY(
          cellRange.end + 1 - frozenTrailingRowCount,
        );
      frozenTrailingRow.range = [
        cellRange.end - frozenTrailingRowCount + 1,
        cellRange.end,
      ];
    }
  }

  protected getRowHeader() {
    return null;
  }

  protected getSeriesNumberHeader(): SeriesNumberHeader | null {
    return null;
  }

  protected translateRelatedGroups(
    scrollX: number,
    scrollY: number,
    hRowScroll: number,
  ) {
    super.translateRelatedGroups(scrollX, scrollY, hRowScroll);
    this.translateFrozenGroups();
    this.updateRowResizeArea();
    this.renderFrozenGroupSplitLine(scrollX, scrollY);
  }

  public calculateXYIndexes(scrollX: number, scrollY: number): PanelIndexes {
    const colLength = this.layoutResult.colLeafNodes.length;
    const cellRange = this.getCellRange();

    const { viewportHeight: height, viewportWidth: width } = this.panelBBox;

    const {
      frozenColCount = 0,
      frozenRowCount = 0,
      frozenTrailingColCount = 0,
      frozenTrailingRowCount = 0,
    } = this.getFrozenOptions();

    const finalViewport = {
      width,
      height,
      x: 0,
      y: 0,
    };

    if (frozenTrailingColCount > 0 || frozenColCount > 0) {
      const { frozenTrailingCol, frozenCol } = this.frozenGroupInfo;
      finalViewport.width -= frozenTrailingCol.width! + frozenCol.width!;
      finalViewport.x += frozenCol.width!;
    }

    if (frozenTrailingRowCount > 0 || frozenRowCount > 0) {
      const { frozenRow, frozenTrailingRow } = this.frozenGroupInfo;
      // canvas 高度小于 row height 和 trailingRow height 的时候 height 为 0
      if (
        finalViewport.height <
        frozenRow.height! + frozenTrailingRow.height!
      ) {
        finalViewport.height = 0;
        finalViewport.y = 0;
      } else {
        finalViewport.height -= frozenRow.height! + frozenTrailingRow.height!;
        finalViewport.y += frozenRow.height!;
      }
    }

    const indexes = calculateInViewIndexes(
      scrollX,
      scrollY,
      this.viewCellWidths,
      this.viewCellHeights,
      finalViewport,
      this.getRealScrollX(this.cornerBBox.width),
    );

    this.panelScrollGroupIndexes = indexes;

    const { colCount, trailingColCount } = this.getRealFrozenColumns(
      frozenColCount,
      frozenTrailingColCount,
    );

    return splitInViewIndexesWithFrozen(
      indexes,
      {
        frozenColCount: colCount,
        frozenRowCount,
        frozenTrailingColCount: trailingColCount,
        frozenTrailingRowCount,
      },
      colLength,
      cellRange,
    );
  }

  // 对 panelScrollGroup 以及四个方向的 frozenGroup 做 Clip，避免有透明度时冻结分组和滚动分组展示重叠
  protected clip(scrollX: number, scrollY: number) {
    const paginationScrollY = this.getPaginationScrollY();
    const {
      frozenRowGroup,
      frozenColGroup,
      frozenTrailingColGroup,
      frozenTrailingRowGroup,
    } = this;
    const frozenColGroupWidth = frozenColGroup.getBBox().width;
    const frozenRowGroupHeight = frozenRowGroup.getBBox().height;
    const frozenTrailingColBBox = frozenTrailingColGroup.getBBox();
    const frozenTrailingRowGroupHeight =
      frozenTrailingRowGroup.getBBox().height;
    const panelScrollGroupWidth =
      this.panelBBox.width -
      frozenColGroupWidth -
      frozenTrailingColGroup.getBBox().width;
    const panelScrollGroupHeight =
      this.panelBBox.height -
      frozenRowGroupHeight -
      frozenTrailingRowGroupHeight;

    frozenRowGroup.style.clipPath = new Rect({
      style: {
        x: scrollX + frozenColGroupWidth,
        y: paginationScrollY,
        width: panelScrollGroupWidth,
        height: frozenRowGroupHeight,
      },
    });

    frozenTrailingRowGroup.style.clipPath = new Rect({
      style: {
        x: scrollX + frozenColGroupWidth,
        y: frozenTrailingRowGroup.getBBox().top,
        width: panelScrollGroupWidth,
        height: frozenTrailingRowGroupHeight,
      },
    });

    const colClipArea = {
      y: scrollY + frozenRowGroupHeight,
      height: panelScrollGroupHeight,
    };

    frozenColGroup.style.clipPath = new Rect({
      style: {
        ...colClipArea,
        x: 0,
        width: frozenColGroupWidth,
      },
    });

    frozenTrailingColGroup.style.clipPath = new Rect({
      style: {
        ...colClipArea,
        x: frozenTrailingColBBox.left,
        width: frozenTrailingColBBox.width,
      },
    });

    const rowResizeGroup = this.foregroundGroup.getElementById<Group>(
      KEY_GROUP_ROW_RESIZE_AREA,
    );

    if (rowResizeGroup) {
      rowResizeGroup.style.clipPath = new Rect({
        style: {
          x: 0,
          y: this.panelBBox.y + frozenRowGroupHeight,
          width:
            this.panelBBox.width +
            Frame.getVerticalBorderWidth(this.spreadsheet),
          height: panelScrollGroupHeight,
        },
      });
    }
  }

  public updatePanelScrollGroup() {
    super.updatePanelScrollGroup();
    [
      FrozenGroupType.FROZEN_COL,
      FrozenGroupType.FROZEN_ROW,
      FrozenGroupType.FROZEN_TRAILING_COL,
      FrozenGroupType.FROZEN_TRAILING_ROW,
    ].forEach((key) => {
      if (!this.frozenGroupInfo[key].range) {
        return;
      }

      let cols = [];
      let rows = [];

      if (key.toLowerCase().includes('row')) {
        const [rowMin, rowMax] = this.frozenGroupInfo[key].range || [];
        cols = this.gridInfo.cols;
        rows = getRowsForGrid(rowMin, rowMax, this.viewCellHeights);

        if (key === FrozenGroupType.FROZEN_TRAILING_ROW) {
          const { top } = this.frozenTrailingRowGroup.getBBox();
          rows = getFrozenRowsForGrid(
            rowMin,
            rowMax,
            Math.ceil(top),
            this.viewCellHeights,
          );
        }
      } else {
        const [colMin, colMax] = this.frozenGroupInfo[key].range || [];
        const nodes = this.layoutResult.colNodes.filter((node) =>
          isTopLevelNode(node),
        );
        cols = getColsForGrid(colMin, colMax, nodes);
        rows = this.gridInfo.rows;
      }

      this[`${key}Group`].updateGrid(
        {
          cols,
          rows,
        },
        `${key}Group`,
      );
    });
  }
}
