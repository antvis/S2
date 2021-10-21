import { Group, Event as CanvasEvent, IGroup } from '@antv/g-canvas';
import { clone, isNil, throttle } from 'lodash';
import { BaseEvent, BaseEventImplement } from './base-interaction';
import { ResizeInfo } from '@/facet/header/interface';
import { SpreadSheet } from '@/sheet-type';
import { ResizeEvent, Style } from '@/common/interface';
import {
  MIN_CELL_HEIGHT,
  MIN_CELL_WIDTH,
  S2Event,
  SHAPE_STYLE_MAP,
} from '@/common/constant';

/**
 * Resize row&col width/height interaction
 */
export class RowColResize extends BaseEvent implements BaseEventImplement {
  private ResizeArea: IGroup;

  private resizeGroup: IGroup;

  private container: IGroup;

  private startPos: { offsetX?: number; offsetY?: number } = {};

  constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
    this.container = this.spreadsheet.foregroundGroup;
  }

  public bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  private bindMouseDown() {
    this.spreadsheet.on(S2Event.LAYOUT_RESIZE_MOUSE_DOWN, (event) => {
      const shape = event.target as IGroup;
      const originalEvent = event.originalEvent as MouseEvent;
      const resizeInfo: ResizeInfo = shape?.attr('appendInfo');

      if (resizeInfo?.isResizeArea) {
        this.ResizeArea = shape;
        // 激活区域
        if (isNil(this.resizeGroup)) {
          this.resizeGroup = this.container.addGroup();
          const attrs = {
            path: '',
            lineDash: [3, 3],
            stroke: this.spreadsheet.theme.resizeArea.guidLineColor,
            strokeWidth: this.spreadsheet.theme.resizeArea.size,
          };

          this.resizeGroup.addShape('path', { attrs });
          this.resizeGroup.addShape('path', { attrs });
          // 加这个shape是其实是一层透明的mask遮罩
          // 防止resize过程中触发到别的interaction，因此加了遮罩，触发resize后在遮罩上滚动
          this.resizeGroup.addShape('rect', {
            attrs: {
              appendInfo: {
                isResizeArea: true,
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
          const { offsetX, offsetY, width, height } = resizeInfo;
          const canvasWidth = this.spreadsheet.facet.getCanvasHW().width;
          const canvasHeight = this.spreadsheet.facet.getCanvasHW().height;
          if (resizeInfo.type === 'col') {
            cellStartBorder.attr('path', [
              ['M', offsetX, offsetY],
              ['L', offsetX, canvasHeight],
            ]);
            cellEndBorder.attr('path', [
              ['M', offsetX + width, offsetY],
              ['L', offsetX + width, canvasHeight],
            ]);
            this.startPos.offsetX = originalEvent.offsetX;
          } else {
            cellStartBorder.attr('path', [
              ['M', offsetX, offsetY],
              ['L', canvasWidth, offsetY],
            ]);
            cellEndBorder.attr('path', [
              ['M', offsetX, offsetY + height],
              ['L', canvasWidth, offsetY + height],
            ]);
            this.startPos.offsetY = originalEvent.offsetY;
          }
          cellEndBorder.attr('cursor', `${resizeInfo.type}-resize`);
          const header = this.getHeaderGroup();
          this.resizeGroup.move(header.get('x'), header.get('y'));
        }
      }
    });
  }

  private bindMouseMove() {
    this.spreadsheet.on(S2Event.LAYOUT_RESIZE_MOUSE_MOVE, (event) => {
      throttle(
        this.resizeMouseMove,
        33, // 30fps
        {},
      )(event);
    });
  }

  private bindMouseUp() {
    this.spreadsheet.on(S2Event.LAYOUT_RESIZE_MOUSE_UP, () => {
      if (this.resizeGroup) {
        this.resizeGroup.set('visible', false);
        const children = this.resizeGroup.getChildren();
        if (children) {
          const info = this.getResizeInfo();
          const startPoint: ['M', number, number] =
            children[0]?.attr('path')[0];
          const endPoint: ['M', number, number] = children[1]?.attr('path')[0];

          let resizeEventType: ResizeEvent;
          let style: Style;
          // todo，如何优化这段代码？
          if (info.type === 'col') {
            // eslint-disable-next-line default-case
            switch (info.affect) {
              case 'field':
                resizeEventType = S2Event.LAYOUT_RESIZE_ROW_WIDTH;
                style = {
                  rowCfg: {
                    widthByField: {
                      [info.id]: endPoint[1] - startPoint[1],
                    },
                  },
                };
                break;
              case 'tree':
                resizeEventType = S2Event.LAYOUT_RESIZE_TREE_WIDTH;
                style = {
                  rowCfg: {
                    treeRowsWidth: endPoint[1] - startPoint[1],
                  },
                };
                break;
              case 'cell':
                resizeEventType = S2Event.LAYOUT_RESIZE_COL_WIDTH;
                style = {
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
                resizeEventType = S2Event.LAYOUT_RESIZE_COL_HEIGHT;
                style = {
                  colCfg: {
                    heightByField: {
                      [info.id]: endPoint[2] - startPoint[2],
                    },
                  },
                };
                break;
              case 'cell':
              case 'tree':
                resizeEventType = S2Event.LAYOUT_RESIZE_ROW_HEIGHT;
                style = {
                  cellCfg: {
                    height: endPoint[2] - startPoint[2],
                  },
                };
                break;
            }
          }
          const resizeDetail = {
            info,
            style,
          };
          this.spreadsheet.emit(S2Event.LAYOUT_RESIZE, resizeDetail);
          this.spreadsheet.emit(resizeEventType, resizeDetail);
          this.spreadsheet.setOptions({ style });
          this.render();
        }
      }
    });
  }

  private resizeMouseMove = (event: CanvasEvent) => {
    // is dragging
    if (this.resizeGroup?.get('visible')) {
      event.preventDefault();
      const originalEvent = event.originalEvent as MouseEvent;
      const info = this.getResizeInfo();
      const children = this.resizeGroup.get('children');
      if (children) {
        const [, cellEndBorder] = this.resizeGroup.get('children');
        const [start, end]: [string, number, number][] = clone(
          cellEndBorder.attr('path'),
        );

        if (info.type === 'col') {
          // 横向移动
          let offset = originalEvent.offsetX - this.startPos.offsetX;
          if (start[1] + offset - info.offsetX < MIN_CELL_WIDTH) {
            // 禁止拖到最小宽度
            this.startPos.offsetX = info.offsetX + MIN_CELL_WIDTH;
            offset = info.offsetX + MIN_CELL_WIDTH - start[1];
          } else {
            this.startPos.offsetX = originalEvent.offsetX;
          }
          start[1] += offset;
          end[1] += offset;
          this.ResizeArea.attr({
            x: this.ResizeArea.attr('x') + offset,
          });
        } else {
          let offset = originalEvent.offsetY - this.startPos.offsetY;
          if (start[2] + offset - info.offsetY < MIN_CELL_HEIGHT) {
            this.startPos.offsetY = info.offsetY + MIN_CELL_HEIGHT;
            offset = info.offsetY + MIN_CELL_HEIGHT - start[2];
          } else {
            this.startPos.offsetY = originalEvent.offsetY;
          }
          start[2] += offset;
          end[2] += offset;
          this.ResizeArea.attr({
            y: this.ResizeArea.attr('y') + offset,
          });
        }
        cellEndBorder.attr('path', [start, end]);
      }
    } else {
      // is hovering
      const resizeArea = event.target;
      resizeArea.attr(
        SHAPE_STYLE_MAP.backgroundOpacity,
        this.spreadsheet.theme.resizeArea.interactionState.hover
          .backgroundOpacity,
      );
    }
  };

  private getResizeInfo(): ResizeInfo {
    return this.ResizeArea?.attr('appendInfo');
  }

  private getHeaderGroup(): Group {
    return this.ResizeArea?.get('parent').get('parent');
  }

  private render() {
    this.startPos = {};
    this.ResizeArea = null;
    this.resizeGroup = null;
    this.spreadsheet.render(false);
  }
}
