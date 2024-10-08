import { Group, Rect, type LineStyleProps } from '@antv/g';
import { last } from 'lodash';
import type { DataCell } from '../cell';
import type { S2BaseFrozenOptions, SplitLine } from '../common';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FrozenGroupArea,
  FrozenGroupAreaTypeMap,
  FrozenGroupType,
  KEY_GROUP_FROZEN_SPLIT_LINE,
  PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
  S2Event,
  SPLIT_LINE_WIDTH,
} from '../common/constant';
import type {
  FrozenGroupAreas,
  FrozenGroups,
} from '../common/interface/frozen';
import type { SimpleBBox } from '../engine';
import { FrozenGroup } from '../group/frozen-group';
import {
  getValidFrozenOptions,
  renderLine,
  waitForCellMounted,
} from '../utils';
import {
  getColsForGrid,
  getFrozenRowsForGrid,
  getRowsForGrid,
} from '../utils/grid';
import type { Indexes, PanelIndexes } from '../utils/indexes';
import { floor } from '../utils/math';
import { BaseFacet } from './base-facet';
import {
  getFrozenColOffset,
  getFrozenTrailingColOffset,
  getFrozenTrailingRowOffset,
  getScrollGroupClip,
} from './header/util';
import { Node } from './layout/node';
import {
  calculateFrozenCornerCells,
  calculateInViewIndexes,
  getFrozenGroupTypeByCell,
  splitInViewIndexesWithFrozen,
  translateGroup,
} from './utils';

/**
 * Defines the row freeze  abstract standard interface
 */
export abstract class FrozenFacet extends BaseFacet {
  public rowOffsets: number[];

  public frozenGroups: FrozenGroups;

  public frozenGroupAreas = {
    [FrozenGroupArea.Col]: {
      width: 0,
      x: 0,
      range: [] as number[],
    },
    [FrozenGroupArea.TrailingCol]: {
      width: 0,
      x: 0,
      range: [] as number[],
    },
    [FrozenGroupArea.Row]: {
      height: 0,
      y: 0,
      range: [] as number[],
    },
    [FrozenGroupArea.TrailingRow]: {
      height: 0,
      y: 0,
      range: [] as number[],
    },
  } satisfies FrozenGroupAreas;

  protected validFrozenOptions: Required<S2BaseFrozenOptions>;

  public panelScrollGroupIndexes: Indexes = [0, 0, 0, 0];

  protected override initPanelGroups(): void {
    super.initPanelGroups();

    /* init frozen groups */
    this.frozenGroups = [
      FrozenGroupType.Row,
      FrozenGroupType.Col,
      FrozenGroupType.TrailingRow,
      FrozenGroupType.TrailingCol,
      FrozenGroupType.TopLeft,
      FrozenGroupType.TopRight,
      FrozenGroupType.BottomLeft,
      FrozenGroupType.BottomRight,
    ].reduce((acc, name) => {
      const frozenGroup = new FrozenGroup({
        name,
        zIndex: PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
        s2: this.spreadsheet,
      });

      this.panelGroup.appendChild(frozenGroup);
      acc[name] = frozenGroup;

      return acc;
    }, {} as FrozenGroups);
  }

  /**
   * 获取冻结数量结果，主要是针对 col top level 的结果
   */
  public getFrozenOptions() {
    if (!this.validFrozenOptions) {
      const colLength = this.getColLeafNodes().length;
      const cellRange = this.getCellRange();

      this.validFrozenOptions = getValidFrozenOptions(
        this.spreadsheet.options.frozen!,
        colLength,
        cellRange.end - cellRange.start + 1,
      );
    }

    return this.validFrozenOptions;
  }

