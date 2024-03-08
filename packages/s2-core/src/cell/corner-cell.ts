import type { PointLike } from '@antv/g';
import { last } from 'lodash';
import {
  CellType,
  KEY_GROUP_CORNER_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
  S2Event,
} from '../common/constant';
import type { FormatResult } from '../common/interface';
import { CellBorderPosition, CellClipBox } from '../common/interface';
import { CornerNodeType } from '../common/interface/node';
import { CustomRect } from '../engine';
import type { CornerHeaderConfig } from '../facet/header/interface';
import {
  getHorizontalTextIconPosition,
  getVerticalIconPosition,
  getVerticalTextPosition,
} from '../utils/cell/cell';
import { formattedFieldValue } from '../utils/cell/header-cell';
import { renderTreeIcon } from '../utils/g-renders';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
} from '../utils/interaction/resize';
import { shouldAddResizeArea } from './../utils/interaction/resize';
import { HeaderCell } from './header-cell';

export class CornerCell extends HeaderCell<CornerHeaderConfig> {
  public get cellType() {
    return CellType.CORNER_CELL;
  }

  protected isBolderText() {
    const { cornerType } = this.meta;

    return cornerType === CornerNodeType.Col;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.TOP, CellBorderPosition.LEFT];
  }

  protected initCell() {
    super.initCell();
    this.resetTextAndConditionIconShapes();
    this.drawBackgroundShape();
    this.drawTextShape();
    this.drawTreeIcon();
    this.drawActionAndConditionIcons();
    this.drawBorders();
    this.drawResizeArea();
    this.update();
  }

  /**
   * 绘制折叠展开的 icon
   */
  protected drawTreeIcon() {
    if (!this.showTreeIcon()) {
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
    } = this.getHeaderConfig();
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
            x: offsetX + width - resizeStyle.size!,
            y: offsetY,
            height: this.isLastRowCornerCell() ? headerHeight : height,
          },
        },
        attrs.appendInfo,
      ),
    );
  }

  protected showTreeIcon() {
    // 批量折叠或者展开的 icon，渲染在行头对应的角头中
    return (
      this.spreadsheet.isHierarchyTreeType() &&
      this.meta.cornerType === CornerNodeType.Row
    );
  }

  protected getTreeIconWidth() {
    const { size, margin } = this.getStyle()!.icon!;

    return this.showTreeIcon() ? size! + margin!.right! : 0;
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    return (
      width - this.getTreeIconWidth() - this.getActionAndConditionIconWidth()
    );
  }

  protected getTextPosition(): PointLike {
    const contentBox = this.getBBoxByType(CellClipBox.CONTENT_BOX);
    const { x, y, height, width } = contentBox;

    const textStyle = this.getTextStyle();

    const { textX, leftIconX, rightIconX } = getHorizontalTextIconPosition({
      bbox: {
        x: x + this.getTreeIconWidth(),
        y,
        width: width - this.getTreeIconWidth(),
        height,
      },
      textAlign: textStyle.textAlign!,
      textWidth: this.getActualTextWidth(),
      groupedIcons: this.groupedIcons,
      iconStyle: this.getIconStyle()!,
    });

    const textY = getVerticalTextPosition(contentBox, textStyle.textBaseline!);

    const { size = 0 } = this.getStyle()!.icon!;
    const iconY = getVerticalIconPosition(
      size,
      textY,
      textStyle.fontSize!,
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

    return {
      x: textX,
      y: textY,
    };
  }

  // CornerCell 不需要使用 formatter 进行格式化
  protected getFormattedFieldValue(): FormatResult {
    return formattedFieldValue(
      this.meta,
      this.spreadsheet.dataSet.getFieldName(this.meta.field),
    );
  }
}
