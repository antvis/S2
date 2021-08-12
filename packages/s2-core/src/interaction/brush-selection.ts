import { Event, Point, IShape } from '@antv/g-canvas';
import { each, find, isEqual, isEmpty } from 'lodash';
import { DataCell } from '../cell';
import { FRONT_GROUND_GROUP_BRUSH_SELECTION_ZINDEX } from '../common/constant';
import { S2Event, DefaultInterceptEventType } from '@/common/constant';
import { BaseInteraction } from './base';
import { InteractionStateName } from '@/common/constant/interaction';
import { getTooltipData } from '../utils/tooltip';
import { S2CellBrushRange } from '@/common/interface';

function getBrushRegion(p1, p2): S2CellBrushRange {
  const leftX = Math.min(p1.x, p2.x);
  const rightX = Math.max(p1.x, p2.x);
  const topY = Math.min(p1.y, p2.y);
  const bottomY = Math.max(p1.y, p2.y);
  const width = rightX - leftX;
  const height = bottomY - topY;

  return { leftX, rightX, topY, bottomY, width, height };
}

function isInRegion(cellRegion, brushRegion) {
  const cellCenterX = (cellRegion.leftX + cellRegion.rightX) / 2;
  const cellCenterY = (cellRegion.topY + cellRegion.bottomY) / 2;
  const regionCenterX = (brushRegion.leftX + brushRegion.rightX) / 2;
  const regionCenterY = (brushRegion.topY + brushRegion.bottomY) / 2;
  const lx = Math.abs(cellCenterX - regionCenterX);
  const ly = Math.abs(cellCenterY - regionCenterY);
  const sax = Math.abs(cellRegion.leftX - cellRegion.rightX);
  const sbx = Math.abs(brushRegion.leftX - brushRegion.rightX);
  const say = Math.abs(cellRegion.topY - cellRegion.bottomY);
  const sby = Math.abs(brushRegion.topY - brushRegion.bottomY);
  return lx <= (sax + sbx) / 2 && ly <= (say + sby) / 2;
}

/**
 * Panel area's brush selection interaction
 */
export class BrushSelection extends BaseInteraction {
  public threshold: number;

  public cells: DataCell[];

  // 从mousedown开始到mouseup canvas层面的选择框
  public regionShape: IShape;

  private previousPoint: Point;

  private endPoint: Point;

  /**
   * 0: 初始态
   * 1: 触发mousedown
   * 2: 触发mousedown + 触发mousemove
   * https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents-h3
   * 目前没有太大影响，但实现上做成避免和click的行为定义冲突
   */
  private phase: 0 | 1 | 2;

