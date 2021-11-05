import { Point } from '@antv/g-canvas';
import { GM } from '@antv/g-gesture';
import { HeaderCell } from './header-cell';
import {
  CellTypes,
  KEY_GROUP_ROW_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeAreaType,
  S2Event,
} from '@/common/constant';
import { FormatResult, TextTheme } from '@/common/interface';
import { RowHeaderConfig } from '@/facet/header/row';
import { getTextPosition } from '@/utils/cell/cell';
import { renderLine, renderRect, renderTreeIcon } from '@/utils/g-renders';
import { getAllChildrenNodeHeight } from '@/utils/get-all-children-node-height';
import { getAdjustPosition } from '@/utils/text-absorption';
import {
  getResizeAreaAttrs,
  getOrCreateResizeAreaGroupById,
} from '@/utils/interaction/resize';

export class RowCell extends HeaderCell {
  protected headerConfig: RowHeaderConfig;

  private gm: GM;

  public get cellType() {
    return CellTypes.ROW_CELL;
  }

  public destroy(): void {
    super.destroy();
    this.gm?.destroy();
  }

  protected initCell() {
    super.initCell();
    // 1、draw rect background
    this.drawBackgroundShape();
    this.drawInteractiveBgShape();

    // draw icon
    this.drawTreeIcon();
    // draw text
    this.drawTextShape();

    // draw bottom border
    this.drawRectBorder();
    // draw hot-spot rect
    this.drawResizeAreaInLeaf();
    // draw action icon shapes: trend icon, drill-down icon ...
    this.drawActionIcons();
    this.update();
  }

