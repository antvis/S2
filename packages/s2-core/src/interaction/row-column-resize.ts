import {
  Event as CanvasEvent,
  IGroup,
  ShapeAttrs,
  IShape,
} from '@antv/g-canvas';
import { clone, isEmpty, throttle, get } from 'lodash';
import { BaseEvent, BaseEventImplement } from './base-interaction';
import {
  ResizeDetail,
  ResizeGuideLinePath,
  ResizeGuideLinePosition,
  ResizeInfo,
  ResizePosition,
} from '@/common/interface/resize';
import {
  InterceptType,
  MIN_CELL_HEIGHT,
  MIN_CELL_WIDTH,
  RESIZE_MASK_ID,
  RESIZE_START_GUIDE_LINE_ID,
  RESIZE_END_GUIDE_LINE_ID,
  S2Event,
  ResizeDirectionType,
  ResizeAreaEffect,
  ResizeType,
} from '@/common/constant';

export class RowColumnResize extends BaseEvent implements BaseEventImplement {
  private resizeTarget: IGroup;

  public resizeReferenceGroup: IGroup;

  public resizeStartPosition: ResizePosition = {};

  public bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  private initResizeGroup() {
    if (this.resizeReferenceGroup) {
      return;
    }
    this.resizeReferenceGroup = this.spreadsheet.foregroundGroup.addGroup();

    const { width, height } = this.spreadsheet.options;
    const { guideLineColor, guideLineDash, size } = this.getResizeAreaTheme();
    const attrs: ShapeAttrs = {
      path: '',
      lineDash: guideLineDash,
      stroke: guideLineColor,
      strokeWidth: size,
    };
    // 起始参考线
    this.resizeReferenceGroup.addShape('path', {
      id: RESIZE_START_GUIDE_LINE_ID,
      attrs,
    });
    // 结束参考线
    this.resizeReferenceGroup.addShape('path', {
      id: RESIZE_END_GUIDE_LINE_ID,
      attrs,
    });
    // Resize 蒙层
    this.resizeReferenceGroup.addShape('rect', {
      id: RESIZE_MASK_ID,
      attrs: {
        appendInfo: {
          isResizeArea: true,
        },
        x: 0,
        y: 0,
        width,
        height,
        fill: 'transparent',
      },
    });
  }

  private getResizeAreaTheme() {
    return this.spreadsheet.theme.resizeArea;
  }

  private setResizeTarget(target: IGroup) {
    this.resizeTarget = target;
  }

  private getGuideLineWidthAndHeight() {
    const { width: canvasWidth, height: canvasHeight } =
      this.spreadsheet.options;
    const { maxY, maxX } = this.spreadsheet.facet.panelBBox;
    const width = Math.min(maxX, canvasWidth);
    const height = Math.min(maxY, canvasHeight);

    return {
      width,
      height,
    };
  }

  private updateResizeGuideLinePosition(
    event: MouseEvent,
    resizeInfo: ResizeInfo,
  ) {
    const resizeShapes: IShape[] = this.resizeReferenceGroup.get('children');
    if (isEmpty(resizeShapes)) {
      return;
    }
    const [startResizeGuideLineShape, endResizeGuideLineShape, resizeMask] =
      resizeShapes;
    const { type, offsetX, offsetY, width, height } = resizeInfo;
    const { width: guideLineMaxWidth, height: guideLineMaxHeight } =
      this.getGuideLineWidthAndHeight();

    resizeMask.attr('cursor', `${type}-resize`);

    if (type === ResizeDirectionType.Horizontal) {
      startResizeGuideLineShape.attr('path', [
        ['M', offsetX, offsetY],
        ['L', offsetX, guideLineMaxHeight],
      ]);
      endResizeGuideLineShape.attr('path', [
        ['M', offsetX + width, offsetY],
        ['L', offsetX + width, guideLineMaxHeight],
      ]);
      this.resizeStartPosition.offsetX = event.offsetX;
      return;
    }

    startResizeGuideLineShape.attr('path', [
      ['M', offsetX, offsetY],
      ['L', guideLineMaxWidth, offsetY],
    ]);
    endResizeGuideLineShape.attr('path', [
      ['M', offsetX, offsetY + height],
      ['L', guideLineMaxWidth, offsetY + height],
    ]);
    this.resizeStartPosition.offsetY = event.offsetY;
  }