  protected bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  private bindMouseDown() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_DOWN, (ev: Event) => {
      const oe = ev.originalEvent as any;
      this.previousPoint = { x: oe.layerX, y: oe.layerY };
      this.cells = this.spreadsheet.getPanelAllCells();
      if (!this.regionShape) {
        this.regionShape = this.createRegionShape();
      } else {
        this.regionShape.attr({
          x: this.previousPoint.x,
          y: this.previousPoint.y,
          width: 0,
          height: 0,
          opacity: 0.3,
        });
      }
      this.draw();
      this.phase = 1;
    });
  }

  private bindMouseMove() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_MOVE, (ev) => {
      if (this.phase) {
        // 屏蔽hover事件
        this.spreadsheet.interceptEvent.add(DefaultInterceptEventType.HOVER);
        ev.preventDefault();
        this.phase = 2;
        const oe = ev.originalEvent as any;
        const currentPoint = { x: oe.layerX, y: oe.layerY };
        // 更新brushRegion
        const brushRegion = getBrushRegion(this.previousPoint, currentPoint);
        this.regionShape.attr({
          x: brushRegion.leftX,
          y: brushRegion.topY,
          width: brushRegion.width,
          height: brushRegion.height,
        });

        this.spreadsheet.clearStyleIndependent();
        this.getHighlightCells(brushRegion);
        this.draw();
      }
    });
  }

  // 刷选过程中的预选择外框
  protected showPrepareBrushSelectBorder(cells: DataCell[]) {
    if (cells.length) {
      this.spreadsheet.clearState();
      cells.forEach((cell: DataCell) => {
        this.spreadsheet.setState(cell, InteractionStateName.PREPARE_SELECT);
      });
      this.spreadsheet.updateCellStyleByState();
    }
  }

  private isInCellInfos(cellInfos, info): boolean {
    return !!find(cellInfos, (i) => isEqual(i, info));
  }

  private handleTooltip(ev, cellInfos) {
    const position = {
      x: ev.clientX,
      y: ev.clientY,
    };

    const options = {
      enterable: true,
    };

    const tooltipData = getTooltipData({
      spreadsheet: this.spreadsheet,
      cellInfos,
      options,
    });
    const showOptions = {
      position,
      data: tooltipData,
      options,
    };
    this.spreadsheet.showTooltip(showOptions);
  }

  private getCellsInRegion(region: S2CellBrushRange) {
    const containerMat = this.spreadsheet.panelGroup.attr('matrix');
    const containerX = containerMat[6];
    const containerY = containerMat[7];
    const selectedCells: DataCell[] = [];
    this.cells.forEach((cell) => {
      const bbox = cell.getBBox();
      const leftX = containerX + bbox.minX;
      const rightX = containerX + bbox.maxX;
      const topY = containerY + bbox.minY;
      const bottomY = containerY + bbox.maxY;
      const cellRegion = { leftX, rightX, topY, bottomY };
      const inRegion = isInRegion(cellRegion, region);
      if (inRegion && cell.getMeta().data) {
        selectedCells.push(cell);
      }
    });
    return selectedCells;
  }

  private bindMouseUp() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_UP, (ev) => {
      if (this.phase === 2) {
        const oe = ev.originalEvent as any;
        this.endPoint = { x: oe.layerX, y: oe.layerY };
        const brushRegion = getBrushRegion(this.previousPoint, this.endPoint);
        this.getSelectedCells(brushRegion);
        // 透明度为0会导致 hover 无法响应
        this.regionShape.attr({
          opacity: 0,
        });
        this.draw();
        const currentState = this.spreadsheet.getCurrentState();
        const stateName = currentState?.stateName;
        const cells = currentState?.cells;
        const cellInfos = [];
        if (stateName === InteractionStateName.SELECTED) {
          each(cells, (cell) => {
            const valueInCols = this.spreadsheet.options.valueInCols;
            const meta = cell.getMeta();
            if (!isEmpty(meta)) {
              const query = meta[valueInCols ? 'colQuery' : 'rowQuery'];
              if (query) {
                const cellInfo = {
                  ...query,
                  colIndex: valueInCols ? meta.colIndex : null,
                  rowIndex: !valueInCols ? meta.rowIndex : null,
                };

                if (!this.isInCellInfos(cellInfos, cellInfo)) {
                  cellInfos.push(cellInfo);
                }
              }
            }
          });
        }
        this.handleTooltip(ev, cellInfos);
      }
      this.phase = 0;
    });
  }

  // 刷选过程中高亮的cell
  private getHighlightCells(region: S2CellBrushRange) {
    const selectedCells = this.getCellsInRegion(region);
    this.showPrepareBrushSelectBorder(selectedCells);
  }

  // 最终刷选的cell
  private getSelectedCells(region: S2CellBrushRange) {
    const selectedCells = this.getCellsInRegion(region);
    selectedCells.forEach((cell) => {
      this.spreadsheet.setState(cell, InteractionStateName.SELECTED);
    });
    this.spreadsheet.updateCellStyleByState();
  }

  private createRegionShape() {
    return this.spreadsheet.foregroundGroup.addShape('rect', {
      attrs: {
        width: 0,
        height: 0,
        x: this.previousPoint.x,
        y: this.previousPoint.y,
        fill: '#1890FF',
        opacity: 0.3,
        zIndex: FRONT_GROUND_GROUP_BRUSH_SELECTION_ZINDEX,
      },
      capture: false,
    });
  }
}
