import type { Group, PointLike } from '@antv/g';
import { isEmpty } from 'lodash';
import { adjustTextIconPositionWhileScrolling } from '../utils/cell/text-scrolling';
import { normalizeTextAlign } from '../utils/normalize';
import {
  CellType,
  HORIZONTAL_RESIZE_AREA_KEY_PRE,
  KEY_GROUP_COL_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
  S2Event,
  SPLIT_LINE_WIDTH,
} from '../common/constant';
import type {
  DefaultCellTheme,
  FormatResult,
  IconTheme,
} from '../common/interface';
import { CellBorderPosition, CellClipBox } from '../common/interface';
import type { AreaRange } from '../common/interface/scroll';
import { CustomRect, type SimpleBBox } from '../engine';
import { Frame, type ColHeaderConfig } from '../facet/header';
import {
  getHorizontalTextIconPosition,
  getVerticalIconPosition,
  getVerticalTextPosition,
} from '../utils/cell/cell';
import { renderIcon, renderLine } from '../utils/g-renders';
import { isLastColumnAfterHidden } from '../utils/hide-columns';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
  shouldAddResizeArea,
} from '../utils/interaction/resize';
import { isEqualDisplaySiblingNodeId } from './../utils/hide-columns';
import { HeaderCell } from './header-cell';

