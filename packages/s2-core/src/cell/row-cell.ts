import { Point } from '@antv/g-canvas';
import { GM } from '@antv/g-gesture';
import { find, get } from 'lodash';
import { isMobile } from '../utils/is-mobile';
import {
  CellTypes,
  KEY_GROUP_ROW_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
  S2Event,
} from '../common/constant';
import { CellBorderPosition, TextTheme, ViewMeta } from '../common/interface';
import { RowHeaderConfig } from '../facet/header/row';
import {
  getTextAndFollowingIconPosition,
  getBorderPositionAndStyle,
} from '../utils/cell/cell';
import {
  renderLine,
  renderRect,
  renderCircle,
  renderTreeIcon,
} from '../utils/g-renders';
import { getAllChildrenNodeHeight } from '../utils/get-all-children-node-height';
import { getAdjustPosition } from '../utils/text-absorption';
import {
  getResizeAreaAttrs,
  getOrCreateResizeAreaGroupById,
} from '../utils/interaction/resize';
import { shouldAddResizeArea } from './../utils/interaction/resize';
import { HeaderCell } from './header-cell';

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
    // 绘制单元格背景
    this.drawBackgroundShape();
    // 绘制交互背景
    this.drawInteractiveBgShape();
    // 绘制单元格文本
    this.drawTextShape();
    // 绘制树状模式收起展开的 icon
    this.drawTreeIcon();
    // 绘制树状模式下子节点层级占位圆点
    this.drawTreeLeafNodeAlignDot();
    // 绘制单元格边框
    this.drawRectBorder();
    // 绘制 resize 热区
    this.drawResizeAreaInLeaf();
    // 绘制 action icons
    this.drawActionIcons();
    this.update();
  }

  protected drawBackgroundShape() {
    const { backgroundColor, backgroundColorOpacity } = this.getStyle().cell;

    this.backgroundShape = renderRect(this, {
      ...this.getCellArea(),
      fill: backgroundColor,
      fillOpacity: backgroundColorOpacity,
    });
  }

  // 交互使用的背景色
  protected drawInteractiveBgShape() {
    this.stateShapes.set(
      'interactiveBgShape',
      renderRect(
        this,
        {
          ...this.getCellArea(),
        },
        {
          visible: false,
        },
      ),
    );
  }

  private showTreeIcon() {
    return this.spreadsheet.isHierarchyTreeType() && !this.meta.isLeaf;
  }

  private showTreeLeafNodeAlignDot() {
    return (
      get(this.spreadsheet, 'options.style.showTreeLeafNodeAlignDot') &&
      this.spreadsheet.isHierarchyTreeType()
    );
  }

  // 获取树状模式下叶子节点的父节点收起展开 icon 图形属性
  private getParentTreeIconCfg() {
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
    const { size, margin } = this.getStyle().icon;
    const x = parentTreeIconCfg.x + size + margin.right;
    const textY = this.getTextPosition().y;

    const { fill, fontSize } = this.getTextStyle();
    const r = size / 5; // 半径，暂时先写死，后面看是否有这个点点的定制需求
    this.treeLeafNodeAlignDot = renderCircle(this, {
      x: x + size / 2, // 和收起展开 icon 保持居中对齐
      y: textY + (fontSize - r) / 2,
      r,
      fill,
      fillOpacity: 0.3, // 暂时先写死，后面看是否有这个点点的定制需求
    });
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
    const { x } = this.getCellArea();

    const contentIndent = this.getContentIndent();
    const finalX = this.spreadsheet.isHierarchyTreeType()
      ? x
      : x + contentIndent;
    [CellBorderPosition.BOTTOM, CellBorderPosition.LEFT].forEach((type) => {
      const { position, style } = getBorderPositionAndStyle(
        type,
        {
          ...this.getCellArea(),
          x: finalX,
        },
        this.getStyle().cell,
      );
      renderLine(this, position, style);
    });
  }

  protected drawResizeAreaInLeaf() {
    if (
      !this.meta.isLeaf ||
      !this.shouldDrawResizeAreaByType('rowCellVertical')
    ) {
      return;
    }

    const { x, y, width, height } = this.getCellArea();
    const resizeStyle = this.getResizeAreaStyle();
    const resizeArea = getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_ROW_RESIZE_AREA,
    );

    const {
      position,
      seriesNumberWidth,
      width: headerWidth,
      viewportHeight: headerHeight,
      scrollX,
      scrollY,
    } = this.headerConfig;

    const resizeAreaBBox = {
      x,
      y: y + height - resizeStyle.size / 2,
      width,
      height: resizeStyle.size,
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

    resizeArea.addShape('rect', {
      attrs: {
        ...getResizeAreaAttrs({
          id: this.meta.id,
          theme: resizeStyle,
          type: ResizeDirectionType.Vertical,
          effect: ResizeAreaEffect.Cell,
          offsetX,
          offsetY,
          width,
          height,
        }),
        x: offsetX,
        y: offsetY + height - resizeStyle.size / 2,
        width: resizeAreaWidth,
      },
    });
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

  protected isBolderText() {
    // 非叶子节点、小计总计，均为粗体
    const { isLeaf, isTotals, level } = this.meta;
    return (!isLeaf && level === 0) || isTotals;
  }

  protected getTextStyle(): TextTheme {
    const { text, bolderText, measureText } = this.getStyle();

    if (this.isMeasureField()) {
      return measureText || text;
    }

    if (this.isBolderText()) {
      return bolderText;
    }

    return text;
  }

  protected getIconPosition() {
    // 不同 textAlign 下，对应的文字绘制点 x 不同
    const { x, y, textAlign } = this.textShape.cfg.attrs;
    const iconMarginLeft = this.getStyle().icon.margin.left;

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
    const { width } = this.getContentArea();
    return width - this.getTextIndent() - this.getActionIconsWidth();
  }

  private getTextArea() {
    const content = this.getContentArea();
    const textIndent = this.getTextIndent();
    return {
      ...content,
      x: content.x + textIndent,
      width: content.width - textIndent,
    };
  }

  protected getTextPosition(): Point {
    const textArea = this.getTextArea();
    const { scrollY, viewportHeight: height } = this.headerConfig;

    const { fontSize } = this.getTextStyle();
    const textY = getAdjustPosition(
      textArea.y,
      textArea.height,
      scrollY,
      height,
      fontSize,
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

  private getIconYPosition() {
    const textY = this.getTextPosition().y;
    const { size } = this.getStyle().icon;
    const { fontSize } = this.getTextStyle();
    return textY + (fontSize - size) / 2;
  }
}
