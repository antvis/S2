import type { Group, IElement, IGroup } from '@antv/g-canvas';
import {
  get,
  isBoolean,
  isNil,
  isNumber,
  isString,
  last,
  maxBy,
  omit,
  set,
  values,
} from 'lodash';
import { TableDataCell } from '../cell';
import {
  FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX,
  FrozenGroup,
  KEY_GROUP_FROZEN_ROW_RESIZE_AREA,
  KEY_GROUP_FROZEN_SPLIT_LINE,
  KEY_GROUP_ROW_RESIZE_AREA,
  LayoutWidthTypes,
  S2Event,
  SERIES_NUMBER_FIELD,
} from '../common/constant';
import { FrozenCellGroupMap } from '../common/constant/frozen';
import { DebuggerUtil } from '../common/debug';
import type {
  ColumnNode,
  Columns,
  FilterParam,
  LayoutResult,
  ResizeInteractionOptions,
  S2CellType,
  SplitLine,
  SpreadSheetFacetCfg,
  TableSortParam,
  ViewMeta,
} from '../common/interface';
import type { TableDataSet } from '../data-set';
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
import type { SeriesNumberHeader } from './header';
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
  isFrozenTrailingRow,
  splitInViewIndexesWithFrozen,
  translateGroup,
  translateGroupX,
  translateGroupY,
  getFrozenLeafNodesCount,
  isTopLevelNode,
} from './utils';

export class TableFacet extends BaseFacet {
  public rowOffsets: number[];

  public frozenGroupInfo: Record<
    FrozenGroup,
    {
      width?: number;
      height?: number;
      range?: number[];
    }
  > = {
    [FrozenGroup.FROZEN_COL]: {
      width: 0,
    },
    [FrozenGroup.FROZEN_ROW]: {
      height: 0,
    },
    [FrozenGroup.FROZEN_TRAILING_ROW]: {
      height: 0,
    },
    [FrozenGroup.FROZEN_TRAILING_COL]: {
      width: 0,
    },
  };

