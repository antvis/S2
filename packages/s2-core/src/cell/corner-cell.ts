import type { PointLike } from '@antv/g';
import { cond, constant, isEmpty, last, matches, max, stubTrue } from 'lodash';
import {
  CellTypes,
  ELLIPSIS_SYMBOL,
  KEY_GROUP_CORNER_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
  S2Event,
} from '../common/constant';
import { CellBorderPosition, CellClipBox } from '../common/interface';
import type { FormatResult, TextTheme } from '../common/interface';
import { CornerNodeType } from '../common/interface/node';
import { getTextPosition, getVerticalPosition } from '../utils/cell/cell';
import { formattedFieldValue } from '../utils/cell/header-cell';
import { renderText, renderTreeIcon } from '../utils/g-renders';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
} from '../utils/interaction/resize';
import { isIPhoneX } from '../utils/is-mobile';
import { getEllipsisText, getEmptyPlaceholder } from '../utils/text';
import type { CornerHeaderConfig } from '../facet/header/interface';
import { CustomRect } from '../engine';
import { shouldAddResizeArea } from './../utils/interaction/resize';
import { HeaderCell } from './header-cell';

export class CornerCell extends HeaderCell {
  /* 角头类型 */
  public cornerType: CornerNodeType;

  protected declare headerConfig: CornerHeaderConfig;

  protected isBolderText() {
    const { cornerType } = this.meta;
    return cornerType === CornerNodeType.Col;
  }

