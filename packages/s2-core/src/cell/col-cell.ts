import { Point } from '@antv/g-canvas';
import { HeaderCell } from './header-cell';
import { CellTypes } from '@/common/constant';
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
    // this.drawResizeArea();
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
