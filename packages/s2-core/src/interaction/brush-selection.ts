import { Event, Point, Shape } from '@antv/g-canvas';
import * as _ from '@antv/util';
import { DataCell } from '../cell';
import { FRONT_GROUND_GROUP_BRUSH_SELECTION_ZINDEX } from '../common/constant';
import { S2Event, DefaultEventType } from './events/types';
import { BaseInteraction } from './base';
import { DataItem, TooltipOptions } from '..';

function getBrushRegion(p1, p2) {
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
  public regionShape: Shape.Rect;
  private previousPoint: Point;
  private endPoint: Point;
  private endOriginEvent: any;
  /**
   * 0: 初始态
   * 1: 触发mousedown
   * 2: 触发mousedown + 触发mousemove
   * https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents-h3
   * 目前没有太大影响，但实现上做成避免和click的行为定义冲突
   */
  private phase: 0 | 1 | 2;

  private bindMouseDown() {
    this.spreadsheet.on(S2Event.DATACELL_MOUSEDOWN, (ev) => {
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
      // this.hideTooltip();
    });
  }

  private bindMouseMove() {
    this.spreadsheet.on(S2Event.DATACELL_MOUSEMOVE, (ev) => {
      if (this.phase) {
        // 屏蔽hover事件
        this.spreadsheet.eventController.interceptEvent.add(
          DefaultEventType.Hover,
        );
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
        this.getHighlightCells(brushRegion);
        this.draw();
      }
    });
  }

  private bindMouseUp() {
    this.spreadsheet.on(S2Event.DATACELL_MOUSEUP, (ev) => {
      if (this.phase === 2) {
        /**
         * 模拟tableau的交互，原因是如果在mousedown阶段清空选中态，那单选的mouseup后的click无法实现反选
         */
        this.spreadsheet.clearState();
        const oe = ev.originalEvent as any;
        this.endPoint = { x: oe.layerX, y: oe.layerY };
        this.endOriginEvent = ev.event;
        const brushRegion = getBrushRegion(this.previousPoint, this.endPoint);
        this.getSelectedCells(brushRegion);
        // this.showTooltip({
        //   x: this.endOriginEvent.clientX,
        //   y: this.endOriginEvent.clientY,
        // });
        // 透明度为0会导致 hover 无法响应
        this.regionShape.attr({
          opacity: 0,
        });
        this.hideHoverBox();
        this.draw();
      }
      this.phase = 0;
    });
  }

  // protected showTooltip(position: Point, hoverData?: DataItem, options?: TooltipOptions) {
  //   if (!_.get(this, 'spreadsheet.options.hideTooltip')) {
  //     this.spreadsheet.tooltip.show(position, hoverData, options);
  //   }
  // }

  protected hideHoverBox() {
    if (_.get(this.spreadsheet, 'hoverBoxGroup')) {
      this.spreadsheet.hoverBoxGroup.clear();
    }
  }

  protected bindEvents() {
    super.bindEvents();
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
    this.addEventListener(
      this.spreadsheet.container.get('container'),
      'mouseleave',
      this.hide.bind(this),
    );
  }

  private getCellsInRegion(region) {
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

  // 最终刷选的cell
  private getSelectedCells(region) {
    const selectedCells = this.getCellsInRegion(region);
    selectedCells.forEach((cell) => {
      this.spreadsheet.setState(cell, 'selected');
    });
    this.spreadsheet.updateCellStyleByState();
  }

  // 刷选过程中高亮的cell
  private getHighlightCells(region) {
    const selectedCells = this.getCellsInRegion(region);
    this.showPrepareBrushSelectBorder(selectedCells);
  }

  // 刷选过程中的预选择外框
  protected showPrepareBrushSelectBorder(cells: DataCell[]) {
    this.hideHoverBox();
    cells.forEach((cell: DataCell) => {
      const { x, y, width, height } = cell.getInteractiveBgShape().attrs;
      // 往内缩一个像素，避免和外边框重叠
      const margin = 1;
      this.spreadsheet.hoverBoxGroup.addShape('rect', {
        name: 'hoverBox',
        attrs: {
          x: x + margin,
          y: +y + margin,
          width: width - margin * 2,
          height: height - margin * 2,
          stroke: '#000',
          zIndex: 999,
        },
        zIndex: 999,
        capture: false, // 鼠标悬浮到 cell 上时，会添加 hoverBox，但继续 mousemove 会命中 hoverBox，所以去掉事件
      });
    });
    this.spreadsheet.panelGroup.sort();
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

  // protected hideTooltip() {
  //   this.spreadsheet.tooltip.hide();
  // }

  public hide() {
    // this.hideTooltip();
    this.hideHoverBox();
    if (this.cells) {
      this.spreadsheet.clearState();
    }
    if (this.regionShape) {
      this.regionShape.attr({
        opacity: 0,
      });
    }
    // 清空屏蔽的事件
    this.spreadsheet.eventController.interceptEvent.clear();
    this.phase = 0;
    this.draw();
  }
}
