import { Group, Point } from '@antv/g-canvas';
import { get, isEqual } from 'lodash';
import { HeaderCell } from './header-cell';
import {
  CellTypes,
  KEY_GROUP_COL_RESIZE_AREA,
  HORIZONTAL_RESIZE_AREA_KEY_PRE,
} from '@/common/constant';
import { GuiIcon } from '@/common/icons';
import {
  FormatResult,
  TextAlign,
  TextBaseline,
  TextTheme,
} from '@/common/interface';
import { ColHeaderConfig } from '@/facet/header/col';
import { ResizeInfo } from '@/facet/header/interface';
import { getTextPosition } from '@/utils/cell/cell';
import { renderLine, renderRect } from '@/utils/g-renders';
import { AreaRange } from '@/common/interface/scroll';
import {
  getTextPositionWhenHorizontalScrolling,
  getVerticalPosition,
} from '@/utils/cell/cell';

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
    const { offset, width, scrollContainsRowHeader, cornerWidth } =
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
      start: offset - (scrollContainsRowHeader ? cornerWidth : 0),
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

  private showSortIcon() {
    const { sortParam } = this.headerConfig;
    const query = this.meta.query;
    return (
      isEqual(get(sortParam, 'query'), query) &&
      get(sortParam, 'type') !== 'none'
    );
  }

  private getActionIconsWidth() {
    const { icon } = this.getStyle();
    return this.showSortIcon() ? icon.size + icon.margin.left : 0;
  }

  protected getActionIconPosition(): Point {
    const { textBaseline } = this.getTextStyle();
    const { size } = this.getStyle().icon;
    const { x, width } = this.getContentArea();

    const iconX = x + width - size;
    const iconY = getVerticalPosition(
      this.getContentArea(),
      textBaseline,
      size,
    );

    return { x: iconX, y: iconY };
  }

  // 绘制排序icon
  protected drawActionIcons() {
    const { icon } = this.getStyle();
    if (this.showSortIcon()) {
      const { sortParam } = this.headerConfig;
      const position = this.getActionIconPosition();
      const sortIcon = new GuiIcon({
        name: get(sortParam, 'type', 'none'),
        ...position,
        width: icon.size,
        height: icon.size,
      });
      // TODO：和row-cell统一icon之后需更改
      sortIcon.on('click', (event) => {
        this.handleGroupSort(event, this.meta);
      });
      this.add(sortIcon);
      this.actionIcons.push(sortIcon);
    }
  }

  protected getColResizeAreaKey() {
    return this.meta.key;
  }

  protected getColResizeAreaOffset() {
    const { offset, position } = this.headerConfig;
    const { x, y } = this.meta;

    return {
      x: position.x - offset + x,
      y: position.y + y,
    };
  }

  protected getColResizeArea() {
    const prevResizeArea = this.spreadsheet.foregroundGroup.findById(
      KEY_GROUP_COL_RESIZE_AREA,
    );
    return (prevResizeArea ||
      this.spreadsheet.foregroundGroup.addGroup({
        id: KEY_GROUP_COL_RESIZE_AREA,
      })) as Group;
  }

  // 绘制热区
  private drawResizeArea() {
    const { position, viewportWidth } = this.headerConfig;
    const {
      label,
      y,
      width: cellWidth,
      height: cellHeight,
      parent,
    } = this.meta;
    const resizeStyle = this.getStyle('resizeArea');
    const resizeArea = this.getColResizeArea();
    const prevHorizontalResizeArea = resizeArea.find((element) => {
      return (
        element.attrs.name ===
        `${HORIZONTAL_RESIZE_AREA_KEY_PRE}${this.meta.key}`
      );
    });
    // 如果已经绘制当前列高调整热区热区，则不再绘制
    if (!prevHorizontalResizeArea) {
      // 列高调整热区
      resizeArea.addShape('rect', {
        attrs: {
          name: `${HORIZONTAL_RESIZE_AREA_KEY_PRE}${this.meta.key}`,
          x: position.x,
          y: position.y + y + cellHeight - resizeStyle.size / 2,
          width: viewportWidth,
          height: resizeStyle.size,
          fill: resizeStyle.background,
          fillOpacity: resizeStyle.backgroundOpacity,
          cursor: 'row-resize',
          appendInfo: {
            isResizeArea: true,
            class: 'resize-trigger',
            type: 'row',
            id: this.getColResizeAreaKey(),
            affect: 'field',
            offsetX: position.x,
            offsetY: position.y + y,
            width: viewportWidth,
            height: cellHeight,
          } as ResizeInfo,
        },
      });
    }
    if (this.meta.isLeaf) {
      const resizerOffset = this.getColResizeAreaOffset();
      // 列宽调整热区
      // 基准线是根据container坐标来的，因此把热区画在container
      resizeArea.addShape('rect', {
        attrs: {
          x: resizerOffset.x + cellWidth - resizeStyle.size / 2,
          y: resizerOffset.y,
          width: resizeStyle.size,
          height: cellHeight,
          fill: resizeStyle.background,
          fillOpacity: resizeStyle.backgroundOpacity,
          cursor: 'col-resize',
          appendInfo: {
            isResizeArea: true,
            class: 'resize-trigger',
            type: 'col',
            affect: 'cell',
            caption: parent.isTotals ? '' : label,
            offsetX: resizerOffset.x,
            offsetY: resizerOffset.y,
            width: cellWidth,
            height: cellHeight,
          } as ResizeInfo,
        },
      });
    }
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
