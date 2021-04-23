import { Event, Group, IGroup } from '@antv/g-canvas';
import { throttle, clone, merge, isNil, get } from 'lodash';
import BaseSpreadSheet from '../sheet-type/base-spread-sheet';
import { ResizeInfo } from '../facet/header/interface';
import { BaseInteraction } from './base';

const MIN_CELL_WIDTH = 28;
const MIN_CELL_HEIGHT = 16;

/**
 * Emit the event to notify listeners to custom,
 * The whole config info please see {@link #DEFAULT_FACET_CFG}
 * cellCfg: {
 *   width: 96,
 *   height: 32,
 * },
 * colCfg: { --- COL_W, COL_H
 *   height: 32,
 *   widthByFieldValue: {
 *     // [fieldValue]: width,
 *   },
 *   heightByField: {
 *     // [field]: height,
 *   },
 * },
 * rowCfg: { --- ROW_W, ROW_H
 *   width: 96,
 *   widthByField: {
 *     // [field]: width,
 *   },
 *  },
 */
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
    this.addEvent(this.container, 'mousedown', this.onMousedown.bind(this));
    this.addEventListener(document, 'mouseup', this.onDocMouseup.bind(this));
  }

  protected process(ev: Event) {
    throttle(
      this.realProcess,
      33, // 30fps
      {},
    )(ev);
  }

  protected end(ev: Event) {
    console.info(ev);
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
  }

  private realProcess = (ev: any) => {
    // is dragging
    if (this.resizeGroup && this.resizeGroup.get('visible')) {
      ev.preventDefault();

      const info = this.getResizeInfo();
      const children = this.resizeGroup.get('children');
      if (children) {
        const [, target] = this.resizeGroup.get('children');
        const [start, end]: [string, number, number][] = clone(
          target.attr('path'),
        );

        if (info.type === 'col') {
          // 横向移动
          let offset = ev.offsetX - this.startPos.offsetX;
          if (start[1] + offset - info.offsetX < MIN_CELL_WIDTH) {
            // 禁止拖到最小宽度
            this.startPos.offsetX = info.offsetX + MIN_CELL_WIDTH;
            offset = info.offsetX + MIN_CELL_WIDTH - start[1];
          } else {
            this.startPos.offsetX = ev.offsetX;
          }
          start[1] += offset;
          end[1] += offset;
          this.hotsPot.attr({
            x: this.hotsPot.attr('x') + offset,
          });
        } else {
          let offset = ev.offsetY - this.startPos.offsetY;
          if (start[2] + offset - info.offsetY < MIN_CELL_HEIGHT) {
            this.startPos.offsetY = info.offsetY + MIN_CELL_HEIGHT;
            offset = info.offsetY + MIN_CELL_HEIGHT - start[2];
          } else {
            this.startPos.offsetY = ev.offsetY;
          }
          start[2] += offset;
          end[2] += offset;
          this.hotsPot.attr({
            y: this.hotsPot.attr('y') + offset,
          });
        }
        target.attr('path', [start, end]);
        this.draw();
      }
    }
  };

  private onMousedown = (ev: any) => {
    const shape: IGroup = ev.target;
    const info: ResizeInfo = shape.attr('appendInfo');
    if (get(info, 'isTrigger')) {
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
      }
      this.resizeGroup.set('visible', true);
      this.resizeGroup.set('name', 'resize-group');
      const children = this.resizeGroup.get('children');
      if (children) {
        const [ref, target] = children;
        const { offsetX, offsetY, width, height } = info;
        const canvasWidth = this.spreadsheet.facet.getCanvasHW().width;
        const canvasHeight = this.spreadsheet.facet.getCanvasHW().height;
        if (info.type === 'col') {
          const x = offsetX;
          ref.attr('path', [
            ['M', x, offsetY],
            ['L', x, canvasHeight],
          ]);
          target.attr('path', [
            ['M', x + width, offsetY],
            ['L', x + width, canvasHeight],
          ]);
          this.startPos.offsetX = ev.offsetX;
        } else {
          ref.attr('path', [
            ['M', offsetX, offsetY],
            ['L', canvasWidth, offsetY],
          ]);
          target.attr('path', [
            ['M', offsetX, offsetY + height],
            ['L', canvasWidth, offsetY + height],
          ]);
          this.startPos.offsetY = ev.offsetY;
        }
        target.attr('cursor', `${info.type}-resize`);
        const header = this.getHeaderGroup();
        this.resizeGroup.move(header.get('x'), header.get('y'));
        this.draw();
      }
    }
  };

  private onDocMouseup = (ev) => {
    this.end(ev);
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