  private bindMouseDown() {
    this.spreadsheet.on(S2Event.LAYOUT_RESIZE_MOUSE_DOWN, (event) => {
      const shape = event.target as IGroup;
      const resizeInfo: ResizeInfo = shape?.attr('appendInfo');
      const originalEvent = event.originalEvent as MouseEvent;
      this.spreadsheet.store.set('resized', false);

      if (!resizeInfo?.isResizeArea) {
        return;
      }

      // 鼠标在 resize 热区 按下时, 将 tooltip 关闭, 避免造成干扰
      this.spreadsheet.hideTooltip();
      this.spreadsheet.interaction.addIntercepts([InterceptType.RESIZE]);
      this.setResizeTarget(shape);
      this.showResizeGroup();
      this.updateResizeGuideLinePosition(originalEvent, resizeInfo);
    });
  }

  private bindMouseMove() {
    this.spreadsheet.on(S2Event.LAYOUT_RESIZE_MOUSE_MOVE, (event) => {
      throttle(this.resizeMouseMove, 33)(event);
    });
  }

  // 将 SVG 的 path 转成更可读的坐标对象
  private getResizeGuideLinePosition(): ResizeGuideLinePosition {
    const [startGuideLineShape, endGuideLineShape] =
      this.resizeReferenceGroup.getChildren() || [];
    const startGuideLinePath: ResizeGuideLinePath[] =
      startGuideLineShape?.attr('path') || [];
    const endGuideLinePath: ResizeGuideLinePath[] =
      endGuideLineShape?.attr('path') || [];

    const [, startX = 0, startY = 0] = startGuideLinePath[0] || [];
    const [, endX = 0, endY = 0] = endGuideLinePath[0] || [];

    return {
      start: {
        x: startX,
        y: startY,
      },
      end: {
        x: endX,
        y: endY,
      },
    };
  }

  private getResizeWidthDetail(): ResizeDetail {
    const { start, end } = this.getResizeGuideLinePosition();
    const width = Math.floor(end.x - start.x);
    const resizeInfo = this.getResizeInfo();

    switch (resizeInfo.effect) {
      case ResizeAreaEffect.Field:
        return {
          eventType: S2Event.LAYOUT_RESIZE_ROW_WIDTH,
          style: {
            rowCfg: {
              widthByField: {
                [resizeInfo.id]: width,
              },
            },
          },
        };
      case ResizeAreaEffect.Tree:
        return {
          eventType: S2Event.LAYOUT_RESIZE_TREE_WIDTH,
          style: {
            rowCfg: {
              treeRowsWidth: width,
            },
          },
        };
      case ResizeAreaEffect.Cell:
        return {
          eventType: S2Event.LAYOUT_RESIZE_COL_WIDTH,
          style: {
            colCfg: {
              widthByFieldValue: {
                [resizeInfo.id]: width,
              },
            },
          },
        };

      case ResizeAreaEffect.Series:
        return {
          eventType: S2Event.LAYOUT_RESIZE_SERIES_WIDTH,
          seriesNumberWidth: width,
        };
      default:
        return null;
    }
  }

  private getResizeHeightDetail(): ResizeDetail {
    const {
      options: {
        interaction: { resize },
        style: {
          rowCfg: { heightByField },
        },
      },
    } = this.spreadsheet;
    const { padding: rowCellPadding } = this.spreadsheet.theme.rowCell.cell;
    const { start, end } = this.getResizeGuideLinePosition();
    const baseHeight = Math.floor(end.y - start.y);
    const height = baseHeight - rowCellPadding.top - rowCellPadding.bottom;
    const resizeInfo = this.getResizeInfo();

    let rowCellStyle;
    switch (resizeInfo.effect) {
      case ResizeAreaEffect.Field:
        return {
          eventType: S2Event.LAYOUT_RESIZE_COL_HEIGHT,
          style: {
            colCfg: {
              heightByField: {
                [resizeInfo.id]: baseHeight,
              },
            },
          },
        };
      case ResizeAreaEffect.Cell:
        if (
          heightByField[String(resizeInfo.id)] ||
          get(resize, 'rowResizeType') === ResizeType.CURRENT
        ) {
          rowCellStyle = {
            rowCfg: {
              heightByField: {
                [resizeInfo.id]: height,
              },
            },
          };
        } else {
          rowCellStyle = {
            cellCfg: {
              height,
            },
          };
        }
        return {
          eventType: S2Event.LAYOUT_RESIZE_ROW_HEIGHT,
          style: rowCellStyle,
        };
      default:
        return null;
    }
  }

