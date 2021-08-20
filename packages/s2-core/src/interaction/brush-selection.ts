import { DefaultInterceptEventType, S2Event } from '@/common/constant';
import {
  InteractionBrushStage,
  InteractionStateName,
} from '@/common/constant/interaction';
import {
  BrushPoint,
  BrushRange,
  OriginalEvent,
  ViewMeta,
} from '@/common/interface';
import { Event, IShape, Point } from '@antv/g-canvas';
import { get, isEmpty, isEqual, sample, throttle } from 'lodash';
import { DataCell } from '../cell';
import { FRONT_GROUND_GROUP_BRUSH_SELECTION_Z_INDEX } from '../common/constant';
import { TooltipData } from '../common/interface';
import { BaseInteraction } from './base';

/**
 * Panel area's brush selection interaction
 */
export class BrushSelection extends BaseInteraction {
  public dataCells: DataCell[] = [];

  public prepareSelectMaskShape: IShape;

  private startBrushPoint: BrushPoint;

  private endBrushPoint: BrushPoint;

  private brushRangeDataCells: DataCell[] = [];

  private brushStage: InteractionBrushStage = InteractionBrushStage.UN_DRAGGED;

  protected bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  private getPrepareSelectMaskTheme() {
    return this.spreadsheet.theme.prepareSelectMask;
  }

  private initPrepareSelectMaskShape(point: Point) {
    if (this.prepareSelectMaskShape) {
      return;
    }
    const prepareSelectMaskTheme = this.getPrepareSelectMaskTheme();
    this.prepareSelectMaskShape = this.spreadsheet.foregroundGroup.addShape(
      'rect',
      {
        attrs: {
          width: 0,
          height: 0,
          x: point.x,
          y: point.y,
          fill: prepareSelectMaskTheme?.backgroundColor,
          fillOpacity: prepareSelectMaskTheme?.backgroundOpacity,
          zIndex: FRONT_GROUND_GROUP_BRUSH_SELECTION_Z_INDEX,
        },
        capture: false,
      },
    );
    this.prepareSelectMaskShape.hide();
  }

  private bindMouseDown() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_DOWN, (ev: Event) => {
      this.brushStage = InteractionBrushStage.CLICK;

      const originalEvent = (ev.originalEvent as unknown) as OriginalEvent;
      const point: Point = { x: originalEvent.layerX, y: originalEvent.layerY };

      this.initPrepareSelectMaskShape(point);
      this.dataCells = this.interaction.getPanelGroupAllDataCells();
      this.startBrushPoint = this.getBrushPoint(point);
    });
  }

  private bindMouseMove() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_MOVE, (event: Event) => {
      if (this.brushStage === InteractionBrushStage.UN_DRAGGED) {
        return;
      }

      this.brushStage = InteractionBrushStage.DRAGGED;

      event.preventDefault();
      this.interaction.interceptEvent.add(DefaultInterceptEventType.HOVER);
      const originalEvent = (event.originalEvent as unknown) as OriginalEvent;
      const currentPoint: Point = {
        x: originalEvent.layerX,
        y: originalEvent.layerY,
      };
      this.endBrushPoint = this.getBrushPoint(currentPoint);
      this.interaction.clearStyleIndependent();
      this.updatePrepareSelectMask();
      this.showPrepareSelectedCells();
    });
  }

  private bindMouseUp() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_UP, (event: Event) => {
      if (this.brushStage === InteractionBrushStage.DRAGGED) {
        this.brushStage = InteractionBrushStage.UN_DRAGGED;

        this.hidePrepareSelectMaskShape();
        this.updateSelectedCells();

        this.spreadsheet.showTooltipWithInfo(
          event,
          this.getBrushRangeCellsInfos(),
        );
      }
    });
  }

  private getBrushRangeCellsInfos(): TooltipData[] {
    const cellInfos: TooltipData[] = [];
    if (!this.interaction.isSelectedState()) {
      return [];
    }
    this.interaction.getActiveCells().forEach((cell) => {
      const valueInCols = this.spreadsheet.options.valueInCols;
      const meta = cell.getMeta();
      const query = get(meta, [valueInCols ? 'colQuery' : 'rowQuery']);
      if (isEmpty(meta) || isEmpty(query)) {
        return;
      }
      const currentCellInfo: TooltipData = {
        ...query,
        colIndex: valueInCols ? meta.colIndex : null,
        rowIndex: !valueInCols ? meta.rowIndex : null,
      };

      const isEqualCellInfo = cellInfos.find((cellInfo) =>
        isEqual(currentCellInfo, cellInfo),
      );
      if (!isEqualCellInfo) {
        cellInfos.push(currentCellInfo);
      }
    });
    return cellInfos;
  }

  private updatePrepareSelectMask() {
    const brushRange = this.getBrushRange();
    this.prepareSelectMaskShape.show();
    this.prepareSelectMaskShape.attr({
      x: brushRange.start.x,
      y: brushRange.start.y,
      width: brushRange.width,
      height: brushRange.height,
    });
  }

  private hidePrepareSelectMaskShape() {
    this.prepareSelectMaskShape.hide();
  }

  private getBrushPoint(point: Point): BrushPoint {
    const containerMat = this.spreadsheet.panelGroup.getMatrix();
    const containerX = containerMat[6];
    const containerY = containerMat[7];
    const sampleDataCellBBox = sample(this.dataCells)?.getBBox();

    const colIndex = Math.floor(
      Math.abs(point.x - containerX) / sampleDataCellBBox?.width,
    );
    const rowIndex = Math.floor(
      Math.abs(point.y - containerY) / sampleDataCellBBox?.height,
    );

    return {
      ...point,
      rowIndex,
      colIndex,
    };
  }

  // 四个刷选方向: 左 => 右, 右 => 左, 上 => 下, 下 => 上, 将最终结果进行重新排序, 获取真实的 row, col index
  private getBrushRange(): BrushRange {
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
    const minX = Math.min(this.startBrushPoint.x, this.endBrushPoint.x);
    const maxX = Math.max(this.startBrushPoint.x, this.endBrushPoint.x);
    const minY = Math.min(this.startBrushPoint.y, this.endBrushPoint.y);
    const maxY = Math.max(this.startBrushPoint.y, this.endBrushPoint.y);

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
    return this.dataCells.filter((cell) => {
      const meta = cell.getMeta();
      return meta?.data && this.isInBrushRange(meta);
    });
  }

  // 刷选过程中高亮的cell
  private showPrepareSelectedCells = throttle(() => {
    const brushRangeDataCells = this.getBrushRangeDataCells();
    this.interaction.changeState({
      cells: brushRangeDataCells,
      stateName: InteractionStateName.PREPARE_SELECT,
    });
    this.brushRangeDataCells = brushRangeDataCells;
  }, 100);

  // 最终刷选的cell
  private updateSelectedCells() {
    this.interaction.changeState({
      cells: this.brushRangeDataCells,
      stateName: InteractionStateName.SELECTED,
    });
  }
}
