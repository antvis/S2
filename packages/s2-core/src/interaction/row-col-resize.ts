import {
  MIN_CELL_HEIGHT,
  MIN_CELL_WIDTH,
  ResizeEventType,
  S2Event,
} from '@/common/constant';
import { Group, IGroup } from '@antv/g-canvas';
import { clone, get, isNil, merge, throttle } from 'lodash';
import { SpreadSheet } from 'src/sheet-type';
import { ResizeInfo } from '../facet/header/interface';
import { BaseInteraction } from './base';
import { RootInteraction } from './root';

/**
 * Resize row&col width/height interaction
 */
export class RowColResize extends BaseInteraction {
  private hotsPot: IGroup;

  private resizeGroup: IGroup;

  private container: IGroup;

  private startPos: { offsetX?: number; offsetY?: number } = {};

  constructor(spreadsheet: SpreadSheet, interaction: RootInteraction) {
    super(spreadsheet, interaction);
    this.container = this.spreadsheet.foregroundGroup;
  }

  protected bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  private bindMouseDown() {
    this.spreadsheet.on(S2Event.GLOBAL_RESIZE_MOUSE_DOWN, (ev) => {
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
          // 防止resize过程中触发到别的interaction，因此加了遮罩，触发resize后在遮罩上滚动
          this.resizeGroup.addShape('rect', {
            attrs: {
              appendInfo: {
                isResizer: true,
              },
              x: 0,
              y: 0,
              width: this.spreadsheet.facet.getCanvasHW().width,
              height: this.spreadsheet.facet.getCanvasHW().height,
              fill: 'transparent',
            },
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
        }
      }
    });
  }

  private bindMouseMove() {
    this.spreadsheet.on(S2Event.GLOBAL_RESIZE_MOUSE_MOVE, (ev) => {
      throttle(
        this.resizeMouseMove,
        33, // 30fps
        {},
      )(ev);
    });
  }

  private bindMouseUp() {
    this.spreadsheet.on(S2Event.GLOBAL_RESIZE_MOUSE_UP, () => {
      if (this.resizeGroup) {
        this.resizeGroup.set('visible', false);
        const children = this.resizeGroup.getChildren();
        if (children) {
          const info = this.getResizeInfo();
          const startPoint: ['M', number, number] =
            children[0]?.attr('path')[0];
          const endPoint: ['M', number, number] = children[1]?.attr('path')[0];

          let resizeEventType: ResizeEventType;
          let config: any;
          // todo，如何优化这段代码？
          if (info.type === 'col') {
            // eslint-disable-next-line default-case
            switch (info.affect) {
              case 'field':
                resizeEventType = ResizeEventType.ROW_W;
                config = {
                  rowCfg: {
                    widthByField: {
                      [info.id]: endPoint[1] - startPoint[1],
                    },
                  },
                };
                break;
              case 'tree':
                resizeEventType = ResizeEventType.TREE_W;
                config = {
                  rowCfg: {
                    treeRowsWidth: endPoint[1] - startPoint[1],
                  },
                };
                break;
              case 'cell':
                resizeEventType = ResizeEventType.COL_W;
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
                resizeEventType = ResizeEventType.COL_H;
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
                resizeEventType = ResizeEventType.ROW_H;
                config = {
                  cellCfg: {
                    height: endPoint[2] - startPoint[2],
                  },
                };
                break;
            }
          }
          this.spreadsheet.emit(resizeEventType, config);
          this.spreadsheet.setOptions(
            merge({}, this.spreadsheet.options, { style: config }),
          );
          this.renderSS();
        }
      }
    });
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