  public panelScrollGroupIndexes = [];

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
        data = rowIndex + 1;
      } else {
        data = dataSet.getCellData({
          query: {
            col: col.field,
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

  /** 扁平化树形 columns */
  private flattenTree(tree: Columns): Columns {
    return tree.reduce((prev, curr) => {
      if (isString(curr)) {
        prev = prev.concat(curr);
      } else {
        prev = prev.concat(omit(curr, 'children'));
        if (curr.children?.length) {
          prev = prev.concat(this.flattenTree(curr.children));
        }
      }
      return prev;
    }, []);
  }

  /** 当前节点所在列是否配置了 rowSpan */
  private hasRowSpanInBranch(tree: Columns, field: string): boolean {
    const columns = tree.map((item) => this.flattenTree([item]));
    const branch = columns.find((items) => {
      return items.some((item) => {
        if (isString(item)) {
          return item === field;
        }
        if (item.key === field) {
          return true;
        }
        return false;
      });
    });
    return branch?.some((item) => !isString(item) && Boolean(item?.rowSpan));
  }

  /** 当前节点的 rowSpan */
  private findRowSpanInCurrentNode(
    columns: Columns,
    field: string,
  ): number | void {
    const flattedColumns = this.flattenTree(columns);
    const column = flattedColumns.find((item) => {
      return !isString(item) && item.key === field;
    });
    return !isString(column) && column?.rowSpan;
  }

  /** TIP: 获取列头 Node 高度 */
  private getColNodeHeight(col: Node, totalHeight?: number) {
    const { colCfg, columns } = this.cfg;

    // 明细表所有列节点高度保持一致
    const userDragHeight = values(colCfg?.heightByField)[0];

    const hasRowSpanInBranch = this.hasRowSpanInBranch(columns, col.field);
    const currentRowSpan = this.findRowSpanInCurrentNode(columns, col.field);

    /** 用户拖拽高度 > 配置高度 */
    const height = userDragHeight || colCfg?.height;

    // 如果当前列任意 leaf 设置了 rowSpan, 按照 rowSpan 划分列头单元格高度
    if (hasRowSpanInBranch) {
      return height * (currentRowSpan || 1);
    }

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

  private getKeysOfFirstColumn(columns: Columns) {
    let res = [];
    const key = isString(columns?.[0]) ? columns?.[0] : columns?.[0]?.key;
    if (key) {
      res = res.concat(key);
    }
    if (!isString(columns?.[0]) && columns?.[0]?.children?.length) {
      res = res.concat(this.getKeysOfFirstColumn(columns?.[0]?.children));
    }
    return res;
  }

  private calculateColNodesCoordinate(
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
  ) {
    const { columns } = this.cfg;
    let preLeafNode = Node.blankNode();
    const allNodes = colsHierarchy.getNodes();

    const keys = this.getKeysOfFirstColumn(columns);

    const nodesOfFirstColumn = allNodes.filter((node) => {
      return keys.includes(node.field);
    });

    for (const nodeSample of nodesOfFirstColumn) {
      nodeSample.height = this.getColNodeHeight(nodeSample);
      colsHierarchy.height += nodeSample.height;
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

  protected getDefaultCellHeight() {
    const { cellCfg } = this.cfg;

    return cellCfg?.height;
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

  protected initRowOffsets() {
    const { dataSet } = this.cfg;
    const heightByField = get(
      this.spreadsheet,
      'options.style.rowCfg.heightByField',
      {},
    );
    if (Object.keys(heightByField).length) {
      const data = dataSet.getDisplayDataSet();
      this.rowOffsets = [0];
      let lastOffset = 0;
      data.forEach((_, idx) => {
        const currentHeight =
          heightByField?.[String(idx)] ?? this.getDefaultCellHeight();
        const currentOffset = lastOffset + currentHeight;
        this.rowOffsets.push(currentOffset);
        lastOffset = currentOffset;
      });
    }
  }

  public getViewCellHeights() {
    const { dataSet } = this.cfg;

    this.initRowOffsets();

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

  protected initFrozenGroupPosition = () => {
    const { scrollY, scrollX } = this.getScrollOffset();
    const paginationScrollY = this.getPaginationScrollY();

    translateGroup(
      this.spreadsheet.frozenRowGroup,
      this.cornerBBox.width - scrollX,
      this.cornerBBox.height - paginationScrollY,
    );
    translateGroup(
      this.spreadsheet.frozenColGroup,
      this.cornerBBox.width,
      this.cornerBBox.height - scrollY - paginationScrollY,
    );
    translateGroup(
      this.spreadsheet.frozenTrailingColGroup,
      this.cornerBBox.width,
      this.cornerBBox.height - scrollY - paginationScrollY,
    );
    translateGroup(
      this.spreadsheet.frozenTopGroup,
      this.cornerBBox.width,
      this.cornerBBox.height - paginationScrollY,
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
    const style: SplitLine = get(this.cfg, 'spreadsheet.theme.splitLine');
    return `l (${angle}) 0:${style.shadowColors?.left} 1:${style.shadowColors?.right}`;
  };

  protected renderFrozenGroupSplitLine = (scrollX: number, scrollY: number) => {
    const {
      width: panelWidth,
      height: panelHeight,
      viewportWidth,
      viewportHeight,
    } = this.panelBBox;
    const { height: cornerHeight } = this.cornerBBox;
    const colLeafNodes = this.layoutResult.colNodes.filter((node) => {
      return isTopLevelNode(node);
    });
    const cellRange = this.getCellRange();
    const dataLength = cellRange.end - cellRange.start;
    const {
      frozenRowCount,
      frozenColCount,
      frozenTrailingColCount,
      frozenTrailingRowCount,
    } = getValidFrozenOptions(
      this.spreadsheet.options,
      colLeafNodes.length,
      dataLength,
    );

    // 在分页条件下需要额外处理 Y 轴滚动值
    const relativeScrollY = Math.floor(scrollY - this.getPaginationScrollY());

    // scroll boundary
    const maxScrollX = Math.max(0, last(this.viewCellWidths) - viewportWidth);
    const maxScrollY = Math.max(
      0,
      this.viewCellHeights.getCellOffsetY(cellRange.end + 1) -
        this.viewCellHeights.getCellOffsetY(cellRange.start) -
        viewportHeight,
    );

    // remove previous splitline group
    this.foregroundGroup.findById(KEY_GROUP_FROZEN_SPLIT_LINE)?.remove();

    const style: SplitLine = get(this.cfg, 'spreadsheet.theme.splitLine');
    const splitLineGroup = this.foregroundGroup.addGroup({
      id: KEY_GROUP_FROZEN_SPLIT_LINE,
      zIndex: FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX,
    });

    const verticalBorderStyle = {
      lineWidth: style?.verticalBorderWidth,
      stroke: style?.verticalBorderColor,
      opacity: style?.verticalBorderColorOpacity,
      lineDash: style?.borderDash,
    };

    const horizontalBorderStyle = {
      lineWidth: style?.horizontalBorderWidth,
      stroke: style?.horizontalBorderColor,
      opacity: style?.horizontalBorderColorOpacity,
      lineDash: style?.borderDash,
    };

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
          x1: x,
          x2: x,
          y1: cornerHeight,
          y2: cornerHeight + height,
        },
        {
          ...verticalBorderStyle,
        },
      );

      if (style.showShadow && scrollX > 0) {
        splitLineGroup.addShape('rect', {
          attrs: {
            x,
            y: cornerHeight,
            width: style.shadowWidth,
            height,
            fill: this.getShadowFill(0),
          },
        });
      }
    }

    if (frozenRowCount > 0) {
      const y =
        cornerHeight +
        this.getTotalHeightForRange(
          cellRange.start,
          cellRange.start + frozenRowCount - 1,
        );
      const width = frozenTrailingColCount > 0 ? panelWidth : viewportWidth;
      renderLine(
        splitLineGroup as Group,
        {
          x1: 0,
          x2: width,
          y1: y,
          y2: y,
        },
        {
          ...horizontalBorderStyle,
        },
      );

      if (style.showShadow && relativeScrollY > 0) {
        splitLineGroup.addShape('rect', {
          attrs: {
            x: 0,
            y,
            width,
            height: style.shadowWidth,
            fill: this.getShadowFill(90),
          },
        });
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
          y1: cornerHeight,
          y2: cornerHeight + height,
        },
        {
          ...verticalBorderStyle,
        },
      );

      if (style.showShadow && Math.floor(scrollX) < Math.floor(maxScrollX)) {
        splitLineGroup.addShape('rect', {
          attrs: {
            x: x - style.shadowWidth,
            y: cornerHeight,
            width: style.shadowWidth,
            height,
            fill: this.getShadowFill(180),
          },
        });
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
          x2: width,
          y1: y,
          y2: y,
        },
        {
          ...horizontalBorderStyle,
        },
      );

      if (style.showShadow && relativeScrollY < Math.floor(maxScrollY)) {
        splitLineGroup.addShape('rect', {
          attrs: {
            x: 0,
            y: y - style.shadowWidth,
            width,
            height: style.shadowWidth,
            fill: this.getShadowFill(270),
          },
        });
      }
    }
    this.foregroundGroup.sort();
  };

  protected renderFrozenPanelCornerGroup = () => {
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
      frozenRowCount,
      frozenColCount,
      frozenTrailingRowCount,
      frozenTrailingColCount,
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
      (this.spreadsheet[group] as Group).add(cell);
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

  protected updateRowResizeArea() {
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

    allCells.forEach((cell) => {
      cell.drawResizeArea();
    });
  }

  public render() {
    this.calculateFrozenGroupInfo();
    this.renderFrozenPanelCornerGroup();
    super.render();
    this.initFrozenGroupPosition();
  }

  private getFrozenOptions = () => {
    const colLength = this.layoutResult.colLeafNodes.length;
    const cellRange = this.getCellRange();

    return getValidFrozenOptions(
      this.cfg,
      colLength,
      cellRange.end - cellRange.start + 1,
    );
  };

  public calculateFrozenGroupInfo() {
    const {
      frozenColCount,
      frozenRowCount,
      frozenTrailingColCount,
      frozenTrailingRowCount,
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

  protected getSeriesNumberHeader(): SeriesNumberHeader {
    return null;
  }

  protected translateRelatedGroups(
    scrollX: number,
    scrollY: number,
    hRowScroll: number,
  ) {
    const {
      frozenColGroup,
      frozenTrailingColGroup,
      frozenRowGroup,
      frozenTrailingRowGroup,
    } = this.spreadsheet;
    [frozenRowGroup, frozenTrailingRowGroup].forEach((g) => {
      translateGroupX(g, this.cornerBBox.width - scrollX);
    });

    [frozenColGroup, frozenTrailingColGroup].forEach((g) => {
      translateGroupY(g, this.cornerBBox.height - scrollY);
    });

    super.translateRelatedGroups(scrollX, scrollY, hRowScroll);
    this.updateRowResizeArea();
    this.renderFrozenGroupSplitLine(scrollX, scrollY);
  }

  public calculateXYIndexes(scrollX: number, scrollY: number): PanelIndexes {
    const colLength = this.layoutResult.colLeafNodes.length;
    const cellRange = this.getCellRange();

    const { viewportHeight: height, viewportWidth: width } = this.panelBBox;

    const {
      frozenColCount,
      frozenRowCount,
      frozenTrailingColCount,
      frozenTrailingRowCount,
    } = this.getFrozenOptions();

    const finalViewport = {
      width,
      height,
      x: 0,
      y: 0,
    };

    if (frozenTrailingColCount > 0 || frozenColCount > 0) {
      const { frozenTrailingCol, frozenCol } = this.frozenGroupInfo;
      finalViewport.width -= frozenTrailingCol.width + frozenCol.width;
      finalViewport.x += frozenCol.width;
    }

    if (frozenTrailingRowCount > 0 || frozenRowCount > 0) {
      const { frozenRow, frozenTrailingRow } = this.frozenGroupInfo;
      // canvas 高度小于row height和trailingRow height的时候 height 为 0
      if (finalViewport.height < frozenRow.height + frozenTrailingRow.height) {
        finalViewport.height = 0;
        finalViewport.y = 0;
      } else {
        finalViewport.height -= frozenRow.height + frozenTrailingRow.height;
        finalViewport.y += frozenRow.height;
      }
    }

    // https://github.com/antvis/S2/issues/2255
    const indexes = this.spreadsheet.dataSet.isEmpty()
      ? ([] as unknown as Indexes)
      : calculateInViewIndexes(
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
    const colLeafNodes = this.layoutResult.colLeafNodes;
    const paginationScrollY = this.getPaginationScrollY();
    const {
      frozenRowGroup,
      frozenColGroup,
      frozenTrailingColGroup,
      frozenTrailingRowGroup,
      panelScrollGroup,
    } = this.spreadsheet;
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

    panelScrollGroup.setClip({
      type: 'rect',
      attrs: {
        x: scrollX + frozenColGroupWidth,
        y: scrollY + frozenRowGroupHeight,
        width: panelScrollGroupWidth,
        height: panelScrollGroupHeight,
      },
    });

    frozenRowGroup.setClip({
      type: 'rect',
      attrs: {
        x: scrollX + frozenColGroupWidth,
        y: paginationScrollY,
        width: panelScrollGroupWidth,
        height: frozenRowGroupHeight,
      },
    });

    frozenTrailingRowGroup.setClip({
      type: 'rect',
      attrs: {
        x: scrollX + frozenColGroupWidth,
        y: frozenTrailingRowGroup.getBBox().minY,
        width: panelScrollGroupWidth,
        height: frozenTrailingRowGroupHeight,
      },
    });

    const colClipArea = {
      y: scrollY + frozenRowGroupHeight,
      height: panelScrollGroupHeight,
    };

    frozenColGroup.setClip({
      type: 'rect',
      attrs: {
        ...colClipArea,
        x: 0,
        width: frozenColGroupWidth,
      },
    });

    frozenTrailingColGroup.setClip({
      type: 'rect',
      attrs: {
        ...colClipArea,
        x: frozenTrailingColBBox.minX,
        width: frozenTrailingColBBox.width,
      },
    });

    const rowResizeGroup = this.spreadsheet.foregroundGroup.findById(
      KEY_GROUP_ROW_RESIZE_AREA,
    );

    if (rowResizeGroup) {
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

  public updatePanelScrollGroup() {
    super.updatePanelScrollGroup();
    [
      FrozenGroup.FROZEN_COL,
      FrozenGroup.FROZEN_ROW,
      FrozenGroup.FROZEN_TRAILING_COL,
      FrozenGroup.FROZEN_TRAILING_ROW,
    ].forEach((key) => {
      if (!this.frozenGroupInfo[key].range) {
        return;
      }

      let cols = [];
      let rows = [];

      if (key.toLowerCase().includes('row')) {
        const [rowMin, rowMax] = this.frozenGroupInfo[key].range;
        cols = this.gridInfo.cols;
        rows = getRowsForGrid(rowMin, rowMax, this.viewCellHeights);
        if (key === FrozenGroup.FROZEN_TRAILING_ROW) {
          const { minY } = this.spreadsheet.frozenTrailingRowGroup.getBBox();
          rows = getFrozenRowsForGrid(
            rowMin,
            rowMax,
            Math.ceil(minY),
            this.viewCellHeights,
          );
        }
      } else {
        const [colMin, colMax] = this.frozenGroupInfo[key].range;
        const nodes = this.layoutResult.colNodes.filter((node) =>
          isTopLevelNode(node),
        );
        cols = getColsForGrid(colMin, colMax, nodes);
        rows = this.gridInfo.rows;
      }

      this.spreadsheet[`${key}Group`].updateGrid(
        {
          cols,
          rows,
        },
        `${key}Group`,
      );
    });
  }
}
