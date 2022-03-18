import type { Group, IElement, IGroup } from '@antv/g-canvas';
import { get, isBoolean, last, maxBy, set } from 'lodash';
import { TableColHeader } from 'src/facet/header/table-col';
import { ColHeader } from 'src/facet/header/col';
import { getOccupiedWidthForTableCol } from 'src/utils/cell/table-col-cell';
import { getValidFrozenOptions } from 'src/utils/layout/frozen';
import { getIndexRangeWithOffsets } from 'src/utils/facet';
import {
  calculateFrozenCornerCells,
  calculateInViewIndexes,
  getFrozenDataCellType,
  splitInViewIndexesWithFrozen,
  translateGroup,
  translateGroupX,
  translateGroupY,
  isFrozenTrailingCol,
  isFrozenTrailingRow,
} from './utils';
import { CornerBBox } from './bbox/cornerBBox';
import { SeriesNumberHeader } from './header';
import { TableRowCell } from '@/cell';
import type {
  LayoutResult,
  S2CellType,
  SplitLine,
  SpreadSheetFacetCfg,
  ViewMeta,
  ResizeActiveOptions,
  TableSortParam,
} from '@/common/interface';
import { getDataCellId } from '@/utils/cell/data-cell';
import {
  KEY_GROUP_ROW_RESIZE_AREA,
  LayoutWidthTypes,
  S2Event,
  SERIES_NUMBER_FIELD,
  FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX,
  KEY_GROUP_FROZEN_SPLIT_LINE,
  KEY_GROUP_FROZEN_ROW_RESIZE_AREA,
} from '@/common/constant';
import { FrozenCellGroupMap } from '@/common/constant/frozen';
import { DebuggerUtil } from '@/common/debug';
import { BaseFacet } from '@/facet/base-facet';
import { buildHeaderHierarchy } from '@/facet/layout/build-header-hierarchy';
import { Hierarchy } from '@/facet/layout/hierarchy';
import { layoutCoordinate } from '@/facet/layout/layout-hooks';
import { Node } from '@/facet/layout/node';
import { renderLine } from '@/utils/g-renders';
import { TableDataSet } from '@/data-set';
import { PanelIndexes } from '@/utils/indexes';
import { measureTextWidth, measureTextWidthRoughly } from '@/utils/text';
import { getAllChildCells } from '@/utils/get-all-child-cells';

export class TableFacet extends BaseFacet {
  public rowOffsets: number[];

  public frozenGroupInfo: Record<
    string,
    {
      width?: number;
      height?: number;
      range?: number[];
    }
  > = {
    col: {
      width: 0,
    },
    row: {
      height: 0,
    },
    trailingRow: {
      height: 0,
    },
    trailingCol: {
      width: 0,
    },
  };

  public panelScrollGroupIndexes = [];

  public constructor(cfg: SpreadSheetFacetCfg) {
    super(cfg);

    const s2 = this.spreadsheet;
    s2.on(S2Event.RANGE_SORT, (sortParams) => {
      let params = sortParams;
      // 兼容之前 sortParams 为对象的用法
      if (!Array.isArray(sortParams)) {
        params = [sortParams];
      }
      set(
        s2.dataCfg,
        'sortParams',
        params.map((item: TableSortParam) => ({
          ...item,
          // 兼容之前 sortKey 的用法
          sortFieldId: item.sortKey ?? item.sortFieldId,
        })),
      );
      s2.setDataCfg(s2.dataCfg);
      s2.render(true);
      s2.emit(
        S2Event.RANGE_SORTED,
        (s2.dataSet as TableDataSet).getDisplayDataSet(),
      );
    });

    s2.on(S2Event.RANGE_FILTER, (params) => {
      /** remove filter params on current key if passed an empty filterValues field */
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
    });
  }

  get dataCellTheme() {
    return this.spreadsheet.theme.dataCell.cell;
  }

  protected calculateCornerBBox() {
    const { colsHierarchy } = this.layoutResult;
    const height = Math.floor(colsHierarchy.height);

    this.cornerBBox = new CornerBBox(this);

    this.cornerBBox.height = height;
    this.cornerBBox.maxY = height;
  }

  public destroy() {
    super.destroy();
    this.spreadsheet.off(S2Event.RANGE_SORT);
    this.spreadsheet.off(S2Event.RANGE_FILTER);
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
      const { frozenTrailingColCount, frozenTrailingRowCount } =
        getValidFrozenOptions(
          this.cfg,
          colLeafNodes.length,
          cellRange.end - cellRange.start + 1,
        );

      let data;

      const width = this.panelBBox.maxX;
      const colLength = colLeafNodes.length;

      let x = col.x;
      let y = this.viewCellHeights.getCellOffsetY(rowIndex);

      if (
        isFrozenTrailingRow(rowIndex, cellRange.end, frozenTrailingRowCount)
      ) {
        y =
          this.panelBBox.maxY -
          this.getTotalHeightForRange(rowIndex, cellRange.end);
      }

      if (isFrozenTrailingCol(colIndex, frozenTrailingColCount, colLength)) {
        x =
          width -
          colLeafNodes
            .slice(-(colLength - colIndex))
            .reduce((prev, item, idx) => {
              return prev + item.width;
            }, 0);
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
      return Math.max(cellCfg.width, canvasW / Math.max(1, colHeaderColSize));
    }
    return cellCfg.width;
  }

