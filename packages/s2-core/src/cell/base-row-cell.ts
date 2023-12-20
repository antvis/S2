import type { PointLike } from '@antv/g';
import type { SimpleBBox } from '@antv/g-canvas';
import { GM } from '@antv/g-gesture';
import { find, get, merge } from 'lodash';
import {
  CellType,
  KEY_GROUP_ROW_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
  S2Event,
} from '../common/constant';
import {
  CellClipBox,
  type AreaRange,
  type ViewMeta,
} from '../common/interface';
import { CustomRect } from '../engine';
import type { RowHeaderConfig } from '../facet/header/row';
import {
  getHorizontalTextIconPosition,
  getVerticalIconPosition,
} from '../utils/cell/cell';
import { adjustTextIconPositionWhileScrolling } from '../utils/cell/text-scrolling';
import { renderCircle, renderTreeIcon } from '../utils/g-renders';
import { getAllChildrenNodeHeight } from '../utils/get-all-children-node-height';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
  shouldAddResizeArea,
} from '../utils/interaction/resize';
import { isMobile } from '../utils/is-mobile';
import { normalizeTextAlign } from '../utils/normalize';
import { getAdjustPosition } from '../utils/text-absorption';
import { HeaderCell } from './header-cell';
import type { RowCell } from './row-cell';

export class BaseRowCell extends HeaderCell<RowHeaderConfig> {
  protected gm: GM;

  public get cellType() {
    return CellType.ROW_CELL;
  }

  public destroy(): void {
    super.destroy();
    this.gm?.destroy();
  }

  protected initCell() {
    super.initCell();
    // 绘制单元格背景
    this.drawBackgroundShape();
    // 绘制交互背景
    this.drawInteractiveBgShape();
    // 绘制交互边框
    this.drawInteractiveBorderShape();
    // 绘制单元格文本
    this.drawTextShape();
    // 绘制 action icons
    this.drawActionAndConditionIcons();
    // 绘制树状模式收起展开的 icon
    this.drawTreeIcon();
    // 绘制树状模式下子节点层级占位圆点
    this.drawTreeLeafNodeAlignDot();
    // 绘制 resize 热区
    this.drawResizeAreaInLeaf();
    this.update();
  }

  public getBackgroundColor() {
    const { backgroundColor, backgroundColorOpacity } =
      this.getCrossBackgroundColor(this.meta.rowIndex);

    return merge(
      { backgroundColor, backgroundColorOpacity },
      this.getBackgroundConditionFill(),
    );
  }

  protected showTreeIcon() {
    return this.spreadsheet.isHierarchyTreeType() && !this.meta.isLeaf;
  }

  protected showTreeLeafNodeAlignDot() {
    return (
      this.spreadsheet.options.style?.rowCell?.showTreeLeafNodeAlignDot &&
      this.spreadsheet.isHierarchyTreeType()
    );
  }

  // 获取树状模式下叶子节点的父节点收起展开 icon 图形属性
  protected getParentTreeIconCfg() {
    if (
      !this.showTreeLeafNodeAlignDot() ||
      !this.spreadsheet.isHierarchyTreeType() ||
      !this.meta.isLeaf
    ) {
      return;
    }

    return (this.meta.parent?.belongsCell as RowCell).getTreeIcon()?.getCfg();
  }

  private onTreeIconClick() {
    const { isCollapsed, hierarchy } = this.meta;

    if (isMobile()) {
      return;
    }

    // 折叠行头时因 scrollY 没变，导致底层出现空白
    if (!isCollapsed) {
      const { scrollY: oldScrollY } = this.spreadsheet.facet.getScrollOffset();
      // 可视窗口高度
      const viewportHeight =
        this.spreadsheet.facet.panelBBox.viewportHeight || 0;
      // 被折叠项的高度
      const deleteHeight = getAllChildrenNodeHeight(this.meta);
      // 折叠后真实高度
      const realHeight = hierarchy.height - deleteHeight;

      if (oldScrollY > 0 && oldScrollY + viewportHeight > realHeight) {
        const currentScrollY = realHeight - viewportHeight;

        this.spreadsheet.facet.setScrollOffset({
          scrollY: currentScrollY > 0 ? currentScrollY : 0,
        });
      }
    }

    this.emitCollapseEvent();
  }

