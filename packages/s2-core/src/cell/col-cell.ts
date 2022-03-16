import { Point, SimpleBBox } from '@antv/g-canvas';
import { isEmpty } from 'lodash';
import { isEqualDisplaySiblingNodeId } from './../utils/hide-columns';
import { HeaderCell } from './header-cell';
import { shouldAddResizeArea } from '@/utils/interaction/resize';
import {
  CellTypes,
  HORIZONTAL_RESIZE_AREA_KEY_PRE,
  KEY_GROUP_COL_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
  S2Event,
} from '@/common/constant';
import {
  CellBorderPosition,
  DefaultCellTheme,
  IconTheme,
  TextAlign,
  TextBaseline,
  TextTheme,
} from '@/common/interface';
import { AreaRange } from '@/common/interface/scroll';
import { ColHeaderConfig } from '@/facet/header/col';
import {
  getBorderPositionAndStyle,
  getTextAndFollowingIconPosition,
  getTextAreaRange,
  adjustColHeaderScrollingViewport,
  adjustColHeaderScrollingTextPostion,
} from '@/utils/cell/cell';
import { renderIcon, renderLine, renderRect } from '@/utils/g-renders';
import { isLastColumnAfterHidden } from '@/utils/hide-columns';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
} from '@/utils/interaction/resize';

export class ColCell extends HeaderCell {
  protected headerConfig: ColHeaderConfig;

  /** 文字区域（含icon）绘制起始坐标 */
  protected textAreaPosition: Point;

  public get cellType() {
    return CellTypes.COL_CELL;
  }

  protected initCell() {
    super.initCell();
    // 1、draw rect background
    this.drawBackgroundShape();
    // interactive background shape
    this.drawInteractiveBgShape();
    // draw text
    this.drawTextShape();
    // draw action icons
    this.drawActionIcons();
    // draw borders
    this.drawBorders();
    // draw resize ares
    this.drawResizeArea();
    this.addExpandColumnIconShapes();
    this.update();
  }

  protected drawBackgroundShape() {
    const { backgroundColor } = this.getStyle().cell;
    this.backgroundShape = renderRect(this, {
      ...this.getCellArea(),
      fill: backgroundColor,
    });
  }

  // 交互使用的背景色
  protected drawInteractiveBgShape() {
    this.stateShapes.set(
      'interactiveBgShape',
      renderRect(this, {
        ...this.getCellArea(),
        fill: 'transparent',
        stroke: 'transparent',
      }),
    );
  }

  private getOriginalTextStyle(): TextTheme {
    const { isLeaf, isTotals } = this.meta;
    const { text, bolderText } = this.getStyle();
    return isLeaf && !isTotals ? text : bolderText;
  }

  protected getTextStyle(): TextTheme {
    const { isLeaf } = this.meta;
    const textStyle = this.getOriginalTextStyle();
    const hideMeasureColumn =
      this.spreadsheet.options.style.colCfg.hideMeasureColumn;
    let textAlign: TextAlign;
    let textBaseline: TextBaseline;
    if (isLeaf && !hideMeasureColumn) {
      textAlign = this.theme.dataCell.text.textAlign;
      textBaseline = this.theme.dataCell.text.textBaseline;
    } else {
      // 为方便 getTextAreaRange 计算文字位置
      // textAlign 固定为 center
      textAlign = 'center';
      textBaseline = 'middle';
    }
    return { ...textStyle, textAlign, textBaseline };
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getContentArea();
    return width - this.getActionIconsWidth();
  }

  protected getIconPosition(): Point {
    const { isLeaf } = this.meta;
    const iconStyle = this.getIconStyle();
    if (isLeaf) {
      return super.getIconPosition(this.getActionIconsCount());
    }
    const position = this.textAreaPosition;

    const totalSpace =
      this.actualTextWidth +
      this.getActionIconsWidth() -
      iconStyle.margin.right;
    const startX = position.x - totalSpace / 2;
    return {
      x: startX + this.actualTextWidth + iconStyle.margin.left,
      y: position.y - iconStyle.size / 2,
    };
  }