  public calculateFrozenGroupInfo() {
    const { colCount, rowCount, trailingColCount, trailingRowCount } =
      this.getFrozenOptions();

    const viewCellHeights = this.viewCellHeights;
    const cellRange = this.getCellRange();
    const leafColNodes = this.getColLeafNodes();

    if (colCount > 0) {
      this.frozenGroupAreas[FrozenGroupArea.Col].width =
        leafColNodes[colCount - 1].x + leafColNodes[colCount - 1].width;
      this.frozenGroupAreas[FrozenGroupArea.Col].x = 0;
      this.frozenGroupAreas[FrozenGroupArea.Col].range = [0, colCount - 1];
    }

    if (rowCount > 0) {
      this.frozenGroupAreas[FrozenGroupArea.Row].height =
        viewCellHeights.getCellOffsetY(cellRange.start + rowCount) -
        viewCellHeights.getCellOffsetY(cellRange.start);
      this.frozenGroupAreas[FrozenGroupArea.Row].y =
        viewCellHeights.getCellOffsetY(cellRange.start);
      this.frozenGroupAreas[FrozenGroupArea.Row].range = [
        cellRange.start,
        cellRange.start + rowCount - 1,
      ];
    }

    if (trailingColCount > 0) {
      this.frozenGroupAreas[FrozenGroupArea.TrailingCol].width =
        leafColNodes[leafColNodes.length - 1].x -
        leafColNodes[leafColNodes.length - trailingColCount].x +
        leafColNodes[leafColNodes.length - 1].width;
      this.frozenGroupAreas[FrozenGroupArea.TrailingCol].x =
        leafColNodes[leafColNodes.length - trailingColCount].x;
      this.frozenGroupAreas[FrozenGroupArea.TrailingCol].range = [
        leafColNodes.length - trailingColCount,
        leafColNodes.length - 1,
      ];
    }

    if (trailingRowCount > 0) {
      this.frozenGroupAreas[FrozenGroupArea.TrailingRow].height =
        viewCellHeights.getCellOffsetY(cellRange.end + 1) -
        viewCellHeights.getCellOffsetY(cellRange.end + 1 - trailingRowCount);
      this.frozenGroupAreas[FrozenGroupArea.TrailingRow].y =
        viewCellHeights.getCellOffsetY(cellRange.end + 1 - trailingRowCount);
      this.frozenGroupAreas[FrozenGroupArea.TrailingRow].range = [
        cellRange.end - trailingRowCount + 1,
        cellRange.end,
      ];
    }
  }

  protected getFinalViewport() {
    const { viewportHeight: height, viewportWidth: width } = this.panelBBox;

    const { colCount, rowCount, trailingColCount, trailingRowCount } =
      this.getFrozenOptions();

    const finalViewport: SimpleBBox = {
      width,
      height,
      x: 0,
      y: 0,
    };

    if (colCount > 0 || trailingColCount > 0) {
      finalViewport.width -=
        this.frozenGroupAreas[FrozenGroupArea.Col].width! +
        this.frozenGroupAreas[FrozenGroupArea.TrailingCol].width!;
      finalViewport.x += this.frozenGroupAreas[FrozenGroupArea.Col].width!;
    }

    if (rowCount > 0 || trailingRowCount > 0) {
      // canvas 高度小于 row height 和 trailingRow height 的时候 height 为 0
      if (
        finalViewport.height <
        this.frozenGroupAreas[FrozenGroupArea.Row].height! +
          this.frozenGroupAreas[FrozenGroupArea.TrailingRow].height!
      ) {
        finalViewport.height = 0;
        finalViewport.y = 0;
      } else {
        finalViewport.height -=
          this.frozenGroupAreas[FrozenGroupArea.Row].height! +
          this.frozenGroupAreas[FrozenGroupArea.TrailingRow].height!;
        finalViewport.y += this.frozenGroupAreas[FrozenGroupArea.Row].height!;
      }
    }

    return finalViewport;
  }

  public calculateXYIndexes(scrollX: number, scrollY: number): PanelIndexes {
    const finalViewport: SimpleBBox = this.getFinalViewport();

    const indexes =
      this.spreadsheet.isTableMode() && this.spreadsheet.dataSet?.isEmpty?.()
        ? this.spreadsheet.dataSet.getEmptyViewIndexes()
        : calculateInViewIndexes({
            scrollX,
            scrollY,
            widths: this.viewCellWidths,
            heights: this.viewCellHeights,
            viewport: finalViewport,
            rowRemainWidth: this.getRealScrollX(this.cornerBBox.width),
          });

    this.panelScrollGroupIndexes = indexes;

    const colLength = this.getColLeafNodes().length;
    const cellRange = this.getCellRange();

    return splitInViewIndexesWithFrozen(
      indexes,
      this.getFrozenOptions(),
      colLength,
      cellRange,
    );
  }

