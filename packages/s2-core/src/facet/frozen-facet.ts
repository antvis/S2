import type { Group } from '@antv/g-canvas';
import { get, last } from 'lodash';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FrozenCellGroupMap,
  FrozenGroup,
  KEY_GROUP_FROZEN_SPLIT_LINE,
} from '../common/constant';
import type {
  S2CellType,
  S2TableSheetOptions,
  SplitLine,
  SpreadSheetFacetCfg,
  ViewMeta,
} from '../common/interface';
import type { Indexes, PanelIndexes } from '../utils/indexes';
import { getValidFrozenOptions, renderLine } from '../utils';
import {
  getColsForGrid,
  getFrozenRowsForGrid,
  getRowsForGrid,
} from '../utils/grid';
import {
  calculateInViewIndexes,
  getFrozenDataCellType,
  getFrozenLeafNodesCount,
  isTopLevelNode,
  splitInViewIndexesWithFrozen,
  translateGroup,
  translateGroupX,
  translateGroupY,
} from './utils';
import { BaseFacet } from './base-facet';

/**
 * Defines the row freeze  abstract standard interface
 */
export abstract class FrozenFacet extends BaseFacet {
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

  public panelScrollGroupIndexes: Indexes = [];

  public constructor(cfg: SpreadSheetFacetCfg) {
    super(cfg);
  }

  // The core process of freezing is as follows:
  // 1. prepareGroup

  // 1.1. spread-sheet defined group and added panelGroup