  protected getTextPosition(): Point {
    const { isLeaf } = this.meta;
    const { width, scrollContainsRowHeader, cornerWidth, scrollX } =
      this.headerConfig;

    const textStyle = this.getTextStyle();
    const contentBox = this.getContentArea();
    const iconStyle = this.getIconStyle();

    if (isLeaf) {
      return getTextAndFollowingIconPosition(
        contentBox,
        textStyle,
        this.actualTextWidth,
        iconStyle,
        this.getActionIconsCount(),
      ).text;
    }

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
    const viewport: AreaRange = {
      start: scrollX - (scrollContainsRowHeader ? cornerWidth : 0),
      width: width + (scrollContainsRowHeader ? cornerWidth : 0),
    };

    const { textAlign } = this.getOriginalTextStyle();
    const adjustedViewport = adjustColHeaderScrollingViewport(
      viewport,
      textAlign,
      this.getStyle().cell?.padding,
    );

    const iconCount = this.getActionIconsCount();
    const textAndIconSpace =
      this.actualTextWidth +
      this.getActionIconsWidth() -
      (iconCount ? iconStyle.margin.right : 0);

    const textAreaRange = getTextAreaRange(
      adjustedViewport,
      { start: contentBox.x, width: contentBox.width },
      textAndIconSpace, // icon position 默认为 right
    );

    // textAreaRange.start 是以文字样式为 center 计算出的文字绘制点
    // 此处按实际样式(left or right)调整
    const startX = adjustColHeaderScrollingTextPostion(
      textAreaRange.start,
      textAreaRange.width - textAndIconSpace,
      textAlign,
    );

    const textY = contentBox.y + contentBox.height / 2;
    this.textAreaPosition = { x: startX, y: textY };
    return {
      x: startX - textAndIconSpace / 2 + this.actualTextWidth / 2,
      y: textY,
    };
  }

  protected getActionIconsWidth() {
    const { size, margin } = this.getStyle().icon;
    const iconCount = this.getActionIconsCount();
    return (size + margin.left) * iconCount + iconCount > 0 ? margin.right : 0;
  }

  protected getColResizeAreaKey() {
    return this.meta.key;
  }

