import { Event, Point, Shape } from '@antv/g-canvas';
import * as _ from '@antv/util';
import { Cell } from '../cell';
import { FRONT_GROUND_GROUP_BRUSH_SELECTION_ZINDEX } from '../common/constant';
import { HoverInteraction } from './hover-interaction';

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
export class BrushSelection extends HoverInteraction {
  public threshold: number;

  public cells: Cell[];

  public sum: number;

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

  protected start(ev: Event) {
    const cell = ev.target.get('parent');
    if (cell instanceof Cell) {
      const oe = ev.originalEvent as any;
      this.previousPoint = { x: oe.layerX, y: oe.layerY };
      this.cells = this.spreadsheet.getPanelAllCells();
      this.sum = 0;
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
      this.hideTooltip();
    }
  }

  protected process(ev: Event) {
    // 暂时只有交叉表才多选！
    if (
      this.phase &&
      this.spreadsheet.isSpreadsheetType() &&
      !this.spreadsheet.isStrategyMode()
    ) {
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
  }

  protected end(ev: Event) {
    if (this.phase === 2) {
      /**
       * 模拟tableau的交互，原因是如果在mousedown阶段清空选中态，那单选的mouseup后的click无法实现反选
       */
      this.spreadsheet.store.set('selected', null);
      this.resetCell();
      const oe = ev.originalEvent as any;
      this.endPoint = { x: oe.layerX, y: oe.layerY };
      this.endOriginEvent = ev.originalEvent;
      const brushRegion = getBrushRegion(this.previousPoint, this.endPoint);
      this.getSelectedCells(brushRegion);
      this.showTooltip({
        x: this.endOriginEvent.clientX,
        y: this.endOriginEvent.clientY,
      });
      // 透明度为0会导致 hover 无法响应
      this.regionShape.attr({
        opacity: 0,
      });
      this.hideHoverBox();
      this.draw();
    }
    this.phase = 0;
  }

  protected bindEvents() {
    super.bindEvents();
    this.addEventListener(
      this.spreadsheet.container.get('container'),
      'mouseleave',
      _.wrapBehavior(this, '_hide'),
    );
  }

  private getSelectedCells(region) {
    const containerMat = this.spreadsheet.panelGroup.attr('matrix');
    const containerX = containerMat[6];
    const containerY = containerMat[7];
    const selectedCells: Cell[] = [];
    this.cells.forEach((cell) => {
      const bbox = cell.getBBox();
      const leftX = containerX + bbox.minX;
      const rightX = containerX + bbox.maxX;
      const topY = containerY + bbox.minY;
      const bottomY = containerY + bbox.maxY;
      const cellRegion = { leftX, rightX, topY, bottomY };
      const inRegion = isInRegion(cellRegion, region);
      if (inRegion) {
        selectedCells.push(cell);
        this.sum++;
      }
    });

    const rowIndex: number[] = selectedCells.map(
      (cell) => cell.getMeta().rowIndex,
    );
    const colIndex: number[] = selectedCells.map(
      (cell) => cell.getMeta().colIndex,
    );

    this.spreadsheet.store.set('selected', {
      type: 'brush',
      indexes: [
        [Math.min(...rowIndex), Math.max(...rowIndex)],
        [Math.min(...colIndex), Math.max(...colIndex)],
      ],
    });

    selectedCells.forEach((cell: Cell) => cell.update());
  }

  private getHighlightCells(region) {
    const containerMat = this.spreadsheet.panelGroup.attr('matrix');
    const containerX = containerMat[6];
    const containerY = containerMat[7];
    const selectedCells = [];
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
    this.showHoverBox(selectedCells);
  }

  private resetCell() {
    this.cells.forEach((cell) => {
      cell.update();
    });
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
    }) as Shape.Rect;
  }

  private _hide = () => {
    if (this.phase === 1) {
      this.hide();
      if (this.cells) {
        this.resetCell();
      }
      if (this.regionShape) {
        this.regionShape.attr({
          opacity: 0,
        });
      }
      this.phase = 0;
      this.draw();
    }
  };
}
