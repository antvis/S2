import {
  type FederatedPointerEvent as CanvasEvent,
  Group,
  type DisplayObject,
  type PathStyleProps,
  Path,
} from '@antv/g';
import { clone, isEmpty, throttle } from 'lodash';
import type { ResizeInteractionOptions, ResizeParams, RowCfg } from '../common';
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
  private resizeTarget: Group | null;

  private cursorType: string;

  public resizeReferenceGroup: Group | null;

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
    this.resizeReferenceGroup =
      this.spreadsheet.facet.foregroundGroup.appendChild(new Group());

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
            width: width!,
            height: height!,
            fill: 'transparent',
          },
        },
        {
          isResizeArea: true,
          isResizeMask: true,
        },
      ),
    );
  }

  private getResizeAreaTheme() {
    return this.spreadsheet.theme.resizeArea!;
  }

  private setResizeTarget(target: Group) {
    this.resizeTarget = target;
  }

  private getGuideLineWidthAndHeight() {
    const { width: canvasWidth, height: canvasHeight } =
      this.spreadsheet.options;
    const { maxY, maxX } = this.spreadsheet.facet.panelBBox;
    const width = Math.min(maxX, canvasWidth!);
    const height = Math.min(maxY, canvasHeight!);

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
    const { type, offsetX, offsetY, width, height, size } = resizeInfo;

    const { width: guideLineMaxWidth, height: guideLineMaxHeight } =
      this.getGuideLineWidthAndHeight();

    this.cursorType = `${type}-resize`;
    this.setResizeMaskCursor(this.cursorType);

    // resize guide line 向内收缩 halfSize，保证都绘制在单元格内，防止在开始和末尾的格子中有一半线段被clip
    // 后续计算 resized 尺寸时，需要把收缩的部分加回来
    const halfSize = size / 2;
    if (type === ResizeDirectionType.Horizontal) {
      startResizeGuideLineShape.attr('path', [
        ['M', offsetX + halfSize, offsetY],
        ['L', offsetX + halfSize, guideLineMaxHeight],
      ]);
      endResizeGuideLineShape.attr('path', [
        ['M', offsetX + width - halfSize, offsetY],
        ['L', offsetX + width - halfSize, guideLineMaxHeight],
      ]);
      this.resizeStartPosition.offsetX = event.offsetX;
      return;
    }

    startResizeGuideLineShape.attr('path', [
      ['M', offsetX, offsetY + halfSize],
      ['L', guideLineMaxWidth, offsetY + halfSize],
    ]);
    endResizeGuideLineShape.attr('path', [
      ['M', offsetX, offsetY + height - halfSize],
      ['L', guideLineMaxWidth, offsetY + height - halfSize],
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
    this.spreadsheet.on(
      S2Event.LAYOUT_RESIZE_MOUSE_MOVE,
      throttle(this.resizeMouseMove.bind(this), 33),
    );
  }

  // 将 SVG 的 path 转成更可读的坐标对象
  private getResizeGuideLinePosition(): ResizeGuideLinePosition {
    // TODO: 是否用 id 来索引图形
    const [startGuideLineShape, endGuideLineShape] = (this.resizeReferenceGroup
      ?.children || []) as [Path, Path];
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
    const { resize } = this.spreadsheet.options.interaction!;

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

  private getResizeCellField(resizeInfo: ResizeInfo) {
    const {
      options: { interaction },
      isTableMode,
    } = this.spreadsheet;

    const resizeType = interaction?.resize as ResizeInteractionOptions;
    const isOnlyEffectCurrent =
      resizeInfo.type === ResizeDirectionType.Vertical
        ? resizeType?.rowResizeType === ResizeType.CURRENT
        : resizeType?.colResizeType === ResizeType.CURRENT;

    if (isTableMode()) {
      return resizeInfo?.meta?.rowId || String(resizeInfo?.meta?.rowIndex);
    }

    return isOnlyEffectCurrent ? resizeInfo?.meta.id : resizeInfo?.meta.field;
  }

  private getResizeWidthDetail(): ResizeDetail | null {
    const resizeInfo = this.getResizeInfo();
    const { displayWidth } = this.getDisAllowResizeInfo();

    switch (resizeInfo.effect) {
      case ResizeAreaEffect.Field:
        return {
          eventType: S2Event.LAYOUT_RESIZE_ROW_WIDTH,
          style: {
            rowCfg: {
              widthByField: {
                [resizeInfo.meta.field!]: displayWidth!,
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
              widthByField: {
                [this.getResizeCellField(resizeInfo)]: displayWidth!,
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

  private getResizeHeightDetail(): ResizeDetail | null {
    const { theme } = this.spreadsheet;
    const { padding: rowCellPadding } = theme.rowCell!.cell!;
    const resizeInfo = this.getResizeInfo();
    const { displayHeight } = this.getDisAllowResizeInfo();
    const height =
      displayHeight! - rowCellPadding!.top! - rowCellPadding!.bottom!;

    switch (resizeInfo.effect) {
      case ResizeAreaEffect.Field:
        return {
          eventType: S2Event.LAYOUT_RESIZE_COL_HEIGHT,
          style: {
            colCfg: {
              heightByField: this.getHeightByField(resizeInfo, displayHeight!),
            },
          },
        };

      case ResizeAreaEffect.Cell:
        return {
          eventType: S2Event.LAYOUT_RESIZE_ROW_HEIGHT,
          style: {
            rowCfg: {
              heightByField: {
                [this.getResizeCellField(resizeInfo)]: height,
              },
            },
          },
        };

      default:
        return null;
    }
  }

  private getHeightByField(
    resizeInfo: ResizeInfo,
    displayHeight: number,
  ): RowCfg['heightByField'] {
    // 如果是自定义列头, 给同一 level 的字段设置高度
    if (this.spreadsheet.isCustomColumnFields()) {
      return this.spreadsheet
        .getColumnNodes()
        .filter((node) => node.level === resizeInfo.meta?.level)
        .reduce<RowCfg['heightByField']>((result, node) => {
          result![node.field] = displayHeight;
          return result;
        }, {});
    }

    return {
      [resizeInfo.meta.field!]: displayHeight,
    };
  }

  private getResizeDetail() {
    const resizeInfo = this.getResizeInfo();

    return resizeInfo.type === ResizeDirectionType.Horizontal
      ? this.getResizeWidthDetail()
      : this.getResizeHeightDetail();
  }

  private showResizeGroup() {
    this.initResizeGroup();
    this.resizeReferenceGroup?.setAttribute('visibility', 'visible');
  }

  private hideResizeGroup() {
    this.resizeReferenceGroup?.setAttribute('visibility', 'hidden');
  }

  private bindMouseUp() {
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_UP, () => {
      this.cursorType = 'default';
      this.setResizeMaskCursor(this.cursorType);

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

  private resizeMouseMove(event: CanvasEvent) {
    if (this.resizeReferenceGroup?.parsedStyle.visibility !== 'visible') {
      return;
    }
    event?.preventDefault?.();

    // TODO: 结合 event-controller 里 resizeMouseMoveCapture 一起改
    const originalEvent = event.originalEvent as unknown as MouseEvent;
    const resizeInfo = this.getResizeInfo();
    const resizeShapes =
      (this.resizeReferenceGroup?.children as DisplayObject[]) || [];

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
  }

  private updateResizeGuideLineTheme(endGuideLineShape: DisplayObject) {
    const { guideLineColor, guideLineDisableColor } = this.getResizeAreaTheme();
    const { isDisabled } = this.getDisAllowResizeInfo();
    endGuideLineShape.attr(
      'stroke',
      isDisabled ? guideLineDisableColor : guideLineColor,
    );
    this.setResizeMaskCursor(isDisabled ? 'no-drop' : this.cursorType);
  }

  private updateHorizontalResizingEndGuideLinePosition(
    originalEvent: MouseEvent,
    resizeInfo: ResizeInfo,
    guideLineStart: ResizeGuideLinePath,
    guideLineEnd: ResizeGuideLinePath,
  ) {
    let offsetX = originalEvent.offsetX - this.resizeStartPosition.offsetX!;
    if (resizeInfo.width + offsetX < MIN_CELL_WIDTH) {
      // 禁止拖到最小宽度
      offsetX = -(resizeInfo.width - MIN_CELL_WIDTH);
    }

    const resizedOffsetX = resizeInfo.offsetX + resizeInfo.width + offsetX;

    const halfSize = resizeInfo.size / 2;
    guideLineStart[1] = resizedOffsetX - halfSize;
    guideLineEnd[1] = resizedOffsetX - halfSize;

    this.resizeTarget?.attr({
      x: resizedOffsetX - resizeInfo.size,
    });
  }

  private updateVerticalResizingEndGuideLinePosition(
    originalEvent: MouseEvent,
    resizeInfo: ResizeInfo,
    guideLineStart: ResizeGuideLinePath,
    guideLineEnd: ResizeGuideLinePath,
  ) {
    let offsetY = originalEvent.offsetY - this.resizeStartPosition.offsetY!;

    if (resizeInfo.height + offsetY < MIN_CELL_HEIGHT) {
      offsetY = -(resizeInfo.height - MIN_CELL_HEIGHT);
    }

    const resizedOffsetY = resizeInfo.offsetY + resizeInfo.height + offsetY;

    const halfSize = resizeInfo.size / 2;
    guideLineStart[2] = resizedOffsetY - halfSize;
    guideLineEnd[2] = resizedOffsetY - halfSize;

    this.resizeTarget?.attr({
      y: resizedOffsetY - resizeInfo.size,
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
    this.spreadsheet.emit(resizeEventType!, resizeDetail);

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
      this.resizeTarget!,
    );

    const { start, end } = this.getResizeGuideLinePosition();
    const resizedWidth = Math.floor(
      end.x -
        start.x +
        (defaultResizeInfo.type === ResizeDirectionType.Horizontal
          ? defaultResizeInfo.size
          : 0),
    );
    const resizedHeight = Math.floor(
      end.y -
        start.y +
        (defaultResizeInfo.type === ResizeDirectionType.Vertical
          ? defaultResizeInfo.size
          : 0),
    );

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
