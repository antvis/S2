import { Event as CanvasEvent, IShape, Point } from '@antv/g-canvas';
import { getCellMeta } from 'src/utils/interaction/select-event';
import _, { isEmpty } from 'lodash';
import { BaseEventImplement } from './base-event';
import { BaseEvent } from './base-interaction';
import { InterceptType, S2Event } from '@/common/constant';
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

  private brushSelectionMinimumMoveDistance = 5;

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
      event.preventDefault();
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

    return point.x > 0 && point.x < width && point.y > 0 && point.y < height;
  }

  private formatBrushPointForScroll = (delta: { x: number; y: number }) => {
    const { x, y } = delta;
    const { facet } = this.spreadsheet;
    const { width, height } = facet.getCanvasHW();
    const { minX, minY, maxX, maxY } = facet.panelBBox;
    let newX = this.endBrushPoint.x + x;
    let newY = this.endBrushPoint.y + y;
    let needScrollForX = true;
    let needScrollForY = true;
    const vScrollBarWidth = facet.vScrollBar.getBBox().width;
    const extraPixel = 2; // 额外加 1px 缩进，保证 getShape 在 panelBox 内

    if (newX > width) {
      newX = maxX - vScrollBarWidth - extraPixel;
    } else if (newX < 0) {
      newX = minX + extraPixel;
    } else {
      needScrollForX = false;
    }

    if (newY > height) {
      newY = maxY - extraPixel;
    } else if (newY < 0) {
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

  private autoScrollConfig: BrushAutoScrollConfig = {
    ...BRUSH_AUTO_SCROLL_INITIAL_CONFIG,
  };

  private getNextScrollDelta = (config: BrushAutoScrollConfig) => {
    let x = 0;
    let y = 0;

    if (config.y.scroll) {
      const lastIndex = this.endBrushPoint.rowIndex;
      const nextIndex =
        this.endBrushPoint.rowIndex + (config.y.value > 0 ? 1 : -1);
      y =
        this.spreadsheet.facet.viewCellHeights.getCellOffsetY(nextIndex) -
        this.spreadsheet.facet.viewCellHeights.getCellOffsetY(lastIndex);
    }

    if (config.x.scroll) {
      const nextIndex =
        this.endBrushPoint.colIndex + (config.x.value > 0 ? 1 : -1);
      x = this.spreadsheet.facet.layoutResult.colLeafNodes[nextIndex].width;
    }

    return {
      x,
      y,
    };
  };

  private autoScroll = () => {
    if (
      this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
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

    if (config.y.scroll) {
      offsetCfg.offsetY.value += config.y.value > 0 ? 30 : -30;
    }
    if (config.x.scroll) {
      offsetCfg.offsetX.value += config.x.value > 0 ? 100 : -100; // todo
      if (offsetCfg.offsetX.value < 0) {
        offsetCfg.offsetX.value = 0;
      }
    }

    this.spreadsheet.facet.updateScrollOffset(offsetCfg);
    this.renderPrepareSelected(this.endBrushPoint);
  };

  private handleScroll = _.throttle((x, y) => {
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

    this.renderPrepareSelected({
      x: newX,
      y: newY,
    });

    if (needScrollForY || needScrollForX) {
      this.clearAutoScroll();
      this.autoScroll();
      this.autoScrollIntervalId = setInterval(this.autoScroll, 300);
    }
  }, 30);

  private clearAutoScroll = () => {
    if (this.autoScrollIntervalId) {
      clearInterval(this.autoScrollIntervalId);
      this.autoScrollIntervalId = null;
    }
  };

  private renderPrepareSelected = (point: Point) => {
    const { x, y } = point;
    const target = this.spreadsheet.container.getShape(x, y);

    const cell = this.spreadsheet.getCell(target);
    if (!cell) {
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
      event.preventDefault();
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
      event.preventDefault();
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
    this.autoScrollConfig = { ...BRUSH_AUTO_SCROLL_INITIAL_CONFIG };
  }

  private getBrushPoint(event: CanvasEvent): BrushPoint {
    const { scrollY } = this.spreadsheet.facet.getScrollOffset();
    const originalEvent = event.originalEvent as unknown as OriginalEvent;
    const point: Point = {
      x: originalEvent.layerX,
      y: originalEvent.layerY,
    };
    const cell = this.spreadsheet.getCell(event.target);
    const { colIndex, rowIndex } = cell.getMeta();

    return {
      ...point,
      rowIndex,
      colIndex,
      scrollY,
    };
  }

  // 四个刷选方向: 左 => 右, 右 => 左, 上 => 下, 下 => 上, 将最终结果进行重新排序, 获取真实的 row, col index
  private getBrushRange(): BrushRange {
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

  private getSelectedCellMetas = (range: BrushRange) => {
    const metas = [];
    const colLeafNodes = this.spreadsheet.facet.layoutResult.colLeafNodes;
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
        metas.push({
          colIndex,
          rowIndex,
          id: `${rowIndex}-${colId}`,
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