  private emitCollapseEvent() {
    this.spreadsheet.emit(S2Event.ROW_CELL_COLLAPSED__PRIVATE, {
      isCollapsed: !this.meta.isCollapsed,
      node: this.meta,
    });
  }

  protected drawTreeIcon() {
    if (!this.showTreeIcon()) {
      return;
    }

    const { isCollapsed } = this.meta;
    const { x } = this.getBBoxByType(CellClipBox.CONTENT_BOX);
    const { fill } = this.getTextStyle();
    const { size } = this.getStyle()!.icon!;

    const contentIndent = this.getContentIndent();

    const iconX = x + contentIndent;
    const iconY = this.getIconPosition().y;

    this.treeIcon = renderTreeIcon({
      group: this,
      iconCfg: {
        x: iconX,
        y: iconY,
        width: size!,
        height: size!,
        fill,
      },
      isCollapsed,
      onClick: () => {
        this.onTreeIconClick();
      },
    });

    // 移动端, 点击热区为整个单元格
    if (isMobile()) {
      this.addEventListener('click', () => {
        this.emitCollapseEvent();
      });
    }
  }

  protected drawTreeLeafNodeAlignDot() {
    const parentTreeIconCfg = this.getParentTreeIconCfg();

    if (!parentTreeIconCfg) {
      return;
    }

    const { size, margin } = this.getStyle().icon;
    const x = Number(parentTreeIconCfg.x!) + size + margin.right;
    const textY = this.getTextPosition().y;

    const { fill, fontSize } = this.getTextStyle();
    // 半径，暂时先写死，后面看是否有这个点点的定制需求
    const r = size / 5;

    this.treeLeafNodeAlignDot = renderCircle(this, {
      // 和收起展开 icon 保持居中对齐
      cx: x + size / 2,
      cy: textY + (fontSize! - r) / 2,
      r,
      fill,
      // 暂时先写死，后面看是否有这个点点的定制需求
      fillOpacity: 0.3,
    });
  }

  protected isBolderText() {
    // 非叶子节点、小计总计，均为粗体
    const { isLeaf, isTotals, level } = this.meta;

    return (!isLeaf && level === 0) || isTotals;
  }

  protected drawTextShape() {
    super.drawTextShape();
    this.drawLinkField(this.meta);
  }

  protected getResizeClipAreaBBox(): SimpleBBox {
    const { width, viewportHeight } = this.headerConfig;

    return {
      x: 0,
      y: 0,
      width,
      height: viewportHeight,
    };
  }

  protected drawResizeAreaInLeaf() {
    if (
      !this.meta.isLeaf ||
      !this.shouldDrawResizeAreaByType('rowCellVertical', this)
    ) {
      return;
    }

    const { x, y, width, height } = this.getBBoxByType();
    const resizeStyle = this.getResizeAreaStyle();
    const resizeArea = getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_ROW_RESIZE_AREA,
    );

    if (!resizeArea) {
      return;
    }

    const {
      position,
      width: headerWidth,
      viewportHeight: headerHeight,
      scrollX = 0,
      scrollY = 0,
    } = this.getHeaderConfig();

    const resizeAreaBBox: SimpleBBox = {
      x,
      y: y + height - resizeStyle.size!,
      width,
      height: resizeStyle.size!,
    };

    const resizeClipAreaBBox: SimpleBBox = {
      x: 0,
      y: 0,
      width: headerWidth,
      height: headerHeight,
    };

    if (
      !shouldAddResizeArea(resizeAreaBBox, resizeClipAreaBBox, {
        scrollX,
        scrollY,
      }) ||
      !position
    ) {
      return;
    }

    const offsetX = position.x + x - scrollX;
    const offsetY = position.y + y - scrollY;

