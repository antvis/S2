import type { PointLike } from '@antv/g';
import { GM } from '@antv/g-gesture';
import { find, get } from 'lodash';
import {
  CellTypes,
  KEY_GROUP_ROW_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
  S2Event,
} from '../common/constant';
import type { RowHeaderConfig } from '../facet/header';
import {
  CellBorderPosition,
  CellClipBox,
  type ViewMeta,
} from '../common/interface';
import { getTextAndFollowingIconPosition } from '../utils/cell/cell';
import { renderCircle, renderTreeIcon } from '../utils/g-renders';
import { getAllChildrenNodeHeight } from '../utils/get-all-children-node-height';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
} from '../utils/interaction/resize';
import { isMobile } from '../utils/is-mobile';
import { getAdjustPosition } from '../utils/text-absorption';
import { CustomRect } from '../engine';
import { shouldAddResizeArea } from './../utils/interaction/resize';
import { HeaderCell } from './header-cell';

export class RowCell extends HeaderCell {
  protected declare headerConfig: RowHeaderConfig;

  protected gm: GM;

  public get cellType() {
    return CellTypes.ROW_CELL;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.BOTTOM, CellBorderPosition.LEFT];
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
    // 绘制字段标记 -- icon
    this.drawConditionIconShapes();
    // 绘制树状模式收起展开的 icon
    this.drawTreeIcon();
    // 绘制树状模式下子节点层级占位圆点
    this.drawTreeLeafNodeAlignDot();
    // 绘制单元格边框
    this.drawBorders();
    // 绘制 resize 热区
    this.drawResizeAreaInLeaf();
    // 绘制 action icons
    this.drawActionIcons();
    this.update();
  }

  protected showTreeIcon() {
    return this.spreadsheet.isHierarchyTreeType() && !this.meta.isLeaf;
  }

  protected showTreeLeafNodeAlignDot() {
    return (
      this.spreadsheet.options.style?.showTreeLeafNodeAlignDot &&
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
    return get(this.meta, 'parent.belongsCell.treeIcon.cfg');
  }

  // draw tree icon
  protected drawTreeIcon() {
    if (!this.showTreeIcon()) {
      return;
    }

    const { isCollapsed, id, hierarchy } = this.meta;
    const { x } = this.getBBoxByType(CellClipBox.CONTENT_BOX);
    const { fill } = this.getTextStyle();
    const { size } = this.getStyle()!.icon!;

    const contentIndent = this.getContentIndent();

    const iconX = x + contentIndent;
    const iconY = this.getIconYPosition();

    this.treeIcon = renderTreeIcon(
      this,
      {
        x: iconX,
        y: iconY,
        width: size!,
        height: size!,
      },
      fill!,
      isCollapsed,
      () => {
        if (isMobile()) {
          return;
        }
        // 折叠行头时因scrollY没变，导致底层出现空白
        if (!isCollapsed) {
          const oldScrollY = this.spreadsheet.store.get('scrollY');
          // 可视窗口高度
          const viewportHeight =
            this.spreadsheet.facet.panelBBox.viewportHeight || 0;
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
    if (isMobile()) {
      // TODO: 移动端是否可以生效？
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
    const r = size! / 5; // 半径，暂时先写死，后面看是否有这个点点的定制需求
    this.treeLeafNodeAlignDot = renderCircle(this, {
      cx: x + size! / 2, // 和收起展开 icon 保持居中对齐
      cy: textY + (fontSize! - r) / 2,
      r,
      fill,
      fillOpacity: 0.3, // 暂时先写死，后面看是否有这个点点的定制需求
    });
  }

  protected isBolderText() {
    // 非叶子节点、小计总计，均为粗体
    const { isLeaf, isTotals, level } = this.meta;
    return (!isLeaf && level === 0) || isTotals;
  }

  // draw text
  protected drawTextShape() {
    super.drawTextShape();
    this.drawLinkFieldShape();
  }

  protected drawLinkFieldShape() {
    const { linkFields = [] } = this.headerConfig;
    const { linkTextFill } = this.getTextStyle();

    super.drawLinkFieldShape(linkFields.includes(this.meta.key), linkTextFill!);
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
      seriesNumberWidth,
      width: headerWidth,
      viewportHeight: headerHeight,
      scrollX = 0,
      scrollY = 0,
    } = this.headerConfig;

    const resizeAreaBBox = {
      x,
      y: y + height - resizeStyle.size!,
      width,
      height: resizeStyle.size!,
    };

    const resizeClipAreaBBox = {
      x: 0,
      y: 0,
      width: headerWidth,
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

    const offsetX = position.x + x - scrollX + seriesNumberWidth;
    const offsetY = position.y + y - scrollY;

    const resizeAreaWidth = this.spreadsheet.isFrozenRowHeader()
      ? headerWidth - seriesNumberWidth - (x - scrollX)
      : width;

    const attrs = getResizeAreaAttrs({
      id: this.meta.id,
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

  protected getIconPosition() {
    // 不同 textAlign 下，对应的文字绘制点 x 不同
    const { x, y, textAlign } = this.textShape.cfg.attrs;
    const iconMarginLeft = this.getStyle()!.icon!.margin!.left;

    if (textAlign === 'left') {
      /**
       * attrs.x
       *   |
       *   v
       *   +---------+  +----+
       *   |  text   |--|icon|
       *   +---------+  +----+
       */
      return {
        x: x + this.actualTextWidth + iconMarginLeft,
        y,
      };
    }
    if (textAlign === 'right') {
      /**
       *           attrs.x
       *             |
       *             v
       *   +---------+  +----+
       *   |  text   |--|icon|
       *   +---------+  +----+
       */
      return {
        x: x + iconMarginLeft,
        y,
      };
    }

    /**
     *      attrs.x
     *        |
     *        v
     *   +---------+  +----+
     *   |  text   |--|icon|
     *   +---------+  +----+
     */
    return {
      x: x + this.actualTextWidth / 2 + iconMarginLeft,
      y,
    };
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);
    return width - this.getTextIndent() - this.getActionIconsWidth();
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

  protected getTextPosition(): PointLike {
    const textArea = this.getTextArea();
    const { scrollY, viewportHeight: height } = this.headerConfig;

    const { fontSize } = this.getTextStyle();
    const textY = getAdjustPosition(
      textArea.y,
      textArea.height,
      scrollY!,
      height,
      fontSize!,
    );
    const textX = getTextAndFollowingIconPosition(
      textArea,
      this.getTextStyle(),
      0,
      this.getIconStyle(),
      this.getActionIconsCount(),
    ).text.x;
    return { x: textX, y: textY };
  }

  protected getIconYPosition() {
    const textY = this.getTextPosition().y;
    const { size } = this.getStyle()!.icon!;
    const { fontSize } = this.getTextStyle();
    return textY + (fontSize! - size!) / 2;
  }
}
