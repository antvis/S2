import type { PointLike } from '@antv/g';
import { find, get, merge } from 'lodash';
import {
  CellType,
  FrozenGroupType,
  KEY_GROUP_ROW_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
  S2Event,
} from '../common/constant';
import {
  CellBorderPosition,
  CellClipBox,
  type AreaRange,
  type ViewMeta,
} from '../common/interface';
import { CustomRect } from '../engine';
import type { RowHeaderConfig } from '../facet/header';
import {
  getHorizontalTextIconPosition,
  getVerticalIconPosition,
} from '../utils/cell/cell';
import { renderCircle, renderTreeIcon } from '../utils/g-renders';
import { getAllChildrenNodeHeight } from '../utils/get-all-children-node-height';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
} from '../utils/interaction/resize';
import { isMobile } from '../utils/is-mobile';
import type { FrozenFacet } from '../facet/frozen-facet';
import type { SimpleBBox } from './../engine/interface';
import { adjustTextIconPositionWhileScrolling } from './../utils/cell/text-scrolling';
import { shouldAddResizeArea } from './../utils/interaction/resize';
import { normalizeTextAlign } from './../utils/normalize';
import { HeaderCell } from './header-cell';

export class RowCell extends HeaderCell<RowHeaderConfig> {
  public get cellType() {
    return CellType.ROW_CELL;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.BOTTOM, CellBorderPosition.LEFT];
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
    // 绘制字段和 action标记 -- icon 和 action
    this.drawActionAndConditionIcons();
    // 绘制树状模式收起展开的 icon
    this.drawTreeIcon();
    // 绘制树状模式下子节点层级占位圆点
    this.drawTreeLeafNodeAlignDot();
    // 绘制单元格边框
    this.drawBorders();
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

    const treeIcon = (
      this.meta.parent?.belongsCell as HeaderCell
    ).getTreeIcon();

    return treeIcon?.style;
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

    const { size, margin } = this.getStyle()!.icon!;
    const x = parentTreeIconCfg.x + size + margin!.right;
    const textY = this.getTextPosition().y;

    const { fill, fontSize } = this.getTextStyle();
    // 半径，暂时先写死，后面看是否有这个点点的定制需求
    const r = size! / 5;

    this.treeLeafNodeAlignDot = renderCircle(this, {
      // 和收起展开 icon 保持居中对齐
      cx: x + size! / 2,
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

  public drawTextShape() {
    super.drawTextShape();
    if (!this.isShallowRender()) {
      this.drawLinkField(this.meta);
    }
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
      spreadsheet,
    } = this.getHeaderConfig();

    const resizeAreaBBox: SimpleBBox = {
      x,
      y: y + height - resizeStyle.size!,
      width,
      height: resizeStyle.size!,
    };

    const isFrozen = this.getMeta().isFrozen;

    const frozenRowGroupHeight = (spreadsheet.facet as FrozenFacet)
      .frozenGroupInfo[FrozenGroupType.FROZEN_ROW]?.height;

    const resizeClipAreaBBox: SimpleBBox = {
      x: 0,
      y: frozenRowGroupHeight,
      width: headerWidth,
      height: headerHeight,
    };

    if (
      !isFrozen &&
      !shouldAddResizeArea(resizeAreaBBox, resizeClipAreaBBox, {
        scrollX,
        scrollY,
      })
    ) {
      return;
    }

    const offsetX = position.x + x - scrollX;
    const offsetY = position.y + y - (isFrozen ? 0 : scrollY);

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
            y: offsetY + height - resizeStyle.size!,
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

    const { icon, cell } = this.getStyle()!;
    const iconWidth = icon!.size! + icon!.margin!.right!;

    let parent = this.meta.parent;
    let sum = 0;

    while (parent) {
      if (parent.height !== 0) {
        sum += iconWidth;
      }

      parent = parent.parent;
    }
    if (this.showTreeLeafNodeAlignDot()) {
      sum += this.isTreeLevel()
        ? 0
        : cell!.padding!.right! + icon!.margin!.right!;
    }

    return sum;
  }

  protected getTextIndent() {
    const { size, margin } = this.getStyle()!.icon!;
    const contentIndent = this.getContentIndent();
    const treeIconWidth =
      this.showTreeIcon() ||
      (this.isTreeLevel() && this.showTreeLeafNodeAlignDot())
        ? size! + margin!.right!
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

  protected getTextArea() {
    const content = this.getBBoxByType(CellClipBox.CONTENT_BOX);
    const textIndent = this.getTextIndent();

    return {
      ...content,
      x: content.x + textIndent,
      width: content.width - textIndent,
    };
  }

  protected handleViewport() {
    const { scrollY, viewportHeight, spreadsheet } = this.getHeaderConfig();

    const frozenRowGroupHeight = (spreadsheet.facet as FrozenFacet)
      .frozenGroupInfo[FrozenGroupType.FROZEN_ROW].height;

    const viewport: AreaRange = {
      start: this.getMeta().isFrozen ? 0 : scrollY! + frozenRowGroupHeight,
      size: viewportHeight - frozenRowGroupHeight,
    };

    return viewport;
  }

  protected getTextPosition(): PointLike {
    const textArea = this.getTextArea();
    const textStyle = this.getTextStyle();
    const { cell, icon: iconStyle } = this.getStyle();

    const viewport = this.handleViewport();

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