    const resizeAreaWidth = this.spreadsheet.isFrozenRowHeader()
      ? headerWidth - position.x - (x - scrollX)
      : width;

    const attrs = getResizeAreaAttrs({
      theme: resizeStyle,
      type: ResizeDirectionType.Vertical,
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
            x: offsetX,
            y: offsetY + height - resizeStyle.size! / 2,
            width: resizeAreaWidth,
          },
        },
        attrs.appendInfo,
      ),
    );
  }

  protected getContentIndent() {
    if (!this.spreadsheet.isHierarchyTreeType()) {
      return 0;
    }

    const { icon, cell } = this.getStyle();
    const iconWidth = icon.size + icon.margin.right;

    let parent = this.meta.parent;
    let sum = 0;

    while (parent) {
      if (parent.height !== 0) {
        sum += iconWidth;
      }

      parent = parent.parent;
    }
    if (this.showTreeLeafNodeAlignDot()) {
      sum += this.isTreeLevel() ? 0 : cell.padding.right + icon.margin.right;
    }

    return sum;
  }

  protected getTextIndent() {
    const { size, margin } = this.getStyle().icon;
    const contentIndent = this.getContentIndent();
    const treeIconWidth =
      this.showTreeIcon() ||
      (this.isTreeLevel() && this.showTreeLeafNodeAlignDot())
        ? size + margin.right
        : 0;

    return contentIndent + treeIconWidth;
  }

  // 判断当前节点的兄弟节点是否叶子节点
  protected isTreeLevel() {
    return find(
      get(this.meta, 'parent.children'),
      (cell: ViewMeta) => !cell.isLeaf,
    );
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    return width - this.getTextIndent() - this.getActionAndConditionIconWidth();
  }

  protected getTextArea(): SimpleBBox {
    const content = this.getBBoxByType(CellClipBox.CONTENT_BOX);
    const textIndent = this.getTextIndent();

    return {
      ...content,
      x: content.x + textIndent,
      width: content.width - textIndent,
    };
  }

  protected getAdjustTextAreaHeight(
    textArea: SimpleBBox,
    scrollY: number,
    viewportHeight: number,
  ): number {
    let adjustTextAreaHeight = textArea.height;

    if (
      !this.spreadsheet.facet.vScrollBar &&
      textArea.y + textArea.height > scrollY + viewportHeight
    ) {
      adjustTextAreaHeight = scrollY + viewportHeight - textArea.y;
    }

    return adjustTextAreaHeight;
  }

  protected calculateTextY({
    textArea,
    adjustTextAreaHeight,
  }: {
    textArea: SimpleBBox;
    adjustTextAreaHeight: number;
  }): number {
    const { scrollY, viewportHeight } = this.headerConfig;
    const { fontSize } = this.getTextStyle();

    return getAdjustPosition(
      textArea.y,
      adjustTextAreaHeight,
      scrollY,
      viewportHeight,
      fontSize,
    );
  }

  protected getTextPosition(): PointLike {
    const { scrollY, viewportHeight } = this.getHeaderConfig();
    const textArea = this.getTextArea();
    const textStyle = this.getTextStyle();
    const { cell, icon: iconStyle } = this.getStyle();

    const viewport: AreaRange = {
      start: scrollY!,
      size: viewportHeight,
    };

    const { textStart } = adjustTextIconPositionWhileScrolling(
      viewport,
      {
        start: textArea.y,
        size: textArea.height,
      },
      {
        align: normalizeTextAlign(textStyle.textBaseline!),
        size: {
          textSize: textStyle.fontSize!,
        },
        padding: {
          start: cell.padding.top,
          end: cell.padding.bottom,
        },
      },
    );

    const { textX, leftIconX, rightIconX } = getHorizontalTextIconPosition({
      bbox: textArea,
      textWidth: this.getActualTextWidth(),
      textAlign: textStyle.textAlign!,
      groupedIcons: this.groupedIcons,
      iconStyle,
    });

    const iconY = getVerticalIconPosition(
      iconStyle?.size!,
      textStart,
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

    return { x: textX, y: textStart };
  }
}