  public get cellType() {
    return CellTypes.CORNER_CELL;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.TOP, CellBorderPosition.LEFT];
  }

  public update() {}

  protected initCell() {
    super.initCell();
    this.resetTextAndConditionIconShapes();
    this.drawBackgroundShape();
    this.drawTreeIcon();
    this.drawCellText();
    this.drawConditionIconShapes();
    this.drawActionIcons();
    this.drawBorders();
    this.drawResizeArea();
  }

  /**
   * @deprecated 已废弃, 请使用 drawTextShape
   */
  protected drawCellText() {
    this.drawTextShape();
  }

  protected drawTextShape() {
    const { x } = this.getBBoxByType(CellClipBox.CONTENT_BOX);
    const { y, height } = this.getBBoxByType(CellClipBox.PADDING_BOX);

    const textStyle = this.getTextStyle();
    const cornerText = this.getCornerText();

    // 当为树状结构下需要计算文本前收起展开的icon占的位置

    const maxWidth = this.getMaxTextWidth();
    const emptyPlaceholder = getEmptyPlaceholder(
      this.meta,
      this.spreadsheet.options.placeholder,
    );
    const { measureTextWidth } = this.spreadsheet;
    const text = getEllipsisText({
      measureTextWidth,
      text: cornerText,
      maxWidth,
      fontParam: textStyle,
      placeholder: emptyPlaceholder,
    });
    this.actualText = text;
    const ellipseIndex = text.indexOf(ELLIPSIS_SYMBOL);

    let firstLine = text;
    let secondLine = '';

    // 存在文字的省略号 & 展示为tree结构
    if (ellipseIndex !== -1 && this.spreadsheet.isHierarchyTreeType()) {
      // 剪裁到 ... 最有点的后1个像素位置
      const lastIndex = ellipseIndex + (isIPhoneX() ? 1 : 0);
      firstLine = cornerText.slice(0, lastIndex);
      secondLine = cornerText.slice(lastIndex);
      // 第二行重新计算...逻辑
      secondLine = getEllipsisText({
        measureTextWidth,
        text: secondLine,
        maxWidth,
        fontParam: textStyle,
      });
    }

    const { x: textX } = getTextPosition(
      {
        x: x + this.getTreeIconWidth(),
        y,
        width: maxWidth,
        height,
      },
      textStyle,
    );

    const textY = y + (isEmpty(secondLine) ? height / 2 : height / 4);
    // first line
    this.addTextShape(
      renderText(
        this,
        [this.textShapes[0]],
        textX,
        textY,
        firstLine,
        textStyle,
      ),
    );

    // second line
    if (!isEmpty(secondLine)) {
      this.addTextShape(
        renderText(
          this,
          [this.textShapes[1]],
          textX,
          y + height * 0.75,
          secondLine,
          textStyle,
        ),
      );
    }

    this.actualTextWidth = max([
      measureTextWidth(firstLine, textStyle),
      measureTextWidth(secondLine, textStyle),
    ])!;
  }

  /**
   * 绘制折叠展开的icon
   */
  protected drawTreeIcon() {
    if (!this.showTreeIcon() || this.meta.cornerType === CornerNodeType.Col) {
      return;
    }

    const { collapseAll } = this.spreadsheet.options.style?.rowCell!;
    const { size = 0 } = this.getStyle()!.icon!;
    const { textBaseline, fill } = this.getTextStyle();
    const area = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    this.treeIcon = renderTreeIcon({
      group: this,
      iconCfg: {
        x: area.x,
        y: getVerticalPosition(area, textBaseline!, size),
        width: size,
        height: size,
        fill,
      },
      isCollapsed: collapseAll,
      onClick: () => {
        this.spreadsheet.facet.resetScrollY();
        this.spreadsheet.emit(
          S2Event.ROW_CELL_ALL_COLLAPSED__PRIVATE,
          !collapseAll,
        );
      },
    });
  }

  protected isLastRowCornerCell() {
    const { cornerType, field } = this.meta;
    const { rows } = this.spreadsheet.dataSet.fields;
    return (
      cornerType === CornerNodeType.Row &&
      (this.spreadsheet.isHierarchyTreeType() || last(rows) === field)
    );
  }

  protected getResizeAreaEffect() {
    const { cornerType } = this.meta;

    if (cornerType === CornerNodeType.Series) {
      return ResizeAreaEffect.Series;
    }

    return this.isLastRowCornerCell() && this.spreadsheet.isHierarchyTreeType()
      ? ResizeAreaEffect.Tree
      : ResizeAreaEffect.Field;
  }

  protected drawResizeArea() {
    if (!this.shouldDrawResizeAreaByType('cornerCellHorizontal', this)) {
      return;
    }

    const resizeStyle = this.getResizeAreaStyle();

    const resizeArea = getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_CORNER_RESIZE_AREA,
    );

    if (!resizeArea) {
      return;
    }

    const {
      position,
      scrollX = 0,
      scrollY = 0,
      width: headerWidth,
      height: headerHeight,
    } = this.headerConfig;
    const { x, y, width, height } = this.getBBoxByType();
    const { cornerType } = this.meta;

    const resizeAreaBBox = {
      x: x + width - resizeStyle.size!,
      y,
      width: resizeStyle.size!,
      height,
    };

    const resizeClipAreaBBox = {
      x: 0,
      y: 0,
      width: headerWidth,
      height: headerHeight,
    };

    if (
      cornerType === CornerNodeType.Col ||
      !shouldAddResizeArea(resizeAreaBBox, resizeClipAreaBBox, {
        scrollX,
        scrollY,
      })
    ) {
      return;
    }
    // 将相对坐标映射到全局坐标系中
    // 最后一个维度需要撑满角头高度
    const offsetX = position.x + x - scrollX;
    const offsetY = position.y + (this.isLastRowCornerCell() ? 0 : y);

    const attrs = getResizeAreaAttrs({
      theme: resizeStyle,
      type: ResizeDirectionType.Horizontal,
      effect: this.getResizeAreaEffect(),
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
            x: offsetX + width - resizeStyle.size! / 2,
            y: offsetY,
            height: this.isLastRowCornerCell() ? headerHeight : height,
          },
        },
        attrs.appendInfo,
      ),
    );
  }

  protected showTreeIcon() {
    // 批量折叠或者展开的icon，只存在树状结构的第一个cell前
    return this.spreadsheet.isHierarchyTreeType() && this.meta?.x === 0;
  }

  protected getIconPosition(): PointLike {
    const textX = this.textShapes?.[0]?.getAttribute('x');
    const { textBaseline, textAlign } = this.getTextStyle();
    const { size, margin } = this.getStyle()!.icon!;

    const iconX =
      textX +
      cond([
        [matches('center'), constant(this.actualTextWidth / 2)],
        [matches('right'), constant(0)],
        [stubTrue, constant(this.actualTextWidth)],
      ])(textAlign) +
      margin?.left;

    const iconY = getVerticalPosition(
      this.getBBoxByType(CellClipBox.CONTENT_BOX),
      textBaseline!,
      size,
    );

    return { x: iconX, y: iconY };
  }

  protected getTreeIconWidth() {
    const { size, margin } = this.getStyle()!.icon!;
    return this.showTreeIcon() ? size! + margin!.right! : 0;
  }

  protected getTextStyle(): TextTheme {
    const { text, bolderText } = this.getStyle()!;
    const cornerTextStyle = this.isBolderText() ? text : bolderText;
    const fill = this.getTextConditionFill(cornerTextStyle!);

    return {
      ...cornerTextStyle,
      fill,
    };
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);
    return width - this.getTreeIconWidth() - this.getActionIconsWidth();
  }

  protected getTextPosition(): PointLike {
    return {
      x: 0,
      y: 0,
    };
  }

  // corner cell 不需要使用formatter进行格式化
  protected getFormattedFieldValue(): FormatResult {
    return formattedFieldValue(
      this.meta,
      this.spreadsheet.dataSet.getFieldName(this.meta.field),
    );
  }

  protected getCornerText(): string {
    const { formattedValue } = this.getFormattedFieldValue();
    return formattedValue;
  }
}
