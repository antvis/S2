import type { Event as CanvasEvent, IShape, Point } from '@antv/g-canvas';
import { cloneDeep, isNil, throttle } from 'lodash';
import {
  FRONT_GROUND_GROUP_BRUSH_SELECTION_Z_INDEX,
  ScrollDirection,
} from '../common/constant';
import {
  BRUSH_AUTO_SCROLL_INITIAL_CONFIG,
  InteractionBrushSelectionStage,
} from '../common/constant/interaction';
import type {
  BrushAutoScrollConfig,
  BrushPoint,
  BrushRange,
  OriginalEvent,
  S2CellType,
  ViewMeta,
} from '../common/interface';
import type { TableFacet } from '../facet';
import {
  isFrozenCol,
  isFrozenRow,
  isFrozenTrailingCol,
  isFrozenTrailingRow,
} from '../facet/utils';
import {
  getScrollOffsetForCol,
  getScrollOffsetForRow,
} from '../utils/interaction/';
import {
  getCellMeta,
  updateRowColCells,
} from '../utils/interaction/select-event';
import { getValidFrozenOptions } from '../utils/layout/frozen';
import type { BaseEventImplement } from './base-event';
import { BaseEvent } from './base-interaction';

/**
 * Panel area's brush selection interaction
 */
export class BaseBrushSelection
  extends BaseEvent
  implements BaseEventImplement
{
  public displayedDataCells: S2CellType[] = [];

  public prepareSelectMaskShape: IShape;

  public startBrushPoint: BrushPoint;

  public endBrushPoint: BrushPoint;

  public brushRangeDataCells: S2CellType[] = [];

  public brushSelectionStage = InteractionBrushSelectionStage.UN_DRAGGED;

  public brushSelectionMinimumMoveDistance = 5;

  public scrollAnimationComplete = true;

  public mouseMoveDistanceFromCanvas = 0;

  public bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  protected getPrepareSelectMaskTheme() {
    return this.spreadsheet.theme?.prepareSelectMask;
  }

  protected initPrepareSelectMaskShape() {
    const { foregroundGroup } = this.spreadsheet;
    if (!foregroundGroup) {
      return;
    }
    foregroundGroup.removeChild(this.prepareSelectMaskShape);
    const prepareSelectMaskTheme = this.getPrepareSelectMaskTheme();
    this.prepareSelectMaskShape = foregroundGroup.addShape('rect', {
      visible: false,
      attrs: {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        fill: prepareSelectMaskTheme?.backgroundColor,
        fillOpacity: prepareSelectMaskTheme?.backgroundOpacity,
        zIndex: FRONT_GROUND_GROUP_BRUSH_SELECTION_Z_INDEX,
      },
      capture: false,
    });
  }

  protected setBrushSelectionStage(stage: InteractionBrushSelectionStage) {
    this.brushSelectionStage = stage;
  }

  // 默认是 Data cell 的绘制区
  protected isPointInCanvas(point: { x: number; y: number }): boolean {
    const { height, width } = this.spreadsheet.facet.getCanvasHW();
    const { minX, minY } = this.spreadsheet.facet.panelBBox;

    return (
      point.x > minX && point.x < width && point.y > minY && point.y < height
    );
  }

  private setMoveDistanceFromCanvas = (
    delta: { x: number; y: number },
    needScrollForX: boolean,
    needScrollForY: boolean,
  ) => {
    let deltaVal = 0;

    if (needScrollForX) {
      deltaVal = delta.x;
    }

    if (needScrollForY) {
      const deltaY = delta.y;

      if (needScrollForX) {
        deltaVal = Math.max(deltaY, deltaVal);
      } else {
        deltaVal = deltaY;
      }
    }

    this.mouseMoveDistanceFromCanvas = deltaVal;
  };

  public formatBrushPointForScroll = (delta: { x: number; y: number }) => {
    const { x, y } = delta;
    const { facet } = this.spreadsheet;
    const { minX, minY, maxX, maxY } = facet.panelBBox;
    let newX = this.endBrushPoint.x + x;
    let newY = this.endBrushPoint.y + y;
    let needScrollForX = true;
    let needScrollForY = true;
    const vScrollBarWidth = facet.vScrollBar?.getBBox()?.width;
    const extraPixel = 2; // 额外加缩进，保证 getShape 在 panelBox 内

    if (newX > maxX) {
      newX = maxX - vScrollBarWidth - extraPixel;
    } else if (newX < minX) {
      newX = minX + extraPixel;
    } else {
      needScrollForX = false;
    }

    if (newY > maxY) {
      newY = maxY - extraPixel;
    } else if (newY <= minY) {
      newY = minY + extraPixel;
    } else {
      needScrollForY = false;
    }

    return {
      x: {
        value: newX,
        needScroll: needScrollForX,
      },
      y: {
        value: newY,
        needScroll: needScrollForY,
      },
    };
  };

  private autoScrollIntervalId = null;

  protected autoScrollConfig: BrushAutoScrollConfig = cloneDeep(
    BRUSH_AUTO_SCROLL_INITIAL_CONFIG,
  );

  public validateYIndex = (yIndex: number) => {
    const { facet } = this.spreadsheet;
    const frozenInfo = (facet as TableFacet).frozenGroupInfo;
    let min = 0;
    const frozenRowRange = frozenInfo?.frozenRow?.range;
    if (frozenRowRange) {
      min = frozenRowRange[1] + 1;
    }
    if (yIndex < min) return null;

    let max = facet.getCellRange().end;
    const frozenTrailingRowRange = frozenInfo?.frozenTrailingRow?.range;
    if (frozenTrailingRowRange) {
      max = frozenTrailingRowRange[0] - 1;
    }
    if (yIndex > max) {
      return null;
    }

    return yIndex;
  };

  public validateXIndex = (xIndex: number) => {
    const { facet } = this.spreadsheet;
    const frozenInfo = (facet as TableFacet).frozenGroupInfo;

    let min = 0;
    const frozenColRange = frozenInfo?.frozenCol?.range;
    if (frozenColRange) {
      min = frozenColRange[1] + 1;
    }
    if (xIndex < min) return null;

    let max = facet.layoutResult.colLeafNodes.length - 1;
    const frozenTrailingColRange = frozenInfo?.frozenTrailingCol?.range;
    if (frozenTrailingColRange) {
      max = frozenTrailingColRange[0] - 1;
    }
    if (xIndex > max) {
      return null;
    }
    return xIndex;
  };

  public adjustNextColIndexWithFrozen = (
    colIndex: number,
    dir: ScrollDirection,
  ) => {
    const { facet, dataSet, options } = this.spreadsheet;
    const dataLength = dataSet.getDisplayDataSet().length;
    const colLength = facet.layoutResult.colLeafNodes.length;

    const { frozenTrailingColCount, frozenColCount } = getValidFrozenOptions(
      options,
      colLength,
      dataLength,
    );
    const panelIndexes = (facet as TableFacet).panelScrollGroupIndexes;
    if (
      frozenTrailingColCount > 0 &&
      dir === ScrollDirection.TRAILING &&
      isFrozenTrailingCol(colIndex, frozenTrailingColCount, colLength)
    ) {
      return panelIndexes[1];
    }

    if (
      frozenColCount > 0 &&
      dir === ScrollDirection.LEADING &&
      isFrozenCol(colIndex, frozenColCount)
    ) {
      return panelIndexes[0];
    }
    return colIndex;
  };

  public adjustNextRowIndexWithFrozen = (
    rowIndex: number,
    dir: ScrollDirection,
  ) => {
    const { facet, dataSet, options } = this.spreadsheet;
    const dataLength = dataSet.getDisplayDataSet().length;
    const colLength = facet.layoutResult.colLeafNodes.length;
    const cellRange = facet.getCellRange();
    const { frozenTrailingRowCount, frozenRowCount } = getValidFrozenOptions(
      options,
      colLength,
      dataLength,
    );
    const panelIndexes = (facet as TableFacet).panelScrollGroupIndexes;
    if (
      frozenTrailingRowCount > 0 &&
      dir === ScrollDirection.TRAILING &&
      isFrozenTrailingRow(rowIndex, cellRange.end, frozenTrailingRowCount)
    ) {
      return panelIndexes[3];
    }

    if (
      frozenRowCount > 0 &&
      dir === ScrollDirection.LEADING &&
      isFrozenRow(rowIndex, cellRange.start, frozenRowCount)
    ) {
      return panelIndexes[2];
    }
    return rowIndex;
  };

  private getNextScrollDelta = (config: BrushAutoScrollConfig) => {
    const { scrollX, scrollY } = this.spreadsheet.facet.getScrollOffset();

    let x = 0;
    let y = 0;

    if (config.y.scroll) {
      const dir =
        config.y.value > 0 ? ScrollDirection.TRAILING : ScrollDirection.LEADING;
      const rowIndex = this.adjustNextRowIndexWithFrozen(
        this.endBrushPoint.rowIndex,
        dir,
      );
      const nextIndex = this.validateYIndex(
        rowIndex + (config.y.value > 0 ? 1 : -1),
      );
      y = isNil(nextIndex)
        ? 0
        : getScrollOffsetForRow(nextIndex, dir, this.spreadsheet) - scrollY;
    }

    if (config.x.scroll) {
      const dir =
        config.x.value > 0 ? ScrollDirection.TRAILING : ScrollDirection.LEADING;
      const colIndex = this.adjustNextColIndexWithFrozen(
        this.endBrushPoint.colIndex,
        dir,
      );
      const nextIndex = this.validateXIndex(
        colIndex + (config.x.value > 0 ? 1 : -1),
      );
      x = isNil(nextIndex)
        ? 0
        : getScrollOffsetForCol(nextIndex, dir, this.spreadsheet) - scrollX;
    }

    return {
      x,
      y,
    };
  };

  private onScrollAnimationComplete = () => {
    this.scrollAnimationComplete = true;
    if (
      this.brushSelectionStage !== InteractionBrushSelectionStage.UN_DRAGGED
    ) {
      this.renderPrepareSelected(this.endBrushPoint);
    }
  };

  private autoScroll = () => {
    if (
      this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED ||
      !this.scrollAnimationComplete
    ) {
      return;
    }
    const config = this.autoScrollConfig;
    const scrollOffset = this.spreadsheet.facet.getScrollOffset();
    const offsetCfg = {
      offsetX: {
        value: scrollOffset.scrollX,
        animate: true,
      },
      offsetY: {
        value: scrollOffset.scrollY,
        animate: true,
      },
    };

    const { x: deltaX, y: deltaY } = this.getNextScrollDelta(config);
    if (deltaY === 0 && deltaX === 0) {
      this.clearAutoScroll();
      return;
    }

    if (config.y.scroll) {
      offsetCfg.offsetY.value += deltaY;
    }
    if (config.x.scroll) {
      offsetCfg.offsetX.value += deltaX;
      if (offsetCfg.offsetX.value < 0) {
        offsetCfg.offsetX.value = 0;
      }
    }

    this.scrollAnimationComplete = false;
    let ratio = 3;
    // x 轴滚动速度慢
    if (config.x.scroll) {
      ratio = 1;
    }

    this.spreadsheet.facet.scrollWithAnimation(
      offsetCfg,
      Math.max(16, 300 - this.mouseMoveDistanceFromCanvas * ratio),
      this.onScrollAnimationComplete,
    );
  };

  protected handleScroll = throttle((x, y) => {
    if (
      this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
    ) {
      return;
    }

    const {
      x: { value: newX, needScroll: needScrollForX },
      y: { value: newY, needScroll: needScrollForY },
    } = this.formatBrushPointForScroll({ x, y });

    const config = this.autoScrollConfig;
    if (needScrollForY) {
      config.y.value = y;
      config.y.scroll = true;
    }
    if (needScrollForX) {
      config.x.value = x;
      config.x.scroll = true;
    }

    this.setMoveDistanceFromCanvas({ x, y }, needScrollForX, needScrollForY);

    this.renderPrepareSelected({
      x: newX,
      y: newY,
    });

    if (needScrollForY || needScrollForX) {
      this.clearAutoScroll();
      this.autoScroll();
      this.autoScrollIntervalId = setInterval(this.autoScroll, 16);
    }
  }, 30);

  protected clearAutoScroll = () => {
    if (this.autoScrollIntervalId) {
      clearInterval(this.autoScrollIntervalId);
      this.autoScrollIntervalId = null;
      this.resetScrollDelta();
    }
  };

  protected resetDrag() {
    this.hidePrepareSelectMaskShape();
    this.setBrushSelectionStage(InteractionBrushSelectionStage.UN_DRAGGED);
  }

  protected isValidBrushSelection() {
    const { start, end } = this.getBrushRange();
    const isMovedEnoughDistance =
      end.x - start.x > this.brushSelectionMinimumMoveDistance ||
      end.y - start.y > this.brushSelectionMinimumMoveDistance;

    return isMovedEnoughDistance;
  }

  protected setDisplayedDataCells() {
    this.displayedDataCells =
      this.spreadsheet.interaction.getPanelGroupAllDataCells();
  }

  protected updatePrepareSelectMask() {
    const brushRange = this.getBrushRange();
    this.prepareSelectMaskShape.attr({
      x: brushRange.start.x,
      y: brushRange.start.y,
      width: brushRange.width,
      height: brushRange.height,
    });
    this.prepareSelectMaskShape.show();
  }

  public hidePrepareSelectMaskShape() {
    this.prepareSelectMaskShape?.hide();
  }

  protected resetScrollDelta() {
    this.autoScrollConfig = cloneDeep(BRUSH_AUTO_SCROLL_INITIAL_CONFIG);
  }

  protected getBrushPoint(event: CanvasEvent): BrushPoint {
    const { scrollY, scrollX } = this.spreadsheet.facet.getScrollOffset();
    const originalEvent = event.originalEvent as unknown as OriginalEvent;
    const point: Point = {
      x: event?.x ?? originalEvent?.layerX,
      y: event?.y ?? originalEvent?.layerY,
    };
    const cell = this.spreadsheet.getCell(event.target);
    const { colIndex, rowIndex } = cell.getMeta();

    return {
      ...point,
      rowIndex,
      colIndex,
      scrollY,
      scrollX,
    };
  }

  // 四个刷选方向: 左 => 右, 右 => 左, 上 => 下, 下 => 上, 将最终结果进行重新排序, 获取真实的 row, col index
  public getBrushRange(): BrushRange {
    const { scrollX, scrollY } = this.spreadsheet.facet.getScrollOffset();
    const minRowIndex = Math.min(
      this.startBrushPoint.rowIndex,
      this.endBrushPoint.rowIndex,
    );
    const maxRowIndex = Math.max(
      this.startBrushPoint.rowIndex,
      this.endBrushPoint.rowIndex,
    );
    const minColIndex = Math.min(
      this.startBrushPoint.colIndex,
      this.endBrushPoint.colIndex,
    );
    const maxColIndex = Math.max(
      this.startBrushPoint.colIndex,
      this.endBrushPoint.colIndex,
    );
    const startXInView =
      this.startBrushPoint.x + this.startBrushPoint.scrollX - scrollX;
    const startYInView =
      this.startBrushPoint.y + this.startBrushPoint.scrollY - scrollY;
    // startBrushPoint 和 endBrushPoint 加上当前 offset
    const minX = Math.min(startXInView, this.endBrushPoint.x);
    const maxX = Math.max(startXInView, this.endBrushPoint.x);
    const minY = Math.min(startYInView, this.endBrushPoint.y);
    const maxY = Math.max(startYInView, this.endBrushPoint.y);
    return {
      start: {
        rowIndex: minRowIndex,
        colIndex: minColIndex,
        x: minX,
        y: minY,
      },
      end: {
        rowIndex: maxRowIndex,
        colIndex: maxColIndex,
        x: maxX,
        y: maxY,
      },
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  // 获取对角线的两个坐标, 得到对应矩阵并且有数据的单元格
  protected getBrushRangeDataCells(): S2CellType[] {
    return [] as S2CellType[];
  }

  protected isInBrushRange(meta: ViewMeta): boolean {
    return false;
  }

  // 刷选过程中高亮的cell
  protected showPrepareSelectedCells = () => {};

  protected renderPrepareSelected = (point: Point) => {};

  protected bindMouseDown() {}

  protected bindMouseMove() {}

  protected bindMouseUp() {}

  public getSelectedCellMetas = (range: BrushRange) => {};
  public getSelectedCellMetas1 = (range: BrushRange) => {
    const metas = [];
    const colLeafNodes = this.spreadsheet.facet.layoutResult.colLeafNodes;
    const rowLeafNodes = this.spreadsheet.facet.layoutResult.rowLeafNodes ?? [];
    for (
      let rowIndex = range.start.rowIndex;
      rowIndex < range.end.rowIndex + 1;
      rowIndex++
    ) {
      for (
        let colIndex = range.start.colIndex;
        colIndex < range.end.colIndex + 1;
        colIndex++
      ) {
        const colId = String(colLeafNodes[colIndex].id);
        let rowId = String(rowIndex);
        if (rowLeafNodes.length) {
          rowId = String(rowLeafNodes[rowIndex].id);
        }
        metas.push({
          colIndex,
          rowIndex,
          id: `${rowId}-${colId}`,
          type: 'dataCell',
          rowId,
          colId,
          spreadsheet: this.spreadsheet,
        });
      }
    }
    return metas;
  };
  // 最终刷选的cell
  private updateSelectedCells1() {
    const { interaction, options } = this.spreadsheet;

    const range = this.getBrushRange();

    const selectedCellMetas = this.getSelectedCellMetas(range);
    interaction.changeState({
      cells: selectedCellMetas,
      stateName: InteractionStateName.SELECTED,
    });

    if (options.interaction.selectedCellHighlight) {
      selectedCellMetas.forEach((meta) => {
        updateRowColCells(meta);
      });
    }

    this.spreadsheet.emit(
      S2Event.DATA_CELL_BRUSH_SELECTION,
      this.brushRangeDataCells,
    );
    this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, this.brushRangeDataCells);
    // 未刷选到有效格子, 允许 hover
    if (isEmpty(this.brushRangeDataCells)) {
      interaction.removeIntercepts([InterceptType.HOVER]);
    }
  }
}

}