  addDataCell = (cell: DataCell) => {
    const colLeafLength = this.getColLeafNodes().length;
    const cellRange = this.getCellRange();

    const frozenGroupType = getFrozenGroupTypeByCell(
      cell.getMeta(),
      this.getFrozenOptions(),
      colLeafLength,
      cellRange,
    );

    if (frozenGroupType === FrozenGroupType.Scroll) {
      this.panelScrollGroup.appendChild(cell);
    } else {
      this.frozenGroups[frozenGroupType].appendChild(cell);
    }

    waitForCellMounted(() => {
      this.spreadsheet.emit(S2Event.DATA_CELL_RENDER, cell);
      this.spreadsheet.emit(S2Event.LAYOUT_CELL_RENDER, cell);
    });
  };

  addFrozenCell = (colIndex: number, rowIndex: number, group: Group) => {
    const viewMeta = this.getCellMeta(rowIndex, colIndex);

    if (viewMeta) {
      viewMeta['isFrozenCorner'] = true;
      const cell = this.spreadsheet.options.dataCell?.(
        viewMeta,
        this.spreadsheet,
      )!;

      group.appendChild(cell);
    }
  };

  protected updateFrozenGroupGrid(): void {
    [
      FrozenGroupArea.Col,
      FrozenGroupArea.Row,
      FrozenGroupArea.TrailingCol,
      FrozenGroupArea.TrailingRow,
    ].forEach((key) => {
      if (!this.frozenGroupAreas[key].range) {
        return;
      }

      let cols: number[] = [];
      let rows: number[] = [];

      if (key.toLowerCase().includes('row')) {
        const [rowMin, rowMax] = this.frozenGroupAreas[key].range || [];

        cols = this.gridInfo.cols;
        rows = getRowsForGrid(rowMin, rowMax, this.viewCellHeights);

        if (key === FrozenGroupArea.TrailingRow) {
          const top = this.frozenGroupAreas[FrozenGroupArea.TrailingRow].y;

          rows = getFrozenRowsForGrid(
            rowMin,
            rowMax,
            top,
            this.viewCellHeights,
          );
        }
      } else {
        const [colMin, colMax] = this.frozenGroupAreas[key].range || [];
        const nodes = this.getColLeafNodes();

        cols = getColsForGrid(colMin, colMax, nodes);
        rows = this.gridInfo.rows;
      }

      const frozenGroup = FrozenGroupAreaTypeMap[key];

      this.frozenGroups[frozenGroup].updateGrid(
        {
          cols,
          rows,
        },
        frozenGroup,
      );
    });
  }

  public updatePanelScrollGroup(): void {
    super.updatePanelScrollGroup();
    this.updateFrozenGroupGrid();
  }

  protected translateRelatedGroups(
    scrollX: number,
    scrollY: number,
    hRowScroll: number,
  ) {
    super.translateRelatedGroups(scrollX, scrollY, hRowScroll);
    this.translateFrozenGroups();
    this.renderRowResizeArea();
    this.renderFrozenGroupSplitLine(scrollX, scrollY);
  }