  protected getColResizeArea() {
    return getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_COL_RESIZE_AREA,
    );
  }

  protected getHorizontalResizeAreaName() {
    return `${HORIZONTAL_RESIZE_AREA_KEY_PRE}${this.meta.key}`;
  }

  protected drawHorizontalResizeArea() {
    if (!this.shouldDrawResizeAreaByType('colCellVertical')) {
      return;
    }

    const { cornerWidth, viewportWidth: headerWidth } = this.headerConfig;
    const { y, height } = this.meta;
    const resizeStyle = this.getResizeAreaStyle();
    const resizeArea = this.getColResizeArea();

    const resizeAreaName = this.getHorizontalResizeAreaName();

    const existedHorizontalResizeArea = resizeArea.find(
      (element) => element.attrs.name === resizeAreaName,
    );

    // 如果已经绘制当前列高调整热区热区，则不再绘制
    if (existedHorizontalResizeArea) {
      return;
    }

    const resizeAreaWidth = cornerWidth + headerWidth;
    // 列高调整热区
    resizeArea.addShape('rect', {
      attrs: {
        ...getResizeAreaAttrs({
          theme: resizeStyle,
          type: ResizeDirectionType.Vertical,
          id: this.getColResizeAreaKey(),
          effect: ResizeAreaEffect.Field,
          offsetX: 0,
          offsetY: y,
          width: resizeAreaWidth,
          height: height,
        }),
        name: resizeAreaName,
        x: 0,
        y: y + height - resizeStyle.size / 2,
        width: resizeAreaWidth,
      },
    });
  }

  protected shouldAddVerticalResizeArea() {
    const { x, y, width, height } = this.meta;
    const {
      scrollX,
      scrollY,
      scrollContainsRowHeader,
      cornerWidth,
      height: headerHeight,
      width: headerWidth,
    } = this.headerConfig;

    const resizeStyle = this.getResizeAreaStyle();

    const resizeAreaBBox = {
      x: x + width - resizeStyle.size / 2,
      y,
      width: resizeStyle.size,
      height,
    };

    const resizeClipAreaBBox = {
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
    const { scrollX, position } = this.headerConfig;
    return {
      x: position.x + x - scrollX,
      y: position.y + y,
    };
  }

  protected drawVerticalResizeArea() {
    if (
      !this.meta.isLeaf ||
      !this.shouldDrawResizeAreaByType('colCellHorizontal')
    ) {
      return;
    }

    const { label, width, height, parent } = this.meta;

    const resizeStyle = this.getResizeAreaStyle();
    const resizeArea = this.getColResizeArea();

    if (!this.shouldAddVerticalResizeArea()) {
      return;
    }

    const { x: offsetX, y: offsetY } = this.getVerticalResizeAreaOffset();

    // 列宽调整热区
    // 基准线是根据container坐标来的，因此把热区画在container
    resizeArea.addShape('rect', {
      attrs: {
        ...getResizeAreaAttrs({
          theme: resizeStyle,
          type: ResizeDirectionType.Horizontal,
          effect: ResizeAreaEffect.Cell,
          id: parent.isTotals ? '' : label,
          offsetX,
          offsetY,
          width,
          height,
        }),
        x: offsetX + width - resizeStyle.size / 2,
        y: offsetY,
        height,
      },
    });
  }

  // 绘制热区
  private drawResizeArea() {
    this.drawHorizontalResizeArea();
    this.drawVerticalResizeArea();
  }

  protected drawHorizontalBorder() {
    const { position, style } = getBorderPositionAndStyle(
      CellBorderPosition.TOP,
      this.meta as SimpleBBox,
      this.theme.colCell.cell,
    );

    renderLine(this, position, style);
  }

  protected drawVerticalBorder() {
    const { position, style } = getBorderPositionAndStyle(
      CellBorderPosition.RIGHT,
      this.meta as SimpleBBox,
      this.theme.colCell.cell,
    );
    renderLine(this, position, style);
  }

  protected drawBorders() {
    this.drawHorizontalBorder();
    this.drawVerticalBorder();
  }

  protected hasHiddenColumnCell() {
    const {
      interaction: { hiddenColumnFields = [] },
      tooltip: { operation },
    } = this.spreadsheet.options;

    const hiddenColumnsDetail = this.spreadsheet.store.get(
      'hiddenColumnsDetail',
      [],
    );

    if (
      isEmpty(hiddenColumnsDetail) ||
      isEmpty(hiddenColumnFields) ||
      !operation.hiddenColumns
    ) {
      return false;
    }
    return !!hiddenColumnsDetail.find((column) =>
      isEqualDisplaySiblingNodeId(column?.displaySiblingNode, this.meta.id),
    );
  }

  private getExpandIconTheme(): IconTheme {
    const themeCfg = this.getStyle() as DefaultCellTheme;
    return themeCfg.icon;
  }

  private addExpandColumnSplitLine() {
    const { x, y, width, height } = this.meta;
    const {
      horizontalBorderColor,
      horizontalBorderWidth,
      horizontalBorderColorOpacity,
    } = this.theme.splitLine;
    const lineX = this.isLastColumn() ? x + width - horizontalBorderWidth : x;

    renderLine(
      this,
      {
        x1: lineX,
        y1: y,
        x2: lineX,
        y2: y + height,
      },
      {
        stroke: horizontalBorderColor,
        lineWidth: horizontalBorderWidth,
        strokeOpacity: horizontalBorderColorOpacity,
      },
    );
  }

  private addExpandColumnIconShapes() {
    if (!this.hasHiddenColumnCell()) {
      return;
    }
    this.addExpandColumnSplitLine();
    this.addExpandColumnIcon();
  }

  private addExpandColumnIcon() {
    const iconConfig = this.getExpandColumnIconConfig();
    const icon = renderIcon(this, {
      ...iconConfig,
      name: 'ExpandColIcon',
      cursor: 'pointer',
    });
    icon.on('click', () => {
      this.spreadsheet.emit(S2Event.LAYOUT_COLS_EXPANDED, this.meta);
    });
  }

  // 在隐藏的下一个兄弟节点的起始坐标显示隐藏提示线和展开按钮, 如果是尾元素, 则显示在前一个兄弟节点的结束坐标
  private getExpandColumnIconConfig() {
    const { size } = this.getExpandIconTheme();
    const { x, y, width, height } = this.getCellArea();

    const baseIconX = x - size;
    const iconX = this.isLastColumn() ? baseIconX + width : baseIconX;
    const iconY = y + height / 2 - size / 2;

    return {
      x: iconX,
      y: iconY,
      width: size * 2,
      height: size,
    };
  }

  private isLastColumn() {
    return isLastColumnAfterHidden(this.spreadsheet, this.meta.id);
  }
}
