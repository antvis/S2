import { Event, Group, IGroup } from '@antv/g-canvas';
import { throttle, clone, merge, isNil, get } from 'lodash';
import BaseSpreadSheet from '../sheet-type/base-spread-sheet';
import { ResizeInfo } from '../facet/header/interface';
import { BaseInteraction } from './base';
import { S2Event } from './events/types';

const MIN_CELL_WIDTH = 28;
const MIN_CELL_HEIGHT = 16;

export enum EventType {
  ROW_W = 'spreadsheet:change-row-header-width',
  COL_W = 'spreadsheet:change-column-header-width',
  ROW_H = 'spreadsheet:change-row-header-height',
  COL_H = 'spreadsheet:change-column-header-height',
  TREE_W = 'spreadsheet:change-tree-width',
}

/**
 * Resize row&col width/height interaction
 */
export class RowColResize extends BaseInteraction {
  private hotsPot: IGroup;

  private resizeGroup: IGroup;

  private container: IGroup;

  private startPos: { offsetX?: number; offsetY?: number } = {};

  constructor(spreadsheet: BaseSpreadSheet) {
    super(spreadsheet);
    this.container = this.spreadsheet.foregroundGroup;
  }

  protected bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  private bindMouseDown() {
    this.spreadsheet.on(S2Event.GLOBAL_RESIZE_MOUSEDOWN, (ev) => {
      const shape: IGroup = ev.target;
      const info: ResizeInfo = shape.attr('appendInfo');
      if (get(info, 'isResizer')) {
        this.hotsPot = shape;
        // 激活区域
        if (isNil(this.resizeGroup)) {
          this.resizeGroup = this.container.addGroup();
          const attrs = {
            path: '',
            lineDash: [3, 3],
            stroke: 'rgba(0,0,0,.8)',
            strokeWidth: 2,
          };
          this.resizeGroup.addShape('path', { attrs });
          this.resizeGroup.addShape('path', { attrs });
          // 加这个shape是其实是一层透明的mask遮罩
          // 防止resize过程中触发到别的interaction，因此大小为画布到校，move时在遮罩上move，截断了下层
          this.resizeGroup.addShape('rect', {
            attrs: {
              appendInfo: {
                isResizer: true
              },
              x: 0,
              y: 0,
              width: this.spreadsheet.facet.getCanvasHW().width,
              height: this.spreadsheet.facet.getCanvasHW().height,
              fill: 'transparent',
            }
          });
        }
        this.resizeGroup.set('visible', true);
        this.resizeGroup.set('name', 'resize-group');
        const children = this.resizeGroup.get('children');
        if (children) {
          /**
           * cellStartBorder 当前resize的起始边
           * cellEndBorder 当前resize的响应边，也就是点击的边
           */
          const [cellStartBorder, cellEndBorder] = children;
          const { offsetX, offsetY, width, height } = info;
          const canvasWidth = this.spreadsheet.facet.getCanvasHW().width;
          const canvasHeight = this.spreadsheet.facet.getCanvasHW().height;
          if (info.type === 'col') {
            cellStartBorder.attr('path', [
              ['M', offsetX, offsetY],
              ['L', offsetX, canvasHeight],
            ]);
            cellEndBorder.attr('path', [
              ['M', offsetX + width, offsetY],
              ['L', offsetX + width, canvasHeight],
            ]);
            this.startPos.offsetX = ev.originalEvent.offsetX;
          } else {
            cellStartBorder.attr('path', [
              ['M', offsetX, offsetY],
              ['L', canvasWidth, offsetY],
            ]);
            cellEndBorder.attr('path', [
              ['M', offsetX, offsetY + height],
              ['L', canvasWidth, offsetY + height],
            ]);
            this.startPos.offsetY = ev.originalEvent.offsetY;
          }
          cellEndBorder.attr('cursor', `${info.type}-resize`);
          const header = this.getHeaderGroup();
          this.resizeGroup.move(header.get('x'), header.get('y'));
          this.draw();
        }
      }
    })
  }

  private bindMouseMove() {
    this.spreadsheet.on(S2Event.GLOBAL_RESIZE_MOUSEMOVE, (ev) => {
      throttle(
        this.resizeMouseMove,
        33, // 30fps
        {},
      )(ev);
    })
  }