  protected translateFrozenGroups = () => {
    const { scrollY, scrollX } = this.getScrollOffset();
    const paginationScrollY = this.getPaginationScrollY();

    const { x, y, viewportWidth, viewportHeight } = this.panelBBox;

    const colOffset = getFrozenColOffset(this, this.cornerBBox.width, scrollX);

    const trailingColOffset = getFrozenTrailingColOffset(this, viewportWidth);

    const trailingRowOffset = getFrozenTrailingRowOffset(
      this,
      viewportHeight,
      paginationScrollY,
    );

    translateGroup(
      this.frozenGroups[FrozenGroupType.TopLeft],
      x - colOffset,
      y - paginationScrollY,
    );

    translateGroup(
      this.frozenGroups[FrozenGroupType.TopRight],
      x - trailingColOffset,
      y - paginationScrollY,
    );

    translateGroup(
      this.frozenGroups[FrozenGroupType.BottomLeft],
      x - colOffset,
      y - trailingRowOffset,
    );

    translateGroup(
      this.frozenGroups[FrozenGroupType.BottomRight],
      x - trailingColOffset,
      y - trailingRowOffset,
    );

    translateGroup(
      this.frozenGroups[FrozenGroupType.Row],
      x - scrollX,
      y - paginationScrollY,
    );
    translateGroup(
      this.frozenGroups[FrozenGroupType.TrailingRow],
      x - scrollX,
      y - trailingRowOffset,
    );

    translateGroup(
      this.frozenGroups[FrozenGroupType.Col],
      x - colOffset,
      y - scrollY - paginationScrollY,
    );
    translateGroup(
      this.frozenGroups[FrozenGroupType.TrailingCol],
      x - trailingColOffset,
      y - scrollY - paginationScrollY,
    );
  };

  protected renderRowResizeArea() {}

  // eslint-disable-next-line max-lines-per-function
  protected renderFrozenGroupSplitLine = (scrollX: number, scrollY: number) => {
    // 在分页条件下需要额外处理 Y 轴滚动值
    const relativeScrollY = Math.floor(scrollY - this.getPaginationScrollY());

    // remove previous split line group
    this.foregroundGroup.getElementById(KEY_GROUP_FROZEN_SPLIT_LINE)?.remove();

    const { splitLine } = this.spreadsheet.theme;
    const splitLineGroup = this.foregroundGroup.appendChild(
      new Group({
        id: KEY_GROUP_FROZEN_SPLIT_LINE,
        style: {
          zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
        },
      }),
    );

    const verticalBorderStyle: Partial<LineStyleProps> = {
      lineWidth: SPLIT_LINE_WIDTH,
      stroke: splitLine?.verticalBorderColor,
      opacity: splitLine?.verticalBorderColorOpacity,
    };

    const horizontalBorderStyle: Partial<LineStyleProps> = {
      lineWidth: SPLIT_LINE_WIDTH,
      stroke: splitLine?.horizontalBorderColor,
      opacity: splitLine?.horizontalBorderColorOpacity,
    };

    this.renderFrozenColSplitLine(
      splitLineGroup,
      splitLine,
      verticalBorderStyle,
      scrollX,
    );

    this.renderFrozenTrailingColSplitLine(
      splitLineGroup,
      splitLine,
      verticalBorderStyle,
      scrollX,
    );
    this.renderFrozenRowSplitLine(
      splitLineGroup,
      splitLine,
      horizontalBorderStyle,
      relativeScrollY,
    );

    this.renderFrozenTrailingRowSplitLine(
      splitLineGroup,
      splitLine,
      horizontalBorderStyle,
      relativeScrollY,
    );
  };

  protected getFrozenColSplitLineSize() {
    const { viewportHeight, y: panelBBoxStartY } = this.panelBBox;

    const height = viewportHeight + panelBBoxStartY;

    return {
      y: 0,
      height,
    };
  }

  protected renderFrozenColSplitLine(
    splitLineGroup: Group,
    splitLine: SplitLine,
    verticalBorderStyle: Partial<LineStyleProps>,
    scrollX: number,
  ) {
    const { colCount } = this.getFrozenOptions();
    const { x: panelBBoxStartX } = this.panelBBox;

    if (colCount > 0) {
      const cornerWidth = this.cornerBBox.width;
      const colOffset = getFrozenColOffset(this, cornerWidth, scrollX);
      const x =
        panelBBoxStartX +
        this.frozenGroupAreas[FrozenGroupArea.Col].width -
        colOffset;

      const { y, height } = this.getFrozenColSplitLineSize();

      renderLine(splitLineGroup, {
        ...verticalBorderStyle,
        x1: x,
        x2: x,
        y1: y,
        y2: y + height,
      });

      if (
        splitLine?.showShadow &&
        scrollX > 0 &&
        (this.spreadsheet.isFrozenRowHeader() || colOffset >= cornerWidth)
      ) {
        splitLineGroup.appendChild(
          new Rect({
            style: {
              x,
              y,
              width: splitLine?.shadowWidth!,
              height,
              fill: this.getShadowFill(0),
            },
          }),
        );
      }
    }
  }

