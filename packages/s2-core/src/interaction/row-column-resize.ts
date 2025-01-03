import {
  FederatedPointerEvent,
  Group,
  Path,
  type DisplayObject,
  type PathStyleProps,
} from '@antv/g';
import { clone, isEmpty, throttle } from 'lodash';
import type {
  CellTextWordWrapStyle,
  ResizeInteractionOptions,
  ResizeParams,
} from '../common';
import {
  InterceptType,
  RESIZE_END_GUIDE_LINE_ID,
  RESIZE_MASK_ID,
  RESIZE_MIN_CELL_HEIGHT,
  RESIZE_MIN_CELL_WIDTH,
  RESIZE_START_GUIDE_LINE_ID,
  ResizeAreaEffect,
  ResizeDirectionType,
  ResizeType,
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
import { Node } from '../facet/layout/node';
import { round } from '../utils/math';
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
      d: '',
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
    const [, , resizeMask] = this.getResizeShapes();

    resizeMask?.attr('cursor', cursor);
  }

  private updateResizeGuideLinePosition(
    event: FederatedPointerEvent,
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

    /*
     * resize guide line 向内收缩 halfSize，保证都绘制在单元格内，防止在开始和末尾的格子中有一半线段被 clip
     * 后续计算 resized 尺寸时，需要把收缩的部分加回来
     */
    const halfSize = size / 2;

    if (type === ResizeDirectionType.Horizontal) {
      startResizeGuideLineShape.attr('d', [
        ['M', offsetX + halfSize, offsetY],
        ['L', offsetX + halfSize, guideLineMaxHeight],
      ]);
      endResizeGuideLineShape.attr('d', [
        ['M', offsetX + width - halfSize, offsetY],
        ['L', offsetX + width - halfSize, guideLineMaxHeight],
      ]);
      this.resizeStartPosition.offsetX = event.offsetX;
      this.resizeStartPosition.clientX = event.clientX;

      return;
    }

    startResizeGuideLineShape.attr('d', [
      ['M', offsetX, offsetY + halfSize],
      ['L', guideLineMaxWidth, offsetY + halfSize],
    ]);
    endResizeGuideLineShape.attr('d', [
      ['M', offsetX, offsetY + height - halfSize],
      ['L', guideLineMaxWidth, offsetY + height - halfSize],
    ]);
    this.resizeStartPosition.offsetY = event.offsetY;
    this.resizeStartPosition.clientY = event.clientY;
  }

  private bindMouseDown() {
    this.spreadsheet.on(S2Event.LAYOUT_RESIZE_MOUSE_DOWN, (event) => {
      event?.preventDefault?.();

      const shape = event.target as Group;
      const resizeInfo = this.getCellAppendInfo<ResizeInfo>(event.target);

      this.spreadsheet.store.set('resized', false);

      if (!resizeInfo?.isResizeArea) {
        return;
      }

      // 鼠标在 resize 热区 按下时, 保留交互态, 但是把 tooltip 关闭, 避免造成干扰
      this.spreadsheet.hideTooltip();
      this.spreadsheet.interaction.addIntercepts([InterceptType.RESIZE]);
      this.setResizeTarget(shape);
      this.showResizeGroup();
      this.updateResizeGuideLinePosition(event, resizeInfo);
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
    const [startGuideLineShape, endGuideLineShape] = (this.resizeReferenceGroup
      ?.children || []) as [Path, Path];
    const startGuideLinePath = startGuideLineShape?.attr('d') || [];
    const endGuideLinePath = endGuideLineShape?.attr('d') || [];

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
      resizedWidth = 0,
      resizedHeight = 0,
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
    const isVertical = resizeInfo.type === ResizeDirectionType.Vertical;
    const isOnlyEffectPartial = isVertical
      ? !this.isEffectRowOf(ResizeType.ALL)
      : !this.isEffectColOf(ResizeType.ALL);

    if (this.spreadsheet.isTableMode()) {
      return isVertical
        ? resizeInfo?.meta?.rowId || String(resizeInfo?.meta?.rowIndex)
        : resizeInfo?.meta?.field;
    }

    return isOnlyEffectPartial ? resizeInfo?.meta?.id : resizeInfo?.meta?.field;
  }

  private isEffectRowOf(resizeType: ResizeType) {
    return (
      (this.spreadsheet.options.interaction?.resize as ResizeInteractionOptions)
        ?.rowResizeType === resizeType
    );
  }

  private isEffectColOf(resizeType: ResizeType) {
    return (
      (this.spreadsheet.options.interaction?.resize as ResizeInteractionOptions)
        ?.colResizeType === resizeType
    );
  }

  private getCellStyleByField(resizeValue: number): Record<string, number> {
    const { interaction } = this.spreadsheet;
    const resizeInfo = this.getResizeInfo();

    const isVertical = resizeInfo.type === ResizeDirectionType.Vertical;
    const activeCells = isVertical
      ? interaction.getActiveRowCells()
      : interaction.getActiveColCells();
    const isMultiSelected =
      interaction.isSelectedState() && activeCells.length > 1;

    // 非多选: 正常设置即可
    if (
      (!this.isEffectRowOf(ResizeType.SELECTED) &&
        !this.isEffectColOf(ResizeType.SELECTED)) ||
      !isMultiSelected
    ) {
      return {
        [this.getResizeCellField(resizeInfo)]: resizeValue,
      };
    }

    // 多选: 将当前选中的行列单元格对应的叶子节点统一设置宽高
    return activeCells.reduce<Record<string, number>>((result, cell) => {
      // 热区是绘制在叶子节点的, 如果选中的父节点, 那么叶子节点也算是多选, 需要给每一个叶子节点批量设置
      Node.getAllLeaveNodes(cell.getMeta() as Node).forEach((node) => {
        const newResizeInfo: ResizeInfo = {
          ...resizeInfo,
          meta: node,
        };

        result![this.getResizeCellField(newResizeInfo)!] = resizeValue;
      });

      return result;
    }, {});
  }

  private getResizeWidthDetail(): ResizeDetail | null {
    const resizeInfo = this.getResizeInfo();
    const { displayWidth } = this.getDisAllowResizeInfo();

    switch (resizeInfo.effect) {
      case ResizeAreaEffect.Field:
        return {
          eventType: S2Event.LAYOUT_RESIZE_ROW_WIDTH,
          style: {
            rowCell: {
              widthByField: {
                [resizeInfo.meta.field as string]: displayWidth!,
              },
            },
          },
        };

      case ResizeAreaEffect.Tree:
        return {
          eventType: S2Event.LAYOUT_RESIZE_TREE_WIDTH,
          style: {
            rowCell: {
              treeWidth: displayWidth,
            },
          },
        };

      case ResizeAreaEffect.Cell:
        return {
          eventType: S2Event.LAYOUT_RESIZE_COL_WIDTH,
          style: {
            colCell: {
              width: !this.isEffectColOf(ResizeType.ALL)
                ? undefined
                : displayWidth,
              widthByField: this.getCellStyleByField(displayWidth),
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
    const { style } = this.spreadsheet.options;
    const resizeInfo = this.getResizeInfo();
    const { displayHeight } = this.getDisAllowResizeInfo();

    switch (resizeInfo.effect) {
      case ResizeAreaEffect.Field:
        return {
          eventType: S2Event.LAYOUT_RESIZE_COL_HEIGHT,
          style: {
            colCell: this.getResizedCellStyleByField(
              this.getColCellHeightByField(resizeInfo, displayHeight!),
              style?.colCell!,
              displayHeight,
            ),
          },
        };

      case ResizeAreaEffect.Cell:
        return {
          eventType: S2Event.LAYOUT_RESIZE_ROW_HEIGHT,
          style: {
            rowCell: {
              ...this.getResizedCellStyleByField(
                this.getCellStyleByField(displayHeight),
                style?.rowCell!,
                displayHeight,
              ),
              height: !this.isEffectRowOf(ResizeType.ALL)
                ? undefined
                : displayHeight,
            },
          },
        };

      default:
        return null;
    }
  }

  private getResizedCellStyleByField(
    heightByField: Record<string, number>,
    cellStyle: CellTextWordWrapStyle,
    displayHeight: number,
  ) {
    const isEnableHeightAdaptive =
      cellStyle?.maxLines! > 1 && cellStyle?.wordWrap;

    if (!isEnableHeightAdaptive) {
      return {
        heightByField,
      };
    }

    // 如果开启了换行, 高度拖拽后动态计算 maxLines 的值, 已保证展示合理性.
    const { cell } = this.getResizeInfo();
    const maxLines = cell.getMaxLinesByCustomHeight({
      targetCell: cell,
      displayHeight,
      isCustomHeight: true,
    });

    const maxLinesByField = Object.keys(heightByField || {}).reduce<
      Record<string, number>
    >((result, field) => {
      result![field] = maxLines!;

      return result;
    }, {});

    return {
      heightByField,
      maxLinesByField,
    };
  }

  private getColCellHeightByField(
    resizeInfo: ResizeInfo,
    displayHeight: number,
  ): Record<string, number> {
    // 1. 自定义列头: 给同一层级且同高度的单元格设置高度. 2. 明细表: 列高一致
    if (
      this.spreadsheet.isCustomColumnFields() ||
      this.spreadsheet.isTableMode()
    ) {
      return this.spreadsheet.facet
        .getColNodes()
        .filter(
          (node) =>
            node.level === resizeInfo.meta?.level &&
            node.height === resizeInfo.meta?.height,
        )
        .reduce<Record<string, number>>((result, node) => {
          result![node.field] = displayHeight;

          return result;
        }, {});
    }

    return {
      [resizeInfo.meta.field as string]: displayHeight,
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

  private resizeMouseMove(event: PointerEvent) {
    if (this.resizeReferenceGroup?.parsedStyle.visibility !== 'visible') {
      return;
    }

    const resizeInfo = this.getResizeInfo();
    const resizeShapes =
      (this.resizeReferenceGroup?.children as DisplayObject[]) || [];

    if (isEmpty(resizeShapes)) {
      return;
    }

    const [, endGuideLineShape] = resizeShapes;
    const [guideLineStart, guideLineEnd]: ResizeGuideLinePath[] = clone(
      endGuideLineShape.attr('d'),
    );

    if (resizeInfo.type === ResizeDirectionType.Horizontal) {
      this.updateHorizontalResizingEndGuideLinePosition(
        event.offsetX,
        resizeInfo,
        { start: guideLineStart, end: guideLineEnd },
      );
    } else {
      this.updateVerticalResizingEndGuideLinePosition(
        event.offsetY,
        resizeInfo,
        { start: guideLineStart, end: guideLineEnd },
      );
    }

    this.updateResizeGuideLineTheme(endGuideLineShape);
    endGuideLineShape.attr('d', [guideLineStart, guideLineEnd]);
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
    offsetX: number,
    resizeInfo: ResizeInfo,
    guideLine: {
      start: ResizeGuideLinePath;
      end: ResizeGuideLinePath;
    },
  ) {
    const { minCellWidth = RESIZE_MIN_CELL_WIDTH } =
      (this.spreadsheet.options.interaction
        ?.resize as ResizeInteractionOptions) || {};
    let nextOffsetX = offsetX - this.resizeStartPosition.offsetX!;

    if (resizeInfo.width + nextOffsetX < minCellWidth) {
      // 禁止拖到最小宽度
      nextOffsetX = -(resizeInfo.width - minCellWidth);
    }

    const resizedOffsetX = resizeInfo.offsetX + resizeInfo.width + nextOffsetX;

    const halfSize = resizeInfo.size / 2;

    guideLine.start[1] = resizedOffsetX - halfSize;
    guideLine.end[1] = resizedOffsetX - halfSize;

    this.resizeTarget?.attr({
      x: resizedOffsetX - resizeInfo.size,
    });
  }

  private updateVerticalResizingEndGuideLinePosition(
    offsetY: number,
    resizeInfo: ResizeInfo,
    guideLine: {
      start: ResizeGuideLinePath;
      end: ResizeGuideLinePath;
    },
  ) {
    const { minCellHeight = RESIZE_MIN_CELL_HEIGHT } =
      (this.spreadsheet.options.interaction
        ?.resize as ResizeInteractionOptions) || {};
    let nextOffsetY = offsetY - this.resizeStartPosition.offsetY!;

    if (resizeInfo.height + nextOffsetY < minCellHeight) {
      nextOffsetY = -(resizeInfo.height - minCellHeight);
    }

    const resizedOffsetY = resizeInfo.offsetY + resizeInfo.height + nextOffsetY;

    const halfSize = resizeInfo.size / 2;

    guideLine.start[2] = resizedOffsetY - halfSize;
    guideLine.end[2] = resizedOffsetY - halfSize;

    this.resizeTarget?.attr({
      y: resizedOffsetY - resizeInfo.size,
    });
  }

  private async renderResizedResult() {
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
    await this.render();
  }

  private getResizeInfo(): ResizeInfo {
    const defaultResizeInfo = this.getCellAppendInfo<ResizeInfo>(
      this.resizeTarget!,
    );

    const { start, end } = this.getResizeGuideLinePosition();
    const resizedWidth = round(
      end.x -
        start.x +
        (defaultResizeInfo.type === ResizeDirectionType.Horizontal
          ? defaultResizeInfo.size
          : 0),
    );
    const resizedHeight = round(
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

  private async render() {
    this.resizeStartPosition = {};
    this.resizeTarget = null;
    this.resizeReferenceGroup = null;
    await this.spreadsheet.render(false);
  }
}