  private getResizeDetail() {
    const resizeInfo = this.getResizeInfo();

    return resizeInfo.type === ResizeDirectionType.Horizontal
      ? this.getResizeWidthDetail()
      : this.getResizeHeightDetail();
  }

  private showResizeGroup() {
    this.initResizeGroup();
    this.resizeReferenceGroup.set('visible', true);
  }

  private hideResizeGroup() {
    this.resizeReferenceGroup.set('visible', false);
  }

  private bindMouseUp() {
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_UP, () => {
      if (
        !this.resizeReferenceGroup ||
        isEmpty(this.resizeReferenceGroup?.getChildren())
      ) {
        return;
      }

      this.hideResizeGroup();
      this.renderResizedResult();
    });
  }

  private resizeMouseMove = (event: CanvasEvent) => {
    if (!this.resizeReferenceGroup?.get('visible')) {
      return;
    }
    event?.preventDefault?.();

    const originalEvent = event.originalEvent as MouseEvent;
    const resizeInfo = this.getResizeInfo();
    const resizeShapes = this.resizeReferenceGroup.get('children') as IShape[];

    if (isEmpty(resizeShapes)) {
      return;
    }

    const [, endGuideLineShape] = resizeShapes;
    const [guideLineStart, guideLineEnd]: ResizeGuideLinePath[] = clone(
      endGuideLineShape.attr('path'),
    );

    if (resizeInfo.type === ResizeDirectionType.Horizontal) {
      this.updateHorizontalResizingEndGuideLinePosition(
        originalEvent,
        resizeInfo,
        guideLineStart,
        guideLineEnd,
      );
    } else {
      this.updateVerticalResizingEndGuideLinePosition(
        originalEvent,
        resizeInfo,
        guideLineStart,
        guideLineEnd,
      );
    }
    endGuideLineShape.attr('path', [guideLineStart, guideLineEnd]);
  };

  private updateHorizontalResizingEndGuideLinePosition(
    originalEvent: MouseEvent,
    resizeInfo: ResizeInfo,
    guideLineStart: ResizeGuideLinePath,
    guideLineEnd: ResizeGuideLinePath,
  ) {
    let offsetX = originalEvent.offsetX - this.resizeStartPosition.offsetX;
    if (resizeInfo.width + offsetX < MIN_CELL_WIDTH) {
      // 禁止拖到最小宽度
      offsetX = -(resizeInfo.width - MIN_CELL_WIDTH);
    }

    const resizedOffsetX = resizeInfo.offsetX + resizeInfo.width + offsetX;

    guideLineStart[1] = resizedOffsetX;
    guideLineEnd[1] = resizedOffsetX;

    this.resizeTarget.attr({
      x: resizedOffsetX - resizeInfo.size / 2,
    });
  }

  private updateVerticalResizingEndGuideLinePosition(
    originalEvent: MouseEvent,
    resizeInfo: ResizeInfo,
    guideLineStart: ResizeGuideLinePath,
    guideLineEnd: ResizeGuideLinePath,
  ) {
    let offsetY = originalEvent.offsetY - this.resizeStartPosition.offsetY;

    if (resizeInfo.height + offsetY < MIN_CELL_HEIGHT) {
      offsetY = -(resizeInfo.height - MIN_CELL_HEIGHT);
    }

    const resizedOffsetY = resizeInfo.offsetY + resizeInfo.height + offsetY;

    guideLineStart[2] = resizedOffsetY;
    guideLineEnd[2] = resizedOffsetY;

    this.resizeTarget.attr({
      y: resizedOffsetY - resizeInfo.size / 2,
    });
  }

  private renderResizedResult() {
    const resizeInfo = this.getResizeInfo();
    const {
      style,
      seriesNumberWidth,
      eventType: resizeEventType,
    } = this.getResizeDetail() || {};

    const resizeDetail = {
      info: resizeInfo,
      style,
    };
    this.spreadsheet.emit(S2Event.LAYOUT_RESIZE, resizeDetail);
    this.spreadsheet.emit(resizeEventType, resizeDetail);

    if (style) {
      this.spreadsheet.setOptions({ style });
    } else {
      this.spreadsheet.theme.rowCell.seriesNumberWidth = seriesNumberWidth;
    }

    this.spreadsheet.store.set('resized', true);
    this.render();
  }

  private getResizeInfo(): ResizeInfo {
    return this.resizeTarget?.attr('appendInfo');
  }

  private render() {
    this.resizeStartPosition = {};
    this.resizeTarget = null;
    this.resizeReferenceGroup = null;
    this.spreadsheet.render(false);
  }
}