  protected renderFrozenTrailingColSplitLine(
    splitLineGroup: Group,
    splitLine: SplitLine,
    verticalBorderStyle: Partial<LineStyleProps>,
    scrollX: number,
  ) {
    const { trailingColCount } = this.getFrozenOptions();
    const { viewportWidth, x: panelBBoxStartX } = this.panelBBox;

    if (trailingColCount > 0) {
      const x =
        viewportWidth -
        this.frozenGroupAreas[FrozenGroupArea.TrailingCol].width +
        panelBBoxStartX;

      const { y, height } = this.getFrozenColSplitLineSize();

      const maxScrollX = Math.max(
        0,
        last(this.viewCellWidths)! - viewportWidth,
      );

      renderLine(splitLineGroup, {
        ...verticalBorderStyle,
        x1: x,
        x2: x,
        y1: y,
        y2: y + height,
      });

      if (splitLine?.showShadow && floor(scrollX) < floor(maxScrollX)) {
        splitLineGroup.appendChild(
          new Rect({
            style: {
              x: x - splitLine.shadowWidth!,
              y,
              width: splitLine.shadowWidth!,
              height,
              fill: this.getShadowFill(180),
            },
          }),
        );
      }
    }
  }

  protected getFrozenRowSplitLineSize() {
    const { viewportWidth, x: panelBBoxStartX } = this.panelBBox;
    const width = panelBBoxStartX + viewportWidth;

    return {
      x: 0,
      width,
    };
  }

  protected renderFrozenRowSplitLine(
    splitLineGroup: Group,
    splitLine: SplitLine,
    horizontalBorderStyle: Partial<LineStyleProps>,
    scrollY: number,
  ) {
    const { rowCount } = this.getFrozenOptions();
    const { y: panelBBoxStartY } = this.panelBBox;

    if (rowCount > 0) {
      const y =
        panelBBoxStartY + this.frozenGroupAreas[FrozenGroupArea.Row].height;
      const { x, width } = this.getFrozenRowSplitLineSize();

      renderLine(splitLineGroup, {
        ...horizontalBorderStyle,
        x1: x,
        x2: x + width,
        y1: y,
        y2: y,
      });

      if (splitLine?.showShadow && scrollY > 0) {
        splitLineGroup.appendChild(
          new Rect({
            style: {
              x,
              y,
              width,
              height: splitLine?.shadowWidth!,
              fill: this.getShadowFill(90),
            },
          }),
        );
      }
    }
  }

  protected renderFrozenTrailingRowSplitLine(
    splitLineGroup: Group,
    splitLine: SplitLine,
    horizontalBorderStyle: Partial<LineStyleProps>,
    scrollY: number,
  ) {
    const { trailingRowCount } = this.getFrozenOptions();
    const { viewportHeight } = this.panelBBox;

    if (trailingRowCount > 0) {
      const y =
        this.panelBBox.maxY -
        this.frozenGroupAreas[FrozenGroupArea.TrailingRow].height;

      const { x, width } = this.getFrozenRowSplitLineSize();

      const cellRange = this.getCellRange();
      // scroll boundary
      const maxScrollY = Math.max(
        0,
        this.viewCellHeights.getCellOffsetY(cellRange.end + 1) -
          this.viewCellHeights.getCellOffsetY(cellRange.start) -
          viewportHeight,
      );

      renderLine(splitLineGroup, {
        ...horizontalBorderStyle,
        x1: x,
        x2: x + width,
        y1: y,
        y2: y,
      });

      if (splitLine?.showShadow && scrollY < floor(maxScrollY)) {
        splitLineGroup.appendChild(
          new Rect({
            style: {
              x,
              y: y - splitLine.shadowWidth!,
              width,
              height: splitLine.shadowWidth!,
              fill: this.getShadowFill(270),
            },
          }),
        );
      }
    }
  }