export class ColCell extends HeaderCell<ColHeaderConfig> {
  public get cellType() {
    return CellType.COL_CELL;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.TOP, CellBorderPosition.RIGHT];
  }

  protected initCell() {
    super.initCell();
    // 1、draw rect background
    this.drawBackgroundShape();
    // interactive background shape
    this.drawInteractiveBgShape();
    // interactive cell border shape
    this.drawInteractiveBorderShape();
    // draw text
    this.drawTextShape();
    // 绘制字段标记 -- icon
    this.drawActionAndConditionIcons();
    // draw borders
    this.drawBorders();
    // draw resize ares
    this.drawResizeArea();
    this.addExpandColumnIconShapes();
    this.update();
  }

  protected getFormattedFieldValue(): FormatResult {
    const { extra, value, field } = this.meta;
    const { fields } = this.spreadsheet.dataSet;

    // 列头对应的数值标题不应该格式化
    const isCustomValueFieldNode =
      extra?.isCustomNode && fields?.values?.includes(field);

    if (isCustomValueFieldNode) {
      return {
        formattedValue: value,
        value,
      };
    }

    return super.getFormattedFieldValue();
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    return width - this.getActionAndConditionIconWidth();
  }

  protected isBolderText() {
    // 非叶子节点、小计总计，均为粗体
    const { isLeaf, isTotals } = this.meta;

    if (isTotals || !isLeaf) {
      return true;
    }

    return false;
  }

  /**
   * 计算文本位置时候需要，留给后代根据情况（固定列）覆盖
   * @param viewport
   * @returns viewport
   */
  protected handleViewport(): AreaRange {
    /**
     *  p(x, y)
     *  +----------------------+            x
     *  |                    +--------------->
     *  | viewport           | |ColCell  |
     *  |                    |-|---------+
     *  +--------------------|-+
     *                       |
     *                     y |
     *                       v
     *
     * 将 viewport 坐标(p)映射到 col header 的坐标体系中，简化计算逻辑
     *
     */
    const { width, cornerWidth = 0, scrollX = 0 } = this.getHeaderConfig();

    const scrollContainsRowHeader = !this.spreadsheet.isFrozenRowHeader();

    const viewport: AreaRange = {
      start: scrollX - (scrollContainsRowHeader ? cornerWidth : 0),
      size: width + (scrollContainsRowHeader ? cornerWidth : 0),
    };

    return viewport;
  }

  protected getTextPosition(): PointLike {
    const { isLeaf } = this.meta;

    const textStyle = this.getTextStyle();
    const contentBox = this.getBBoxByType(CellClipBox.CONTENT_BOX);
    const iconStyle = this.getIconStyle()!;

    const textY = getVerticalTextPosition(contentBox, textStyle.textBaseline!);
    const iconY = getVerticalIconPosition(
      iconStyle.size!,
      textY,
      textStyle.fontSize!,
      textStyle.textBaseline!,
    );

    if (isLeaf) {
      const { textX, leftIconX, rightIconX } = getHorizontalTextIconPosition({
        bbox: contentBox,
        textWidth: this.getActualTextWidth(),
        textAlign: textStyle.textAlign!,
        groupedIcons: this.groupedIcons,
        iconStyle,
      });

      this.leftIconPosition = {
        x: leftIconX,
        y: iconY,
      };
      this.rightIconPosition = {
        x: rightIconX,
        y: iconY,
      };

      return { x: textX, y: textY };
    }

    const viewport = this.handleViewport();

    const { cell, icon } = this.getStyle()!;
    const { textAlign, textBaseline } = this.getTextStyle();

    const { textStart, iconStart, iconEnd } =
      adjustTextIconPositionWhileScrolling(
        viewport,
        { start: contentBox.x, size: contentBox.width },
        {
          align: normalizeTextAlign(textAlign!),
          size: {
            textSize: this.getActualTextWidth(),
            iconStartSize: this.getActionAndConditionIconWidth('left'),
            iconEndSize: this.getActionAndConditionIconWidth('right'),
          },
          padding: {
            start: cell?.padding?.left!,
            end: cell?.padding?.right!,
            betweenTextAndEndIcon: icon?.margin?.left!,
          },
        },
      );

    const y = getVerticalTextPosition(contentBox, textBaseline!);

    this.leftIconPosition = {
      x: iconStart,
      y: iconY,
    };
    this.rightIconPosition = {
      x: iconEnd,
      y: iconY,
    };

    return { x: textStart, y };
  }

  protected getColResizeArea(): Group | undefined {
    return getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_COL_RESIZE_AREA,
    );
  }

  protected getHorizontalResizeAreaName() {
    return `${HORIZONTAL_RESIZE_AREA_KEY_PRE}${this.meta.field}`;
  }

  /**
   * @description 叶子节点, 但层级不同于其他节点 (如下图 a-1-1), 说明是任意不规则自定义节点, 此时不需要绘制热区
   * --------------------------------------------------
   * |      自定义节点 a-1          |                   |
   * |-------------   |-----------|   自定义节点 a-1-1 |
   * | a-1-1  | a-1-2 |  a-1-3    |                  |
   * -------------------------------------------------
   */
  protected isCrossColumnLeafNode() {
    const { colsHierarchy } = this.spreadsheet.facet.getLayoutResult();
    const { level, isLeaf } = this.meta;

    return colsHierarchy?.sampleNodeForLastLevel?.level !== level && isLeaf;
  }

  protected drawHorizontalResizeArea() {
    // 隐藏列头时不绘制水平热区 https://github.com/antvis/S2/issues/1603
    const isHiddenCol = this.spreadsheet.options.style?.colCell?.height === 0;

    if (
      isHiddenCol ||
      !this.shouldDrawResizeAreaByType('colCellVertical', this)
    ) {
      return;
    }

    const { y, height } = this.meta;
    const resizeStyle = this.getResizeAreaStyle();
    const resizeArea = this.getColResizeArea();

    if (!resizeArea || this.isCrossColumnLeafNode()) {
      return;
    }

    const resizeAreaName = this.getHorizontalResizeAreaName();
    const existedHorizontalResizeArea = resizeArea?.find(
      (element) => element.name === resizeAreaName,
    );

    // 如果已经绘制当前列高调整热区热区，则不再绘制
    if (existedHorizontalResizeArea) {
      return;
    }

    const resizeAreaWidth = this.getResizeAreaWidth();

    // 列高调整热区
    const attrs = getResizeAreaAttrs({
      theme: resizeStyle,
      type: ResizeDirectionType.Vertical,
      effect: ResizeAreaEffect.Field,
      offsetX: 0,
      offsetY: y,
      width: resizeAreaWidth,
      height,
      meta: this.meta,
    });

    resizeArea.appendChild(
      new CustomRect(
        {
          name: resizeAreaName,
          style: {
            ...attrs.style,
            x: 0,
            y: y + height - resizeStyle.size!,
            width: resizeAreaWidth,
          },
        },
        attrs.appendInfo,
      ),
    );
  }

  private getResizeAreaWidth() {
    const { cornerWidth = 0, viewportWidth: headerWidth } =
      this.getHeaderConfig();

    return (
      Frame.getVerticalBorderWidth(this.spreadsheet) + cornerWidth + headerWidth
    );
  }

  protected shouldAddVerticalResizeArea() {
    const { x, y, width, height } = this.meta;
    const {
      scrollX,
      scrollY,
      cornerWidth = 0,
      height: headerHeight,
      width: headerWidth,
    } = this.getHeaderConfig();

    const scrollContainsRowHeader = !this.spreadsheet.isFrozenRowHeader();
    const resizeStyle = this.getResizeAreaStyle();

    const resizeAreaBBox: SimpleBBox = {
      x: x + width - resizeStyle.size!,
      y,
      width: resizeStyle.size!,
      height,
    };

    const resizeClipAreaBBox: SimpleBBox = {
      x: scrollContainsRowHeader ? -cornerWidth : 0,
      y: 0,
      width: scrollContainsRowHeader ? cornerWidth + headerWidth : headerWidth,
      height: headerHeight,
    };

    return shouldAddResizeArea(resizeAreaBBox, resizeClipAreaBBox, {
      scrollX,
      scrollY,
    });
  }

  protected getVerticalResizeAreaOffset() {
    const { x, y } = this.meta;
    const { scrollX = 0, position } = this.getHeaderConfig();

    return {
      x: position?.x + x - scrollX,
      y: position?.y + y,
    };
  }

  protected drawVerticalResizeArea() {
    if (
      !this.meta.isLeaf ||
      !this.shouldDrawResizeAreaByType('colCellHorizontal', this)
    ) {
      return;
    }

    const { width, height } = this.meta;
    const resizeStyle = this.getResizeAreaStyle();
    const resizeArea = this.getColResizeArea();

    if (!resizeArea || !this.shouldAddVerticalResizeArea()) {
      return;
    }

    const { x: offsetX, y: offsetY } = this.getVerticalResizeAreaOffset();

    /*
     * 列宽调整热区
     * 基准线是根据 container 坐标来的，因此把热区画在 container
     */
    const attrs = getResizeAreaAttrs({
      theme: resizeStyle,
      type: ResizeDirectionType.Horizontal,
      effect: ResizeAreaEffect.Cell,
      offsetX,
      offsetY,
      width,
      height,
      meta: this.meta,
    });

    resizeArea.appendChild(
      new CustomRect(
        {
          style: {
            ...attrs.style,
            x: offsetX + width - resizeStyle.size!,
            y: offsetY,
            height,
          },
        },
        attrs.appendInfo,
      ),
    );
  }

  // 绘制热区
  protected drawResizeArea() {
    this.drawHorizontalResizeArea();
    this.drawVerticalResizeArea();
  }

  protected hasHiddenColumnCell() {
    const { interaction, tooltip } = this.spreadsheet.options;

    const hiddenColumnsDetail = this.spreadsheet.store.get(
      'hiddenColumnsDetail',
      [],
    );

    if (
      isEmpty(hiddenColumnsDetail) ||
      isEmpty(interaction?.hiddenColumnFields) ||
      !tooltip?.operation?.hiddenColumns
    ) {
      return false;
    }

    return !!hiddenColumnsDetail.find((column) =>
      isEqualDisplaySiblingNodeId(column?.displaySiblingNode, this.meta.id),
    );
  }

  protected getExpandIconTheme(): IconTheme {
    const themeCfg = this.getStyle() as DefaultCellTheme;

    return themeCfg.icon!;
  }

  protected addExpandColumnSplitLine() {
    const { x, y, width, height } = this.getBBoxByType();
    const { horizontalBorderColor, horizontalBorderColorOpacity } =
      this.theme.splitLine!;
    const lineX = this.isLastColumn() ? x + width : x;

    renderLine(this, {
      x1: lineX,
      y1: y,
      x2: lineX,
      y2: y + height,
      stroke: horizontalBorderColor,
      lineWidth: SPLIT_LINE_WIDTH,
      strokeOpacity: horizontalBorderColorOpacity,
    });
  }

  protected addExpandColumnIconShapes() {
    if (!this.hasHiddenColumnCell()) {
      return;
    }

    this.addExpandColumnSplitLine();
    this.addExpandColumnIcons();
  }

  protected addExpandColumnIcons() {
    const isLastColumn = this.isLastColumn();

    this.addExpandColumnIcon(isLastColumn);

    // 如果当前节点的兄弟节点 (前/后) 都被隐藏了, 隐藏后当前节点变为最后一个节点, 需要渲染两个展开按钮, 一个展开[前], 一个展开[后]
    if (this.isAllDisplaySiblingNodeHidden() && isLastColumn) {
      this.addExpandColumnIcon(false);
    }
  }

  private addExpandColumnIcon(isLastColumn: boolean) {
    const iconConfig = this.getExpandColumnIconConfig(isLastColumn);
    const icon = renderIcon(this, {
      ...iconConfig,
      name: 'ExpandColIcon',
      cursor: 'pointer',
    });

    icon.addEventListener('click', () => {
      this.spreadsheet.emit(S2Event.COL_CELL_EXPANDED, this.meta);
    });
  }

  // 在隐藏的下一个兄弟节点的起始坐标显示隐藏提示线和展开按钮, 如果是尾元素, 则显示在前一个兄弟节点的结束坐标
  protected getExpandColumnIconConfig(isLastColumn: boolean) {
    const { size = 0 } = this.getExpandIconTheme();
    const { x, y, width, height } = this.getBBoxByType();

    const baseIconX = x - size;
    const iconX = isLastColumn ? baseIconX + width : baseIconX;
    const iconY = y + height / 2 - size / 2;

    return {
      x: iconX,
      y: iconY,
      width: size * 2,
      height: size,
    };
  }

  protected isLastColumn() {
    return isLastColumnAfterHidden(this.spreadsheet, this.meta.id);
  }

  protected isAllDisplaySiblingNodeHidden() {
    const { id } = this.meta;
    const lastHiddenColumnDetail = this.spreadsheet.store.get(
      'hiddenColumnsDetail',
      [],
    );

    const isPrevSiblingNodeHidden = lastHiddenColumnDetail.find(
      ({ displaySiblingNode }) => displaySiblingNode?.next?.id === id,
    );
    const isNextSiblingNodeHidden = lastHiddenColumnDetail.find(
      ({ displaySiblingNode }) => displaySiblingNode?.prev?.id === id,
    );

    return isNextSiblingNodeHidden && isPrevSiblingNodeHidden;
  }
}
