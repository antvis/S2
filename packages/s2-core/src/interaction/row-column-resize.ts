import {
  type FederatedPointerEvent as CanvasEvent,
  Group,
  type DisplayObject,
  type PathStyleProps,
  Path,
} from '@antv/g';
import { clone, isEmpty, throttle } from 'lodash';
import type { ResizeInteractionOptions, ResizeParams, Style } from '../common';
import {
  InterceptType,
  MIN_CELL_HEIGHT,
  MIN_CELL_WIDTH,
  ResizeAreaEffect,
  ResizeDirectionType,
  ResizeType,
  RESIZE_END_GUIDE_LINE_ID,
  RESIZE_MASK_ID,
  RESIZE_START_GUIDE_LINE_ID,
  S2Event,
} from '../common/constant';
import type {
  ResizeDetail,
  ResizeGuideLinePath,
  ResizeGuideLinePosition,
  ResizeInfo,
  ResizePosition,
} from '../common/interface/resize';
import { CustomRect } from '../engine';
import { BaseEvent, type BaseEventImplement } from './base-interaction';

export class RowColumnResize extends BaseEvent implements BaseEventImplement {
  private resizeTarget: Group;

  public resizeReferenceGroup: Group;

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
    this.resizeReferenceGroup = this.spreadsheet.foregroundGroup.appendChild(
      new Group(),
    );