  public render() {
    this.calculateFrozenGroupInfo();
    this.renderFrozenPanelCornerGroup();
    super.render();
  }

  protected override getCenterFrameScrollX(scrollX: number): number {
    if (this.getFrozenOptions().colCount > 0) {
      return getFrozenColOffset(this, this.cornerBBox.width, scrollX);
    }

    return super.getCenterFrameScrollX(scrollX);
  }

  protected renderFrozenPanelCornerGroup = () => {
    const cellRange = this.getCellRange();

    const result = calculateFrozenCornerCells(
      this.getFrozenOptions(),
      this.getColLeafNodes().length,
      cellRange,
    );

    (Object.keys(result) as (keyof typeof result)[]).forEach((key) => {
      const cells = result[key];
      const group = this.frozenGroups[key];

      if (group) {
        cells.forEach((cell) => {
          this.addFrozenCell(cell.x, cell.y, group);
        });
      }
    });
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

  protected getDefaultCellHeight(): number {
    return this.getRowCellHeight(null as unknown as Node) ?? 0;
  }

  protected getShadowFill = (angle: number) => {
    const { splitLine } = this.spreadsheet.theme;

    return `l (${angle}) 0:${splitLine?.shadowColors?.left} 1:${splitLine?.shadowColors?.right}`;
  };

  protected clip() {
    const { scrollX } = this.getScrollOffset();

    const { x: panelScrollGroupClipX, width: panelScrollGroupClipWidth } =
      getScrollGroupClip(this, this.panelBBox);

    const frozenColGroupWidth =
      this.frozenGroupAreas[FrozenGroupArea.Col].width;
    const frozenTrailingColWidth =
      this.frozenGroupAreas[FrozenGroupArea.TrailingCol].width;
    const frozenRowGroupHeight =
      this.frozenGroupAreas[FrozenGroupArea.Row].height;
    const frozenTrailingRowHeight =
      this.frozenGroupAreas[FrozenGroupArea.TrailingRow].height;

    const panelScrollGroupClipY = this.panelBBox.y + frozenRowGroupHeight;

    const panelScrollGroupClipHeight =
      this.panelBBox.viewportHeight -
      frozenRowGroupHeight -
      frozenTrailingRowHeight;

    this.panelScrollGroup.style.clipPath = new Rect({
      style: {
        x: panelScrollGroupClipX,
        y: panelScrollGroupClipY,
        width: panelScrollGroupClipWidth,
        height: panelScrollGroupClipHeight,
      },
    });

    /* frozen groups clip */
    this.frozenGroups[FrozenGroupType.Col].style.clipPath = new Rect({
      style: {
        x:
          this.panelBBox.x -
          getFrozenColOffset(this, this.cornerBBox.width, scrollX),
        y: panelScrollGroupClipY,
        width: frozenColGroupWidth,
        height: panelScrollGroupClipHeight,
      },
    });

    this.frozenGroups[FrozenGroupType.TrailingCol].style.clipPath = new Rect({
      style: {
        x:
          this.panelBBox.x +
          this.panelBBox.viewportWidth -
          frozenTrailingColWidth,
        y: panelScrollGroupClipY,
        width: frozenTrailingColWidth,
        height: panelScrollGroupClipHeight,
      },
    });

    this.frozenGroups[FrozenGroupType.Row].style.clipPath = new Rect({
      style: {
        x: panelScrollGroupClipX,
        y: this.panelBBox.y,
        width: panelScrollGroupClipWidth,
        height: frozenRowGroupHeight,
      },
    });

    this.frozenGroups[FrozenGroupType.TrailingRow].style.clipPath = new Rect({
      style: {
        x: panelScrollGroupClipX,
        y:
          this.panelBBox.y +
          this.panelBBox.viewportHeight -
          frozenTrailingRowHeight,
        width: panelScrollGroupClipWidth,
        height: frozenTrailingRowHeight,
      },
    });
  }
}
