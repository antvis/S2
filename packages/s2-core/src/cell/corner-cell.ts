import type { PointLike } from '@antv/g';
import { isEmpty, last, max } from 'lodash';
import {
  CellType,
  ELLIPSIS_SYMBOL,
  KEY_GROUP_CORNER_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
  S2Event,
} from '../common/constant';
import { CellBorderPosition, CellClipBox } from '../common/interface';
import type { FormatResult, TextTheme } from '../common/interface';
import { CornerNodeType } from '../common/interface/node';
import {
  getHorizontalTextIconPosition,
  getVerticalIconPosition,
} from '../utils/cell/cell';
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
    return CellType.CORNER_CELL;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.TOP, CellBorderPosition.LEFT];
  }

  public update() {}

  protected initCell() {
    super.initCell();
    this.resetTextAndConditionIconShapes();
    this.drawBackgroundShape();
    this.drawTextShape();
    this.drawTreeIcon();
    this.drawActionAndConditionIcons();
    this.drawBorders();
    this.drawResizeArea();
  }

  protected drawTextShape() {
    const { x, y, height, width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    const textStyle = this.getTextStyle();
    const cornerText = this.getCornerText();

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

    let firstLine: string = text;
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

    this.actualTextWidth = max([
      measureTextWidth(firstLine, textStyle),
      measureTextWidth(secondLine, textStyle),
    ])!;

    const { textX, leftIconX, rightIconX } = getHorizontalTextIconPosition({
      bbox: {
        x: x + this.getTreeIconWidth(),
        y,
        width: width - this.getTreeIconWidth(),
        height,
      },
      textAlign: textStyle.textAlign!,
      textWidth: this.actualTextWidth,
      groupedIcons: this.groupedIcons,
      iconStyle: this.getIconStyle()!,
    });

    const textY = y + (isEmpty(secondLine) ? height / 2 : height / 4);

    // first line
    this.addTextShape(
      renderText(this, [this.textShapes[0]], {
        x: textX,
        y: textY,
        text: firstLine,
        ...textStyle,
      }),
    );

    // second line
    if (!isEmpty(secondLine)) {
      this.addTextShape(
        renderText(this, [this.textShapes[1]], {
          x: textX,
          y: y + height * 0.75,
          text: secondLine,
          ...textStyle,
        }),
      );
    }

    const { size = 0 } = this.getStyle()!.icon!;
    const iconY = getVerticalIconPosition(
      size,
      y + height / 2,
      size,
      textStyle.textBaseline!,
    );

    this.leftIconPosition = {
      x: leftIconX,
      y: iconY,
    };
    this.rightIconPosition = {
      x: rightIconX,
      y: iconY,
    };
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
    const { fill } = this.getTextStyle();
    const area = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    this.treeIcon = renderTreeIcon({
      group: this,
      iconCfg: {
        x: area.x,
        y: this.getIconPosition().y,
        width: size,
        height: size,
        fill,
      },
      isCollapsed: collapseAll,
      onClick: () => {
        this.spreadsheet.facet.resetScrollY();
        this.spreadsheet.emit(
          S2Event.ROW_CELL_ALL_COLLAPSED__PRIVATE,
          collapseAll!,
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

    /*
     * 将相对坐标映射到全局坐标系中
     * 最后一个维度需要撑满角头高度
     */
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

  protected getTreeIconWidth() {
    const { size, margin } = this.getStyle()!.icon!;

    return this.showTreeIcon() ? size! + margin!.right! : 0;
  }

  protected getTextStyle(): TextTheme {
    const { text, bolderText } = this.getStyle()!;
    const cornerTextStyle = this.isBolderText() ? text : bolderText;

    const textStyle =
      this.getContainConditionMappingResultTextStyle(cornerTextStyle);

    return {
      ...textStyle,
      // 角头因为要折行，所以在都是按照middle来计算，这里写死，不然用户配置了baseline，会导致计算错误
      textBaseline: 'middle',
    };
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    return (
      width - this.getTreeIconWidth() - this.getActionAndConditionIconWidth()
    );
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