  private getColNodeHeight(col: Node) {
    const { colCfg } = this.cfg;
    // 明细表所有列节点高度保持一致
    const userDragHeight = Object.values(get(colCfg, `heightByField`))[0];
    return userDragHeight || colCfg.height;
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
    const { frozenTrailingColCount } = getValidFrozenOptions(
      this.spreadsheet?.options,
      allNodes.length,
    );

    const adaptiveColWitdth = this.getAdaptiveColWidth(colLeafNodes);

    const nodes = [];

    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];

      currentNode.colIndex = i;
      currentNode.x = preLeafNode.x + preLeafNode.width;
      currentNode.width = this.calculateColLeafNodesWidth(
        currentNode,
        adaptiveColWitdth,
      );
      preLeafNode = currentNode;
      currentNode.y = 0;

      currentNode.height = this.getColNodeHeight(currentNode);

      nodes.push(currentNode);

      layoutCoordinate(this.cfg, null, currentNode);

      colsHierarchy.width += currentNode.width;
    }

    preLeafNode = Node.blankNode();

    const canvasW = this.getCanvasHW().width;

    if (frozenTrailingColCount > 0) {
      for (let i = 1; i <= allNodes.length; i++) {
        const currentNode = allNodes[allNodes.length - i];

        if (
          currentNode.colIndex >=
          colLeafNodes.length - frozenTrailingColCount
        ) {
          if (currentNode.colIndex === allNodes.length - 1) {
            currentNode.x = canvasW - currentNode.width;
          } else {
            currentNode.x = preLeafNode.x - currentNode.width;
          }
          preLeafNode = currentNode;
        }
      }
    }
  }

  private calculateColLeafNodesWidth(
    col: Node,
    adaptiveColWitdth: number,
  ): number {
    const { colCfg, dataSet, spreadsheet } = this.cfg;
    const layoutWidthType = this.spreadsheet.getLayoutWidthType();

    const userDragWidth = get(
      get(colCfg, 'widthByFieldValue'),
      `${col.value}`,
      col.width,
    );
    let colWidth: number;
    if (userDragWidth) {
      colWidth = userDragWidth;
    } else {
      if (layoutWidthType === LayoutWidthTypes.Compact) {
        const datas = dataSet.getDisplayDataSet();
        const colLabel = col.label;

        const allLabels =
          datas?.map((data) => `${data[col.key]}`)?.slice(0, 50) || []; // 采样取了前50
        allLabels.push(colLabel);
        const maxLabel = maxBy(allLabels, (label) =>
          measureTextWidthRoughly(label),
        );

        const { bolderText: colCellTextStyle } = spreadsheet.theme.colCell;
        const { text: dataCellTextStyle, cell: cellStyle } =
          spreadsheet.theme.dataCell;

        DebuggerUtil.getInstance().logger(
          'Max Label In Col:',
          col.field,
          maxLabel,
        );

        // 最长的 Label 如果是列名，按列名的标准计算宽度
        if (colLabel === maxLabel) {
          colWidth =
            measureTextWidth(maxLabel, colCellTextStyle) +
            getOccupiedWidthForTableCol(
              this.spreadsheet,
              col,
              spreadsheet.theme.colCell,
            );
        } else {
          colWidth =
            measureTextWidth(maxLabel, dataCellTextStyle) +
            cellStyle.padding.left +
            cellStyle.padding.right;
        }
      } else {
        colWidth = adaptiveColWitdth;
      }

      if (col.field === SERIES_NUMBER_FIELD) {
        colWidth = this.getSeriesNumberWidth();
      }
    }

    return colWidth;
  }

  protected getDefaultCellHeight() {
    const { cellCfg } = this.cfg;

    return (
      cellCfg.height +
      this.dataCellTheme.padding?.top +
      this.dataCellTheme.padding?.bottom
    );
  }

  public getCellHeight(index: number) {
    if (this.rowOffsets) {
      const heightByField = get(
        this.spreadsheet,
        'options.style.rowCfg.heightByField',
        {},
      );

      const customHeight = heightByField[String(index)];
      if (customHeight) {
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
          heightByField[String(idx)] ?? this.getDefaultCellHeight();
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
        if (offset <= 0) return 0;
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
    if (start < 0 || end < 0) return 0;

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
    const colLeafNodes = this.layoutResult.colLeafNodes;
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
    };

    const horizontalBorderStyle = {
      lineWidth: style?.horizontalBorderWidth,
      stroke: style?.horizontalBorderColor,
      opacity: style?.horizontalBorderColorOpacity,
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
            y: y,
            width: width,
            height: style.shadowWidth,
            fill: this.getShadowFill(90),
          },
        });
      }
    }

    if (frozenTrailingColCount > 0) {
      const width = colLeafNodes.reduceRight((prev, item, idx) => {
        if (idx >= colLeafNodes.length - frozenTrailingColCount) {
          return prev + item.width;
        }
        return prev;
      }, 0);

      const x = panelWidth - width;
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
    const colLength = this.layoutResult.colLeafNodes.length;
    const cellRange = this.getCellRange();

    const {
      frozenRowCount,
      frozenColCount,
      frozenTrailingRowCount,
      frozenTrailingColCount,
    } = getValidFrozenOptions(
      this.spreadsheet.options,
      colLength,
      cellRange.end - cellRange.start + 1,
    );

    const result = calculateFrozenCornerCells(
      {
        frozenRowCount,
        frozenColCount,
        frozenTrailingRowCount,
        frozenTrailingColCount,
      },
      colLength,
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
    if (viewMeta) {
      const cell = this.cfg.dataCell(viewMeta);
      group.add(cell);
    }
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

    const frozenCellType = getFrozenDataCellType(
      cell.getMeta(),
      {
        frozenRowCount,
        frozenColCount,
        frozenTrailingRowCount,
        frozenTrailingColCount,
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
      : (resize as ResizeActiveOptions)?.rowCellVertical;
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
    const allCells: TableRowCell[] = getAllChildCells(
      this.panelGroup.getChildren() as IElement[],
      TableRowCell,
    );

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

    const colLeafNodes = this.layoutResult.colLeafNodes;
    const viewCellHeights = this.viewCellHeights;
    const cellRange = this.getCellRange();
    const { col, row, trailingCol, trailingRow } = this.frozenGroupInfo;

    if (frozenColCount > 0) {
      col.width =
        colLeafNodes[frozenColCount - 1].x +
        colLeafNodes[frozenColCount - 1].width -
        0;
      col.range = [0, frozenColCount - 1];
    }

    if (frozenRowCount > 0) {
      row.height =
        viewCellHeights.getCellOffsetY(cellRange.start + frozenRowCount) -
        viewCellHeights.getCellOffsetY(cellRange.start);
      row.range = [cellRange.start, cellRange.start + frozenRowCount];
    }

    if (frozenTrailingColCount > 0) {
      trailingCol.width =
        colLeafNodes[colLeafNodes.length - 1].x -
        colLeafNodes[colLeafNodes.length - frozenTrailingColCount].x +
        colLeafNodes[colLeafNodes.length - 1].width;
      trailingCol.range = [
        colLeafNodes.length - frozenTrailingColCount,
        colLeafNodes.length - 1,
      ];
    }

    if (frozenTrailingRowCount > 0) {
      trailingRow.height =
        viewCellHeights.getCellOffsetY(cellRange.end + 1) -
        viewCellHeights.getCellOffsetY(
          cellRange.end + 1 - frozenTrailingRowCount,
        );
      trailingRow.range = [
        cellRange.end - frozenTrailingRowCount,
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
    translateGroupX(
      this.spreadsheet.frozenRowGroup,
      this.cornerBBox.width - scrollX,
    );
    translateGroupX(
      this.spreadsheet.frozenTrailingRowGroup,
      this.cornerBBox.width - scrollX,
    );
    translateGroupY(
      this.spreadsheet.frozenColGroup,
      this.cornerBBox.height - scrollY,
    );
    translateGroupY(
      this.spreadsheet.frozenTrailingColGroup,
      this.cornerBBox.height - scrollY,
    );

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
      const { trailingCol, col } = this.frozenGroupInfo;
      finalViewport.width -= trailingCol.width + col.width;
      finalViewport.x += col.width;
    }

    if (frozenTrailingRowCount > 0 || frozenRowCount > 0) {
      const { row, trailingRow } = this.frozenGroupInfo;

      finalViewport.height -= row.height + trailingRow.height;
      finalViewport.y += row.height;
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

    return splitInViewIndexesWithFrozen(
      indexes,
      {
        frozenColCount,
        frozenRowCount,
        frozenTrailingColCount,
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

    frozenColGroup.setClip({
      type: 'rect',
      attrs: {
        x: 0,
        y: scrollY + frozenRowGroupHeight,
        width: frozenColGroupWidth,
        height: panelScrollGroupHeight,
      },
    });

    frozenTrailingColGroup.setClip({
      type: 'rect',
      attrs: {
        x: frozenTrailingColBBox.minX,
        y: scrollY + frozenRowGroupHeight,
        width: frozenTrailingColBBox.width,
        height: panelScrollGroupHeight,
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
}
