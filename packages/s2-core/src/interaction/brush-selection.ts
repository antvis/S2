import { Event as CanvasEvent, IShape, Point } from '@antv/g-canvas';
import { getCellMeta } from 'src/utils/interaction/select-event';
import {
  getScrollOffsetForCol,
  getScrollOffsetForRow,
} from 'src/utils/interaction/';
import { cloneDeep, isEmpty, isNil, throttle } from 'lodash';
import { BaseEventImplement } from './base-event';
import { BaseEvent } from './base-interaction';
import { InterceptType, S2Event, ScrollDirection } from '@/common/constant';
import {
  InteractionBrushSelectionStage,
  InteractionStateName,
  BRUSH_AUTO_SCROLL_INITIAL_CONFIG,
} from '@/common/constant/interaction';
import {
  BrushPoint,
  BrushRange,
  OriginalEvent,
  ViewMeta,
  BrushAutoScrollConfig,
} from '@/common/interface';
import { DataCell } from '@/cell';
import { FRONT_GROUND_GROUP_BRUSH_SELECTION_Z_INDEX } from '@/common/constant';
import { getActiveCellsTooltipData } from '@/utils/tooltip';
import {
  isFrozenCol,
  isFrozenRow,
  isFrozenTrailingCol,
  isFrozenTrailingRow,
} from '@/facet/utils';
import { getValidFrozenOptions } from '@/utils/layout/frozen';
import { TableFacet } from '@/facet';

/**
 * Panel area's brush selection interaction
 */
export class BrushSelection extends BaseEvent implements BaseEventImplement {
  public displayedDataCells: DataCell[] = [];

  public prepareSelectMaskShape: IShape;

  public startBrushPoint: BrushPoint;

  public endBrushPoint: BrushPoint;

  public brushRangeDataCells: DataCell[] = [];

  public brushSelectionStage = InteractionBrushSelectionStage.UN_DRAGGED;

  public brushSelectionMinimumMoveDistance = 5;

  public scrollAnimationComplete = true;

  public mouseMoveDistanceFromCanvas = 0;

  public bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  private getPrepareSelectMaskTheme() {
    return this.spreadsheet.theme?.prepareSelectMask;
  }