  protected drawBackgroundShape() {
    const { backgroundColor, backgroundColorOpacity } = this.getStyle().cell;

    this.backgroundShape = renderRect(this, {
      ...this.getCellArea(),
      fill: backgroundColor,
      stroke: 'transparent',
      opacity: backgroundColorOpacity,
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

  private showTreeIcon() {
    return this.spreadsheet.isHierarchyTreeType() && !this.meta.isLeaf;
  }

  // draw tree icon
  protected drawTreeIcon() {
    if (!this.showTreeIcon()) {
      return;
    }

    const { isCollapsed, id, hierarchy } = this.meta;
    const { x } = this.getContentArea();
    const { fill } = this.getTextStyle();
    const { size } = this.getStyle().icon;

    const contentIndent = this.getContentIndent();

    const iconX = x + contentIndent;
    const iconY = this.getIconYPosition();

    this.treeIcon = renderTreeIcon(
      this,
      {
        x: iconX,
        y: iconY,
        width: size,
        height: size,
      },
      fill,
      isCollapsed,
      () => {
        // 折叠行头时因scrollY没变，导致底层出现空白
        if (!isCollapsed) {
          const oldScrollY = this.spreadsheet.store.get('scrollY');
          // 可视窗口高度
          const viewportHeight = this.spreadsheet.facet.panelBBox.height || 0;
          // 被折叠项的高度
          const deleteHeight = getAllChildrenNodeHeight(this.meta);
          // 折叠后真实高度
          const realHeight = hierarchy.height - deleteHeight;
          if (oldScrollY > 0 && oldScrollY + viewportHeight > realHeight) {
            const currentScrollY = realHeight - viewportHeight;
            this.spreadsheet.store.set(
              'scrollY',
              currentScrollY > 0 ? currentScrollY : 0,
            );
          }
        }
        this.spreadsheet.emit(S2Event.ROW_CELL_COLLAPSE_TREE_ROWS, {
          id,
          isCollapsed: !isCollapsed,
          node: this.meta,
        });
      },
    );

    // in mobile, we use this cell
    this.gm = new GM(this, {
      gestures: ['Tap'],
    });
    this.gm.on('tap', () => {
      this.spreadsheet.emit(S2Event.ROW_CELL_COLLAPSE_TREE_ROWS, {
        id,
        isCollapsed: !isCollapsed,
        node: this.meta,
      });
    });
  }

  protected getFormattedValue(value: string): string {
    let content = value;
    const formatter = this.spreadsheet.dataSet.getFieldFormatter(
      this.meta.field,
    );
    if (formatter) {
      content = formatter(value);
    }
    return content;
  }

  // draw text
  protected drawTextShape() {
    super.drawTextShape();
    this.drawLinkFieldShape();
  }

  protected drawLinkFieldShape() {
    const { linkFields = [] } = this.headerConfig;
    const { linkTextFill } = this.getTextStyle();

    super.drawLinkFieldShape(linkFields.includes(this.meta.key), linkTextFill);
  }

  protected drawRectBorder() {
    const { position, width, viewportWidth, scrollX } = this.headerConfig;
    const {
      horizontalBorderColor,
      horizontalBorderWidth,
      horizontalBorderOpacity,
      verticalBorderColor,
      verticalBorderWidth,
      verticalBorderColorOpacity,
    } = this.getStyle().cell;
    const { x, y, height, width: cellWidth } = this.getCellArea();
    // horizontal border
    const contentIndent = this.getContentIndent();
    renderLine(
      this,
      {
        x1: x + contentIndent,
        y1: y + height,
        x2: position.x + width + viewportWidth + scrollX,
        y2: y + height,
      },
      {
        stroke: horizontalBorderColor,
        lineWidth: horizontalBorderWidth,
        opacity: horizontalBorderOpacity,
      },
    );

    // vertical border
    renderLine(
      this,
      {
        x1: x + contentIndent + cellWidth,
        y1: y,
        x2: x + contentIndent + cellWidth,
        y2: y + height,
      },
      {
        stroke: verticalBorderColor,
        lineWidth: verticalBorderWidth,
        opacity: verticalBorderColorOpacity,
      },
    );
  }

  protected getColResizeAreaOffset() {
    const { scrollX, position } = this.headerConfig;
    const { x, y } = this.meta;

    return {
      x: position.x - scrollX + x,
      y: position.y + y,
    };
  }

  protected drawResizeAreaInLeaf() {
    if (!this.meta.isLeaf) {
      return;
    }

    const { x, y, width, height } = this.getCellArea();
    const resizeStyle = this.getResizeAreaStyle();
    const resizeArea = getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_ROW_RESIZE_AREA,
    );

    const { position, seriesNumberWidth, scrollX, scrollY } = this.headerConfig;
    const { label, parent } = this.meta;

    const freezeCornerDiffWidth =
      this.spreadsheet.facet.getFreezeCornerDiffWidth();

    const resizeAreaWidth = this.spreadsheet.isFreezeRowHeader()
      ? width - freezeCornerDiffWidth + scrollX
      : width;

    resizeArea.addShape('rect', {
      attrs: {
        ...getResizeAreaAttrs({
          theme: resizeStyle,
          type: ResizeAreaType.Row,
          effect: ResizeAreaEffect.Cell,
          caption: parent.isTotals ? '' : label,
          offsetX: position.x + x + seriesNumberWidth,
          offsetY: position.y + y - scrollY,
          width,
          height,
        }),
        x: position.x + x - scrollX + seriesNumberWidth,
        y: position.y + y - scrollY + height - resizeStyle.size / 2,
        width: resizeAreaWidth,
      },
    });
  }

  protected getContentIndent() {
    if (!this.spreadsheet.isHierarchyTreeType()) {
      return 0;
    }
    const { icon } = this.getStyle();
    const iconWidth = icon.size + icon.margin.right;

    let parent = this.meta.parent;
    let multiplier = 0;
    while (parent) {
      if (parent.height !== 0) {
        multiplier += iconWidth;
      }
      parent = parent.parent;
    }

    return multiplier;
  }

  protected getTextIndent() {
    const { size, margin } = this.getStyle().icon;
    const contentIndent = this.getContentIndent();
    const treeIconWidth = this.showTreeIcon() ? size + margin.right : 0;
    return contentIndent + treeIconWidth;
  }

  protected getTextStyle(): TextTheme {
    const { isLeaf, isTotals } = this.meta;
    const { text, bolderText } = this.getStyle();
    const style = isLeaf && !isTotals ? text : bolderText;

    return {
      ...style,
      textAlign: this.spreadsheet.isHierarchyTreeType() ? 'left' : 'center',
      textBaseline: 'top',
    };
  }

  protected getFormattedFieldValue(): FormatResult {
    const { label } = this.meta;
    let content = label;
    const formatter = this.spreadsheet.dataSet.getFieldFormatter(
      this.meta.field,
    );
    if (formatter) {
      content = formatter(label);
    }
    return {
      formattedValue: content,
      value: label,
    };
  }

  protected getIconPosition() {
    const { x, y, textAlign } = this.textShape.cfg.attrs;

    return {
      x:
        x +
        (textAlign === 'center'
          ? this.actualTextWidth / 2
          : this.actualTextWidth) +
        this.getStyle().icon.margin.left,
      y: y,
    };
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getContentArea();
    return width - this.getTextIndent() - this.getActionIconsWidth();
  }

  protected getTextPosition(): Point {
    const { y, height: contentHeight } = this.getContentArea();
    const { scrollY, height } = this.headerConfig;

    const { fontSize } = this.getTextStyle();
    const textIndent = this.getTextIndent();
    const textY = getAdjustPosition(
      y,
      contentHeight,
      scrollY,
      height,
      fontSize,
    );
    const textX =
      getTextPosition(this.getContentArea(), this.getTextStyle()).x +
      textIndent;
    return { x: textX, y: textY };
  }

  private getIconYPosition() {
    const textY = this.getTextPosition().y;
    const { size } = this.getStyle().icon;
    const { fontSize } = this.getTextStyle();
    return textY + (fontSize - size) / 2;
  }
}