    const { width, height } = this.spreadsheet.options;
    const { guideLineColor, guideLineDash, size } = this.getResizeAreaTheme();
    const style: PathStyleProps = {
      path: '',
      lineDash: guideLineDash,
      stroke: guideLineColor,
      lineWidth: size,
    };
    // 起始参考线
    this.resizeReferenceGroup.appendChild(
      new Path({
        id: RESIZE_START_GUIDE_LINE_ID,
        style,
      }),
    );
    // 结束参考线
    this.resizeReferenceGroup.appendChild(
      new Path({
        id: RESIZE_END_GUIDE_LINE_ID,
        style,
      }),
    );
    // Resize 蒙层
    this.resizeReferenceGroup.appendChild(
      new CustomRect(
        {
          id: RESIZE_MASK_ID,
          style: {
            x: 0,
            y: 0,
            width,
            height,
            fill: 'transparent',
          },
        },
        {
          isResizeArea: true,
        },
      ),
    );
  }

  private getResizeAreaTheme() {
    return this.spreadsheet.theme.resizeArea;
  }

  private setResizeTarget(target: Group) {
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

  private getResizeShapes(): DisplayObject[] {
    return (this.resizeReferenceGroup?.children || []) as DisplayObject[];
  }

  private setResizeMaskCursor(cursor: string) {
    // TODO: 是否改成 getById?
    const [, , resizeMask] = this.getResizeShapes();
    resizeMask?.attr('cursor', cursor);
  }

  private updateResizeGuideLinePosition(
    event: MouseEvent,
    resizeInfo: ResizeInfo,
  ) {
    const resizeShapes = this.getResizeShapes();

    if (isEmpty(resizeShapes)) {
      return;
    }

    const [startResizeGuideLineShape, endResizeGuideLineShape] = resizeShapes;
    const { type, offsetX, offsetY, width, height } = resizeInfo;
    const { width: guideLineMaxWidth, height: guideLineMaxHeight } =
      this.getGuideLineWidthAndHeight();

    this.setResizeMaskCursor(`${type}-resize`);

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
      const shape = event.target as Group;
      // TODO: 结合 event-controller 里 resizeMouseMoveCapture 一起改
      const originalEvent = event.originalEvent as unknown as MouseEvent;
      const resizeInfo = this.getCellAppendInfo<ResizeInfo>(event.target);
      this.spreadsheet.store.set('resized', false);

      if (!resizeInfo?.isResizeArea) {
        return;
      }

      // 鼠标在 resize 热区 按下时, 将 tooltip 关闭, 避免造成干扰
      this.spreadsheet.interaction.reset();
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
    // TODO: 是否用 id 来索引图形
    const [startGuideLineShape, endGuideLineShape] = (this.resizeReferenceGroup
      .children || []) as [Path, Path];
    const startGuideLinePath = startGuideLineShape?.attr('path') || [];
    const endGuideLinePath = endGuideLineShape?.attr('path') || [];

    // TODO: 查看 path 取值是否正常
    const [, startX = 0, startY = 0] = startGuideLinePath[0] || [];
    const [, endX = 0, endY = 0] = endGuideLinePath[0] || [];

    return {
      start: {
        x: +startX,
        y: +startY,
      },
      end: {
        x: +endX,
        y: +endY,
      },
    };
  }

  private getDisAllowResizeInfo() {
    const resizeInfo = this.getResizeInfo();
    const { resize } = this.spreadsheet.options.interaction;

    const {
      width: originalWidth,
      height: originalHeight,
      resizedWidth,
      resizedHeight,
    } = resizeInfo;

    const isDisabled = (resize as ResizeInteractionOptions)?.disable?.(
      resizeInfo,
    );

    const displayWidth = isDisabled ? originalWidth : resizedWidth;
    const displayHeight = isDisabled ? originalHeight : resizedHeight;

    return {
      displayWidth,
      displayHeight,
      isDisabled,
    };
  }

  private getResizeWidthDetail(): ResizeDetail {
    const resizeInfo = this.getResizeInfo();
    const { displayWidth } = this.getDisAllowResizeInfo();

    switch (resizeInfo.effect) {
      case ResizeAreaEffect.Field:
        return {
          eventType: S2Event.LAYOUT_RESIZE_ROW_WIDTH,
          style: {
            rowCfg: {
              widthByField: {
                [resizeInfo.id]: displayWidth,
              },
            },
          },
        };

      case ResizeAreaEffect.Tree:
        return {
          eventType: S2Event.LAYOUT_RESIZE_TREE_WIDTH,
          style: {
            treeRowsWidth: displayWidth,
            rowCfg: {
              /**
               * @deprecated 已废弃, 以 style.treeRowsWidth 为准, 保持兼容, 暂时保留
               */
              treeRowsWidth: displayWidth,
            },
          },
        };

      case ResizeAreaEffect.Cell:
        return {
          eventType: S2Event.LAYOUT_RESIZE_COL_WIDTH,
          style: {
            colCfg: {
              widthByFieldValue: {
                [resizeInfo.id]: displayWidth,
              },
            },
          },
        };

      case ResizeAreaEffect.Series:
        return {
          eventType: S2Event.LAYOUT_RESIZE_SERIES_WIDTH,
          seriesNumberWidth: displayWidth,
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
    const resizeInfo = this.getResizeInfo();
    const { displayHeight } = this.getDisAllowResizeInfo();
    const height = displayHeight - rowCellPadding.top - rowCellPadding.bottom;

    let rowCellStyle: Style;
    switch (resizeInfo.effect) {
      case ResizeAreaEffect.Field:
        return {
          eventType: S2Event.LAYOUT_RESIZE_COL_HEIGHT,
          style: {
            colCfg: {
              heightByField: {
                [resizeInfo.id]: displayHeight,
              },
            },
          },
        };
      case ResizeAreaEffect.Cell:
        if (
          heightByField[String(resizeInfo.id)] ||
          (resize as ResizeInteractionOptions)?.rowResizeType ===
            ResizeType.CURRENT
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
    this.resizeReferenceGroup.setAttribute('visibility', 'visible');
  }

  private hideResizeGroup() {
    this.resizeReferenceGroup.setAttribute('visibility', 'hidden');
  }

  private bindMouseUp() {
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_UP, () => {
      this.setResizeMaskCursor('default');

      if (
        !this.resizeReferenceGroup ||
        isEmpty(this.resizeReferenceGroup?.children)
      ) {
        return;
      }

      this.hideResizeGroup();
      this.renderResizedResult();
    });
  }

  private resizeMouseMove = (event: CanvasEvent) => {
    if (this.resizeReferenceGroup?.parsedStyle.visibility !== 'visible') {
      return;
    }
    event?.preventDefault?.();

    // TODO: 结合 event-controller 里 resizeMouseMoveCapture 一起改
    const originalEvent = event.originalEvent as unknown as MouseEvent;
    const resizeInfo = this.getResizeInfo();
    const resizeShapes =
      (this.resizeReferenceGroup.children as DisplayObject[]) || [];

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

    this.updateResizeGuideLineTheme(endGuideLineShape);
    endGuideLineShape.attr('path', [guideLineStart, guideLineEnd]);
  };

  private updateResizeGuideLineTheme(endGuideLineShape: DisplayObject) {
    const { guideLineColor, guideLineDisableColor } = this.getResizeAreaTheme();
    const { isDisabled } = this.getDisAllowResizeInfo();
    endGuideLineShape.attr(
      'stroke',
      isDisabled ? guideLineDisableColor : guideLineColor,
    );
    this.setResizeMaskCursor(isDisabled ? 'no-drop' : 'default');
  }

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

    const resizeDetail: ResizeParams = {
      info: resizeInfo,
      style,
    };

    this.spreadsheet.emit(S2Event.LAYOUT_RESIZE, resizeDetail);
    this.spreadsheet.emit(resizeEventType, resizeDetail);

    if (style) {
      this.spreadsheet.setOptions({ style });
    }

    if (seriesNumberWidth) {
      this.spreadsheet.setTheme({
        rowCell: {
          seriesNumberWidth,
        },
      });
    }

    this.spreadsheet.store.set('resized', true);
    this.render();
  }

  private getResizeInfo(): ResizeInfo {
    const defaultResizeInfo = this.getCellAppendInfo<ResizeInfo>(
      this.resizeTarget,
    );
    const { start, end } = this.getResizeGuideLinePosition();
    const resizedWidth = Math.floor(end.x - start.x);
    const resizedHeight = Math.floor(end.y - start.y);

    return {
      ...defaultResizeInfo,
      resizedWidth,
      resizedHeight,
    };
  }

  private render() {
    this.resizeStartPosition = {};
    this.resizeTarget = null;
    this.resizeReferenceGroup = null;
    this.spreadsheet.render(false);
  }
}
