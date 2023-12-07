import type { Point } from '@antv/g-canvas';
import { GM } from '@antv/g-gesture';
import { find, get, isEmpty } from 'lodash';
import type { SimpleBBox } from '@antv/g-canvas';
import {
  CellTypes,
  KEY_GROUP_ROW_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
  S2Event,
} from '../common/constant';
import { CellBorderPosition, type ViewMeta } from '../common/interface';
import type { RowHeaderConfig } from '../facet/header/row';
import {
  getBorderPositionAndStyle,
  getTextAndFollowingIconPosition,
} from '../utils/cell/cell';
import {
  renderCircle,
  renderLine,
  renderRect,
  renderTreeIcon,
} from '../utils/g-renders';
import { getAllChildrenNodeHeight } from '../utils/get-all-children-node-height';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
} from '../utils/interaction/resize';
import { isMobile } from '../utils/is-mobile';
import { getAdjustPosition } from '../utils/text-absorption';
import { shouldAddResizeArea } from '../utils/interaction/resize';
import { HeaderCell } from './header-cell';

export class BaseRowCell extends HeaderCell {
  protected declare headerConfig: RowHeaderConfig;

  protected gm: GM;

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
    this.drawRectBorder();
    // 绘制 resize 热区
    this.drawResizeAreaInLeaf();
    // 绘制 action icons
    this.drawActionIcons();
    this.update();
  }

  public getBackgroundColor() {
    const { backgroundColor, backgroundColorOpacity } =
      this.getCrossBackgroundColor(this.meta.rowIndex);
    return this.getBackgroundColorByCondition(
      backgroundColor,
      backgroundColorOpacity,
    );
  }

  /**
   * 绘制hover悬停，刷选的外框
   */
  protected drawInteractiveBorderShape() {
    // 往内缩一个像素，避免和外边框重叠
    const margin = 2;

    this.stateShapes.set(
      'interactiveBorderShape',
      renderRect(this, this.getInteractiveBorderShapeStyle(margin), {
        visible: false,
      }),
    );
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
          const viewportHeight = this.headerConfig.viewportHeight || 0;
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

  protected isBolderText() {
    // 非叶子节点、小计总计，均为粗体
    const { isLeaf, isTotals, level } = this.meta;
    return (!isLeaf && level === 0) || isTotals;
  }

  // draw text
  protected drawTextShape() {
    super.drawTextShape();
    this.drawLinkField(this.meta);
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
      scrollX,
      scrollY,
    } = this.headerConfig;

    const resizeAreaBBox = {
      // fix: When scrolling without the entire frozen header horizontally, the resize area would be removed permanently.
      x: x + seriesNumberWidth,
      y: y + height - resizeStyle.size / 2,
      width,
      height: resizeStyle.size,
    };

    const resizeClipAreaBBox = this.getResizeClipAreaBBox();

    if (
      !shouldAddResizeArea(resizeAreaBBox, resizeClipAreaBBox, {
        scrollX,
        scrollY,
      })
    ) {
      return;
    }

    const offsetX = position?.x + x - scrollX + seriesNumberWidth;
    const offsetY = position?.y + y - scrollY;

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
          meta: this.meta,
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

  protected getTextArea(): SimpleBBox {
    const content = this.getContentArea();
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

  protected getTextPosition(): Point {
    const textArea = this.getTextArea();
    const { scrollY, viewportHeight } = this.headerConfig;

    const adjustTextAreaHeight = this.getAdjustTextAreaHeight(
      textArea,
      scrollY,
      viewportHeight,
    );
    const textY = this.calculateTextY({ textArea, adjustTextAreaHeight });
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
    const { size } = this.getStyle().icon;
    const { fontSize } = this.getTextStyle();
    return textY + (fontSize - size) / 2;
  }
}
