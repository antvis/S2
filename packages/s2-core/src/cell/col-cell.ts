import { Point } from '@antv/g-canvas';
import { shouldAddResizeArea } from './../utils/interaction/resize';
import { HeaderCell } from './header-cell';
import {
  getResizeAreaAttrs,
  getOrCreateResizeAreaGroupById,
} from '@/utils/interaction/resize';
import {
  CellTypes,
  KEY_GROUP_COL_RESIZE_AREA,
  HORIZONTAL_RESIZE_AREA_KEY_PRE,
  ResizeDirectionType,
  ResizeAreaEffect,
} from '@/common/constant';
import {
  FormatResult,
  TextAlign,
  TextBaseline,
  TextTheme,
} from '@/common/interface';
import { ColHeaderConfig } from '@/facet/header/col';
import { getTextPosition } from '@/utils/cell/cell';
import { renderLine, renderRect } from '@/utils/g-renders';
import { AreaRange } from '@/common/interface/scroll';
import { getTextPositionWhenHorizontalScrolling } from '@/utils/cell/cell';

export class ColCell extends HeaderCell {
  protected headerConfig: ColHeaderConfig;

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
    // draw right border
    this.drawRightBorder();
    // draw resize ares
    this.drawResizeArea();
    this.update();
  }

  protected drawBackgroundShape() {
    const { backgroundColor, horizontalBorderColor } = this.getStyle().cell;
    this.backgroundShape = renderRect(this, {
      ...this.getCellArea(),
      fill: backgroundColor,
      stroke: horizontalBorderColor,
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

  protected getTextStyle(): TextTheme {
    const { isLeaf, isTotals } = this.meta;
    const { text, bolderText } = this.getStyle();
    const textStyle = isLeaf && !isTotals ? text : bolderText;

    let textAlign: TextAlign;
    let textBaseline: TextBaseline;

    if (isLeaf) {
      // 最后一个层级的维值，与 dataCell 对齐方式保持一致
      textAlign = this.theme.dataCell.text.textAlign;
      textBaseline = this.theme.dataCell.text.textBaseline;
    } else {
      textAlign = 'center';
      textBaseline = 'middle';
    }
    return { ...textStyle, textAlign, textBaseline };
  }

  protected getFormattedFieldValue(): FormatResult {
    const { label, key } = this.meta;
    // 格式化枚举值
    const f = this.headerConfig.formatter(key);
    const content = f(label);
    return {
      formattedValue: content,
      value: label,
    };
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getContentArea();
    return width - this.getActionIconsWidth();
  }

  protected getTextPosition(): Point {
    const { isLeaf } = this.meta;
    const { width, scrollContainsRowHeader, cornerWidth, scrollX } =
      this.headerConfig;

    const textStyle = this.getTextStyle();
    const contentBox = this.getContentArea();

    const textBox = {
      ...contentBox,
      width: contentBox.width - this.getActionIconsWidth(),
    };
    if (isLeaf) {
      return getTextPosition(textBox, textStyle);
    }

    // 将viewport坐标映射到 col header的坐标体系中，简化计算逻辑
    const viewport: AreaRange = {
      start: scrollX - (scrollContainsRowHeader ? cornerWidth : 0),
      width: width + (scrollContainsRowHeader ? cornerWidth : 0),
    };

    const textX = getTextPositionWhenHorizontalScrolling(
      viewport,
      { start: contentBox.x, width: contentBox.width },
      this.actualTextWidth,
    );

    const textY = contentBox.y + contentBox.height / 2;
    return { x: textX, y: textY };
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
    const { cornerWidth, width: headerWidth } = this.headerConfig;
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

  protected drawVerticalResizeArea() {
    if (!this.meta.isLeaf) {
      return;
    }

    const { x, y, label, width, height, parent } = this.meta;
    const {
      scrollX,
      scrollY,
      position,
      scrollContainsRowHeader,
      cornerWidth,
      height: headerHeight,
      width: headerWidth,
    } = this.headerConfig;

    const resizeStyle = this.getResizeAreaStyle();
    const resizeArea = this.getColResizeArea();

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

    if (
      !shouldAddResizeArea(resizeAreaBBox, resizeClipAreaBBox, {
        scrollX,
        scrollY,
      })
    ) {
      return;
    }

    const offsetX = position.x + x - scrollX;
    const offsetY = position.y + y;

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

  private drawRightBorder() {
    if (!this.meta.isLeaf) {
      const { height, viewportHeight } = this.headerConfig;
      const { x, y, width: cellWidth, height: cellHeight } = this.meta;

      renderLine(
        this,
        {
          x1: x + cellWidth,
          y1: y + cellHeight,
          x2: x + cellWidth,
          y2: y + height + viewportHeight,
        },
        {
          stroke: this.theme.colCell.cell.horizontalBorderColor,
          lineWidth: 1,
        },
      );
    }
  }
}