  private bindMouseUp() {
    this.spreadsheet.on(S2Event.GLOBAL_RESIZE_MOUSEUP, (ev) => {
      if (this.resizeGroup) {
        this.resizeGroup.set('visible', false);
        const children = this.resizeGroup.getChildren();
        if (children) {
          const info = this.getResizeInfo();
          const startPoint: ['M', number, number] = children[0]?.attr('path')[0];
          const endPoint: ['M', number, number] = children[1]?.attr('path')[0];
  
          let eventType: EventType;
          let config: any;
          // todo，如何优化这段代码？
          if (info.type === 'col') {
            // eslint-disable-next-line default-case
            switch (info.affect) {
              case 'field':
                eventType = EventType.ROW_W;
                config = {
                  rowCfg: {
                    widthByField: {
                      [info.id]: endPoint[1] - startPoint[1],
                    },
                  },
                };
                break;
              case 'tree':
                eventType = EventType.TREE_W;
                config = {
                  rowCfg: {
                    treeRowsWidth: endPoint[1] - startPoint[1],
                  },
                };
                break;
              case 'cell':
                eventType = EventType.COL_W;
                config = {
                  colCfg: {
                    widthByFieldValue: {
                      [info.caption]: endPoint[1] - startPoint[1],
                    },
                  },
                };
                break;
            }
          } else {
            // eslint-disable-next-line default-case
            switch (info.affect) {
              case 'field':
                eventType = EventType.COL_H;
                config = {
                  colCfg: {
                    heightByField: {
                      [info.id]: endPoint[2] - startPoint[2],
                    },
                  },
                };
                break;
              case 'cell':
              case 'tree':
                eventType = EventType.ROW_H;
                config = {
                  cellCfg: {
                    height: endPoint[2] - startPoint[2],
                  },
                };
                break;
            }
          }
          this.spreadsheet.needUseCacheMeta = true;
          this.spreadsheet.emit(eventType, config);
          this.spreadsheet.setOptions(
            merge({}, this.spreadsheet.options, { style: config }),
          );
          this.renderSS();
        }
      }
    })
  }

  private resizeMouseMove = (ev: any) => {
    // is dragging
    if (this.resizeGroup && this.resizeGroup.get('visible')) {
      ev.preventDefault();
      const info = this.getResizeInfo();
      const children = this.resizeGroup.get('children');
      if (children) {
        const [, cellEndBorder] = this.resizeGroup.get('children');
        const [start, end]: [string, number, number][] = clone(
          cellEndBorder.attr('path'),
        );

        if (info.type === 'col') {
          // 横向移动
          let offset = ev.originalEvent.offsetX - this.startPos.offsetX;
          if (start[1] + offset - info.offsetX < MIN_CELL_WIDTH) {
            // 禁止拖到最小宽度
            this.startPos.offsetX = info.offsetX + MIN_CELL_WIDTH;
            offset = info.offsetX + MIN_CELL_WIDTH - start[1];
          } else {
            this.startPos.offsetX = ev.originalEvent.offsetX;
          }
          start[1] += offset;
          end[1] += offset;
          this.hotsPot.attr({
            x: this.hotsPot.attr('x') + offset,
          });
        } else {
          let offset = ev.originalEvent.offsetY - this.startPos.offsetY;
          if (start[2] + offset - info.offsetY < MIN_CELL_HEIGHT) {
            this.startPos.offsetY = info.offsetY + MIN_CELL_HEIGHT;
            offset = info.offsetY + MIN_CELL_HEIGHT - start[2];
          } else {
            this.startPos.offsetY = ev.originalEvent.offsetY;
          }
          start[2] += offset;
          end[2] += offset;
          this.hotsPot.attr({
            y: this.hotsPot.attr('y') + offset,
          });
        }
        cellEndBorder.attr('path', [start, end]);
        this.draw();
      }
    }
  };

  private getResizeInfo(): ResizeInfo {
    return this.hotsPot && this.hotsPot.attr('appendInfo');
  }

  private getHeaderGroup(): Group {
    return this.hotsPot && this.hotsPot.get('parent').get('parent');
  }

  private renderSS() {
    this.startPos = {};
    this.hotsPot = null;
    this.resizeGroup = null;
    this.spreadsheet.render(false);
  }
}
