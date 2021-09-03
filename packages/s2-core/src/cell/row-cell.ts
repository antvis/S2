import {
  CellTypes,
  COLOR_DEFAULT_RESIZER,
  ID_SEPARATOR,
  KEY_GROUP_ROW_RESIZER,
  S2Event,
} from '@/common/constant';
import { InteractionStateName } from '@/common/constant/interaction';
import { GuiIcon } from '@/common/icons';
import { FormatResult, TextTheme } from '@/common/interface';
import { HIT_AREA } from '@/facet/header/base';
import { ResizeInfo } from '@/facet/header/interface';
import { RowHeaderConfig } from '@/facet/header/row';
import { renderLine, renderRect, renderTreeIcon } from '@/utils/g-renders';
import { getAllChildrenNodeHeight } from '@/utils/get-all-children-node-height';
import { getAdjustPosition } from '@/utils/text-absorption';
import { Event, IGroup, Point } from '@antv/g-canvas';
import { GM } from '@antv/g-gesture';
import { each, forEach } from 'lodash';
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
    // 1、draw rect background
    this.drawBackgroundShape();
    this.drawInteractiveBgShape();

    // draw icon
    this.drawTreeIcon();
    // draw text
    this.drawTextShape();
    // draw action icon shapes: trend icon, drill-down icon ...
    this.drawActionIcons();

    // draw bottom border
    this.drawRectBorder();
    // draw hot-spot rect
    this.drawHotSpotInLeaf();
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
    const { linkFieldIds = [] } = this.headerConfig;
    const { linkTextFill } = this.getTextStyle();

    super.drawLinkFieldShape(
      linkFieldIds.includes(this.meta.key),
      linkTextFill,
    );
  }

  protected drawRectBorder() {
    const { position, width, viewportWidth, scrollX } = this.headerConfig;
    const {
      horizontalBorderColor,
      horizontalBorderWidth,
      horizontalBorderOpacity,
    } = this.getStyle().cell;
    const { x, y } = this.getCellArea();
    // 1、bottom border
    const contentIndent = this.getContentIndent();
    renderLine(
      this,
      {
        x1: x + contentIndent,
        y1: y,
        x2: position.x + width + viewportWidth + scrollX,
        y2: y,
      },
      {
        stroke: horizontalBorderColor,
        lineWidth: horizontalBorderWidth,
        opacity: horizontalBorderOpacity,
      },
    );
  }

  protected drawHotSpotInLeaf() {
    if (this.meta.isLeaf) {
      const { x, y, width, height } = this.getCellArea();
      // 热区公用一个group
      const prevResizer = this.spreadsheet.foregroundGroup.findById(
        KEY_GROUP_ROW_RESIZER,
      );
      const resizer = (prevResizer ||
        this.spreadsheet.foregroundGroup.addGroup({
          id: KEY_GROUP_ROW_RESIZER,
        })) as IGroup;

      const { offset, position, seriesNumberWidth } = this.headerConfig;
      const { label, parent } = this.meta;
      resizer.addShape('rect', {
        attrs: {
          x: position.x + x + seriesNumberWidth,
          y: position.y + y - offset + height - HIT_AREA / 2,
          width,
          fill: COLOR_DEFAULT_RESIZER,
          height: HIT_AREA,
          cursor: 'row-resize',
          appendInfo: {
            isResizer: true,
            class: 'resize-trigger',
            type: 'row',
            affect: 'cell',
            caption: parent.isTotals ? '' : label,
            offsetX: position.x + x + seriesNumberWidth,
            offsetY: position.y + y - offset,
            width,
            height,
          } as ResizeInfo,
        },
      });
    }
  }

  protected drawActionIcons() {
    const rowActionIcons = this.spreadsheet.options.rowActionIcons;

    if (!rowActionIcons) return;
    const { iconTypes, display, action, customDisplayByRowName } =
      rowActionIcons;
    if (customDisplayByRowName) {
      const { rowNames, mode } = customDisplayByRowName;
      const rowIds = rowNames.map((rowName) => `root${ID_SEPARATOR}${rowName}`);

      if (
        (mode === 'omit' && rowIds.includes(this.meta.id)) ||
        (mode === 'pick' && !rowIds.includes(this.meta.id))
      )
        return;
    }
    const showIcon = () => {
      const level = this.meta.level;
      const { level: rowLevel, operator } = display;
      switch (operator) {
        case '<':
          return level < rowLevel;
        case '<=':
          return level <= rowLevel;
        case '=':
          return level === rowLevel;
        case '>':
          return level > rowLevel;
        case '>=':
          return level >= rowLevel;
        default:
          break;
      }
    };

    if (
      showIcon() &&
      this.spreadsheet.isHierarchyTreeType() &&
      this.spreadsheet.isPivotMode()
    ) {
      const { x, width } = this.getContentArea();
      const { size } = this.getStyle().icon;

      for (let i = 0; i < iconTypes.length; i++) {
        const iconRight = size * (iconTypes.length - i);
        const icon = new GuiIcon({
          type: iconTypes[i],
          x: x + width - iconRight,
          y: this.getIconYPosition(),
          width: size,
          height: size,
        });
        icon.set('visible', false);
        icon.on('click', (e: Event) => {
          action(iconTypes[i], this.meta, e);
        });

        this.actionIcons.push(icon);
        this.add(icon);
      }
    }
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
    return { ...style, textAlign: 'left', textBaseline: 'top' };
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

  protected getMaxTextWidth(): number {
    const { width } = this.getContentArea();
    return width - this.getTextIndent();
  }

  protected getTextPosition(): Point {
    const { x, y, height: contentHeight } = this.getContentArea();
    const { offset, height } = this.headerConfig;

    const { fontSize } = this.getTextStyle();
    const textIndent = this.getTextIndent();
    const textY = getAdjustPosition(y, contentHeight, offset, height, fontSize);
    const textX = x + textIndent;

    return { x: textX, y: textY };
  }

  private getIconYPosition() {
    const textY = this.getTextPosition().y;
    const { size } = this.getStyle().icon;
    const { fontSize } = this.getTextStyle();
    return textY + (fontSize - size) / 2;
  }

  updateByState(stateName: InteractionStateName) {
    super.updateByState(stateName, this);
    each(this.actionIcons, (icon) =>
      icon.set('visible', stateName === InteractionStateName.HOVER),
    );
  }

  public hideInteractionShape() {
    super.hideInteractionShape();
    forEach(this.actionIcons, (icon) => icon.set('visible', false));
  }
}