  // 1.2. prepare froznGroup info and init frozenGroup position
  public calculateFrozenGroupInfo() {
    const {
      frozenColCount,
      frozenRowCount,
      frozenTrailingColCount,
      frozenTrailingRowCount,
    } = this.getFrozenOptionsDirectly();

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

  // 2. renderGroupingNodes

  // 2.1. doLayout: "No public logic extraction, please define implementation in subclasses"

  // 2.2. calculate the offsets scrollX and scrollY, the index of the frozen nodes within the visible viewport is determined.
  public calculateXYIndexes(scrollX: number, scrollY: number): PanelIndexes {
    const colLength = this.layoutResult.colLeafNodes.length;
    const cellRange = this.getCellRange();

    const { viewportHeight: height, viewportWidth: width } = this.panelBBox;

    const {
      frozenColCount = 0,
      frozenRowCount = 0,
      frozenTrailingColCount = 0,
      frozenTrailingRowCount = 0,
    } = this.getFrozenOptionsDirectly();

    const finalViewport = {
      width,
      height,
      x: 0,
      y: 0,
    };

    if (frozenTrailingColCount > 0 || frozenColCount > 0) {
      const { frozenTrailingCol, frozenCol } = this.frozenGroupInfo;
      finalViewport.width -= frozenTrailingCol.width! + frozenCol.width!;
      finalViewport.x += frozenCol.width ?? 0;
    }

    if (frozenTrailingRowCount > 0 || frozenRowCount > 0) {
      const { frozenRow, frozenTrailingRow } = this.frozenGroupInfo;
      // canvas 高度小于row height和trailingRow height的时候 height 为 0
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

    const indexes =
      this.spreadsheet.isTableMode() && this.spreadsheet.dataSet?.isEmpty?.()
        ? this.spreadsheet.dataSet.getEmptyViewIndexes()
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

  // 2.3. Add the node to the frozen group.
  addCell = (cell: S2CellType<ViewMeta>) => {
    const {
      frozenRowCount,
      frozenColCount,
      frozenTrailingRowCount,
      frozenTrailingColCount,
    } = this.getBizRevisedFrozenOptions();
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
    if (group && this.spreadsheet[group]) {
      (this.spreadsheet[group] as Group).add(cell);
    }
  };

  // 2.4. update the coordinates of the frozen rows and columns' dividers based on scrollX and scrollY.
  protected updateFrozenGroupGrid(): void {
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

  public updatePanelScrollGroup(): void {
    super.updatePanelScrollGroup();
    this.updateFrozenGroupGrid();
  }

  // 3. scrollInteraction
  // 3.1. translate row and columns frozen group by scrollX and scrollY
  protected translateRelatedGroups(
    scrollX: number,
    scrollY: number,
    hRowScroll: number,
  ): void {
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

  // 3.2. frozen cell drawResizeArea
  protected updateRowResizeArea() {}

  // 3.3. render frozen group split line
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
      frozenRowCount = 0,
      frozenColCount = 0,
      frozenTrailingColCount = 0,
      frozenTrailingRowCount = 0,
    } = getValidFrozenOptions(
      this.getBizRevisedFrozenOptions(),
      colLeafNodes.length,
      dataLength,
    );

    // 在分页条件下需要额外处理 Y 轴滚动值
    const relativeScrollY = Math.floor(scrollY - this.getPaginationScrollY());

    // scroll boundary
    const maxScrollX = Math.max(
      0,
      (last(this.viewCellWidths) ?? 0) - viewportWidth,
    );
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
      zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
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
            x: x - (style.shadowWidth ?? 0),
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

  // 3.4. clip frozen group by scrolX and scrollY
  // 对 panelScrollGroup 以及四个方向的 frozenGroup 做 Clip，避免有透明度时冻结分组和滚动分组展示重叠
  protected clip(scrollX: number, scrollY: number) {
    const paginationScrollY = this.getPaginationScrollY();
    const {
      frozenRowGroup,
      frozenColGroup,
      frozenTrailingColGroup,
      frozenTrailingRowGroup,
      panelScrollGroup,
    } = this.spreadsheet;
    let frozenColGroupWidth = 0;
    let frozenRowGroupHeight = 0;
    let frozenTrailingRowGroupHeight = 0;
    if (frozenColGroup) {
      frozenColGroupWidth = frozenColGroup.getBBox().width;
    }
    if (frozenRowGroup) {
      frozenRowGroupHeight = frozenRowGroup.getBBox().height;
    }
    let frozenTrailingColBBox;
    if (frozenTrailingColGroup) {
      frozenTrailingColBBox = frozenTrailingColGroup.getBBox();
    }
    if (frozenTrailingRowGroup) {
      frozenTrailingRowGroupHeight = frozenTrailingRowGroup.getBBox().height;
    }
    const panelScrollGroupWidth =
      this.panelBBox.width -
      frozenColGroupWidth -
      (frozenTrailingColBBox?.width ?? 0);
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

    frozenTrailingRowGroup?.setClip({
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

    frozenColGroup?.setClip({
      type: 'rect',
      attrs: {
        ...colClipArea,
        x: 0,
        width: frozenColGroupWidth,
      },
    });

    frozenTrailingColGroup?.setClip({
      type: 'rect',
      attrs: {
        ...colClipArea,
        x: frozenTrailingColBBox?.minX ?? 0,
        width: frozenTrailingColBBox?.width ?? 0,
      },
    });
  }

  protected init(): void {
    super.init();
    this.initRowOffsets();
  }

  public render(): void {
    this.calculateFrozenGroupInfo();
    super.render();
    this.initFrozenGroupPosition();
  }

  private getFrozenOptionsDirectly(): S2TableSheetOptions {
    const colLength = this.layoutResult.colLeafNodes.length;
    const cellRange = this.getCellRange();

    return getValidFrozenOptions(
      this.getBizRevisedFrozenOptions(),
      colLength,
      cellRange.end - cellRange.start + 1,
    );
  }

  protected getBizRevisedFrozenOptions(): S2TableSheetOptions {
    const {
      frozenColCount,
      frozenRowCount,
      frozenTrailingColCount,
      frozenTrailingRowCount,
    } = this.cfg;
    return {
      frozenColCount,
      frozenRowCount,
      frozenTrailingColCount,
      frozenTrailingRowCount,
    };
  }

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

  private initRowOffsets() {
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

  protected getDefaultCellHeight() {
    const { cellCfg } = this.cfg;

    return cellCfg?.height ?? 0;
  }

  protected getShadowFill = (angle: number) => {
    const style: SplitLine = get(this.cfg, 'spreadsheet.theme.splitLine');
    return `l (${angle}) 0:${style.shadowColors?.left} 1:${style.shadowColors?.right}`;
  };
}