  private initPrepareSelectMaskShape() {
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

  private setBrushSelectionStage(stage: InteractionBrushSelectionStage) {
    this.brushSelectionStage = stage;
  }

  private bindMouseDown() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_DOWN, (event: CanvasEvent) => {
      event?.preventDefault?.();
      if (this.spreadsheet.interaction.hasIntercepts([InterceptType.CLICK])) {
        return;
      }
      this.setBrushSelectionStage(InteractionBrushSelectionStage.CLICK);
      this.initPrepareSelectMaskShape();
      this.setDisplayedDataCells();
      this.startBrushPoint = this.getBrushPoint(event);
      this.resetScrollDelta();
    });
  }

  private isPointInCanvas(point: { x: number; y: number }) {
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

  private autoScrollConfig: BrushAutoScrollConfig = cloneDeep(
    BRUSH_AUTO_SCROLL_INITIAL_CONFIG,
  );

  public validateYIndex = (yIndex: number) => {
    const { facet } = this.spreadsheet;
    const frozenInfo = (facet as TableFacet).frozenGroupInfo;
    let min = 0;
    if (frozenInfo && frozenInfo.row.range) {
      min = frozenInfo.row.range[1] + 1;
    }
    if (yIndex < min) return null;

    let max = facet.getCellRange().end;
    if (frozenInfo && frozenInfo.trailingRow.range) {
      max = frozenInfo.trailingRow.range[0] - 1;
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
    if (frozenInfo && frozenInfo.col.range) {
      min = frozenInfo.col.range[1] + 1;
    }
    if (xIndex < min) return null;

    let max = facet.layoutResult.colLeafNodes.length - 1;
    if (frozenInfo && frozenInfo.trailingCol.range) {
      max = frozenInfo.trailingCol.range[0] - 1;
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

  private handleScroll = throttle((x, y) => {
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

  private clearAutoScroll = () => {
    if (this.autoScrollIntervalId) {
      clearInterval(this.autoScrollIntervalId);
      this.autoScrollIntervalId = null;
      this.resetScrollDelta();
    }
  };

  private renderPrepareSelected = (point: Point) => {
    const { x, y } = point;
    const target = this.spreadsheet.container.getShape(x, y);

    const cell = this.spreadsheet.getCell(target);

    if (!cell || !(cell instanceof DataCell)) {
      return;
    }
    const { rowIndex, colIndex } = cell.getMeta();

    this.endBrushPoint = {
      x,
      y,
      rowIndex,
      colIndex,
    };

    const { interaction } = this.spreadsheet;
    interaction.addIntercepts([InterceptType.HOVER]);
    interaction.clearStyleIndependent();
    this.updatePrepareSelectMask();
    this.showPrepareSelectedCells();
  };

  private bindMouseMove() {
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_MOVE, (event) => {
      if (
        this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
      ) {
        return;
      }

      this.setBrushSelectionStage(InteractionBrushSelectionStage.DRAGGED);
      const pointInCanvas = this.spreadsheet.container.getPointByEvent(event);

      this.clearAutoScroll();
      if (!this.isPointInCanvas(pointInCanvas)) {
        const deltaX = pointInCanvas.x - this.endBrushPoint.x;
        const deltaY = pointInCanvas.y - this.endBrushPoint.y;
        this.handleScroll(deltaX, deltaY);
        return;
      }

      this.renderPrepareSelected(pointInCanvas);
    });
  }

  private bindMouseUp() {
    // 使用全局的 mouseup, 而不是 canvas 的 mouse up 防止刷选过程中移出表格区域时无法响应事件
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_UP, (event) => {
      this.clearAutoScroll();
      if (this.isValidBrushSelection()) {
        this.spreadsheet.interaction.addIntercepts([
          InterceptType.BRUSH_SELECTION,
        ]);
        this.updateSelectedCells();
        this.spreadsheet.showTooltipWithInfo(
          event,
          getActiveCellsTooltipData(this.spreadsheet),
        );
      }
      this.resetDrag();
    });

    // 刷选过程中右键弹出系统菜单时, 应该重置刷选, 防止系统菜单关闭后 mouse up 未相应依然是刷选状态
    this.spreadsheet.on(S2Event.GLOBAL_CONTEXT_MENU, () => {
      if (
        this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
      ) {
        return;
      }
      this.spreadsheet.interaction.removeIntercepts([InterceptType.HOVER]);
      this.resetDrag();
    });
  }

  private resetDrag() {
    this.hidePrepareSelectMaskShape();
    this.setBrushSelectionStage(InteractionBrushSelectionStage.UN_DRAGGED);
  }

  private isValidBrushSelection() {
    if (this.brushSelectionStage !== InteractionBrushSelectionStage.DRAGGED) {
      return false;
    }
    const { start, end } = this.getBrushRange();
    const isMovedEnoughDistance =
      end.x - start.x > this.brushSelectionMinimumMoveDistance ||
      end.y - start.y > this.brushSelectionMinimumMoveDistance;

    return isMovedEnoughDistance;
  }

  private setDisplayedDataCells() {
    this.displayedDataCells =
      this.spreadsheet.interaction.getPanelGroupAllDataCells();
  }

  private updatePrepareSelectMask() {
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

  private resetScrollDelta() {
    this.autoScrollConfig = cloneDeep(BRUSH_AUTO_SCROLL_INITIAL_CONFIG);
  }

  private getBrushPoint(event: CanvasEvent): BrushPoint {
    const { scrollY, scrollX } = this.spreadsheet.facet.getScrollOffset();
    const originalEvent = event.originalEvent as unknown as OriginalEvent;
    const point: Point = {
      x: originalEvent?.layerX,
      y: originalEvent?.layerY,
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

  private isInBrushRange(meta: ViewMeta) {
    const { start, end } = this.getBrushRange();
    const { rowIndex, colIndex } = meta;
    return (
      rowIndex >= start.rowIndex &&
      rowIndex <= end.rowIndex &&
      colIndex >= start.colIndex &&
      colIndex <= end.colIndex
    );
  }

  // 获取对角线的两个坐标, 得到对应矩阵并且有数据的单元格
  private getBrushRangeDataCells(): DataCell[] {
    this.setDisplayedDataCells();
    return this.displayedDataCells.filter((cell) => {
      const meta = cell.getMeta();
      return this.isInBrushRange(meta);
    });
  }

  // 刷选过程中高亮的cell
  private showPrepareSelectedCells = () => {
    const brushRangeDataCells = this.getBrushRangeDataCells();
    this.spreadsheet.interaction.changeState({
      cells: brushRangeDataCells.map((item) => getCellMeta(item)),
      stateName: InteractionStateName.PREPARE_SELECT,
      // 刷选首先会经过 hover => mousedown => mousemove, hover时会将当前行全部高亮 (row cell + data cell)
      // 如果是有效刷选, 更新时会重新渲染, hover 高亮的格子 会正常重置
      // 如果是无效刷选(全部都是没数据的格子), brushRangeDataCells = [], 更新时会跳过, 需要强制重置 hover 高亮
      force: true,
    });
    this.brushRangeDataCells = brushRangeDataCells;
  };

  public getSelectedCellMetas = (range: BrushRange) => {
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
        const colId = colLeafNodes[colIndex].id;
        let rowId = String(rowIndex);
        if (rowLeafNodes.length) {
          rowId = rowLeafNodes[rowIndex].id;
        }
        metas.push({
          colIndex,
          rowIndex,
          id: `${rowId}-${colId}`,
          type: 'dataCell',
        });
      }
    }
    return metas;
  };

  // 最终刷选的cell
  private updateSelectedCells() {
    const { interaction } = this.spreadsheet;

    const range = this.getBrushRange();

    interaction.changeState({
      cells: this.getSelectedCellMetas(range),
      stateName: InteractionStateName.SELECTED,
    });
    this.spreadsheet.emit(
      S2Event.DATE_CELL_BRUSH_SELECTION,
      this.brushRangeDataCells,
    );
    this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, this.brushRangeDataCells);
    // 未刷选到有效格子, 允许 hover
    if (isEmpty(this.brushRangeDataCells)) {
      interaction.removeIntercepts([InterceptType.HOVER]);
    }
  }
}
