import { getEllipsisText, measureTextWidth } from '../utils/text';
import { GM } from '@antv/g-gesture';
import { each, get, has, find } from 'lodash';
import { GuiIcon } from '@/common/icons';
import { IGroup } from '@antv/g-canvas';
import { renderRect, updateShapeAttr } from '@/utils/g-renders';
import { isMobile } from '@/utils/is-mobile';
import { getAdjustPosition } from '@/utils/text-absorption';
import { getAllChildrenNodeHeight } from '@/utils/get-all-children-node-height';
import {
  KEY_COLLAPSE_TREE_ROWS,
  KEY_GROUP_ROW_RESIZER,
  COLOR_DEFAULT_RESIZER,
  ID_SEPARATOR,
  CellTypes,
} from '../common/constant';
import { HIT_AREA } from '@/facet/header/base';
import { ResizeInfo } from '@/facet/header/interface';
import { RowHeaderConfig } from '@/facet/header/row';
import { Node } from '../index';
import { BaseCell } from './base-cell';
export class RowCell extends BaseCell<Node> {
  protected headerConfig: RowHeaderConfig;

  // 绘制完其他后，需要额外绘制的起始x坐标
  protected lastStartDrawX: number;

  protected actionIcons: GuiIcon[];

  // TODO type define
  // mobile event
  private gm: GM;

  public update() {
    const selectedId = this.spreadsheet.store.get('rowColSelectedId');
    if (selectedId && find(selectedId, (id) => id === this.meta.id)) {
      this.setActive();
    } else {
      this.setInactive();
    }
  }

  public setActive() {
    updateShapeAttr(this.interactiveBgShape, 'fillOpacity', 1);
    each(this.actionIcons, (icon) => icon.set('visible', true));
  }

  public setInactive() {
    updateShapeAttr(this.interactiveBgShape, 'fillOpacity', 0);
    // each(this.actionIcons, (icon) => icon.set('visible', false));
  }

  public destroy(): void {
    super.destroy();
    this.gm?.destroy();
  }

  // TODO: options能不能不要固定顺序？headerConfig必须是 0下的吗？
  protected handleRestOptions(...options: RowHeaderConfig[]) {
    this.headerConfig = options[0];
  }

  protected initCell() {
    this.cellType = this.getCellType();
    // 1、draw rect background
    this.drawBackgroundColor();
    this.drawInteractiveBgShape();
    // 2、draw text
    this.lastStartDrawX = this.drawCellText();
    // 3、draw icon
    this.drawIconInTree();
    // 4、draw bottom border
    this.drawRectBorder();
    // 5、draw hot-spot rect
    this.drawHotSpotInLeaf();
    // 6、draw action icon shapes: trend icon, drill-down icon ...
    this.drawActionIcons();
  }

  protected getCellType() {
    return CellTypes.ROW_CELL;
  }

  protected drawBackgroundColor() {
    const { rowCell: rowHeaderStyle } = this.spreadsheet.theme;
    const bgColor = rowHeaderStyle.cell.backgroundColor;
    const { x, y, height, width } = this.meta;

    renderRect(
      x,
      y,
      width,
      height,
      bgColor,
      'transparent',
      this,
      rowHeaderStyle.cell.backgroundColorOpacity,
    );
  }

  // 交互使用的背景色
  protected drawInteractiveBgShape() {
    const { x, y, height, width } = this.meta;
    this.interactiveBgShape = renderRect(
      x,
      y,
      width,
      height,
      'transparent',
      'transparent',
      this,
    );
    this.stateShapes.push(this.interactiveBgShape);
  }

  protected drawIconInTree() {
    if (this.isTreeType() && !this.meta.isLeaf) {
      const { offset, height } = this.headerConfig;
      const {
        x,
        y,
        height: cellHeight,
        isCollapsed,
        id,
        hierarchy,
        level,
      } = this.meta;
      const {
        text: textCfg,
        icon: iconCfg,
        cell: cellCfg,
      } = this.theme.rowCell;
      const textIndent = this.getTextIndent();
      const textY = getAdjustPosition(
        y,
        cellHeight,
        offset,
        height,
        textCfg.fontSize,
      );
      const iconX = x + textIndent;
      const iconY = textY + (textCfg.fontSize - iconCfg.size) / 2;
      const icon = new GuiIcon({
        type: isCollapsed ? 'plus' : 'MinusSquare',
        x: iconX,
        y: iconY,
        width: iconCfg.size,
        height: iconCfg.size,
      });
      icon.on('click', () => {
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
        this.spreadsheet.emit(KEY_COLLAPSE_TREE_ROWS, {
          id,
          isCollapsed: !isCollapsed,
          node: this.meta,
        });
      });
      // in mobile, we use this cell
      this.gm = new GM(this, {
        gestures: ['Tap'],
      });
      this.gm.on('tap', () => {
        this.spreadsheet.emit(KEY_COLLAPSE_TREE_ROWS, {
          id,
          isCollapsed: !isCollapsed,
          node: this.meta,
        });
      });
      this.add(icon);
    }
  }

  protected drawRectBorder() {
    const { position, width, viewportWidth, scrollX } = this.headerConfig;
    const { x, y } = this.meta;
    // 1、bottom border
    const textIndent = this.getTextIndent();
    this.addShape('line', {
      attrs: {
        x1: x + textIndent,
        y1: y,
        x2: position.x + width + viewportWidth + scrollX,
        y2: y,
        stroke: this.theme.rowCell.cell.horizontalBorderColor,
        opacity: this.theme.rowCell.cell.horizontalBorderOpacity,
        lineWidth: this.theme.rowCell.cell.horizontalBorderWidth,
      },
    });
  }

  protected isTreeType() {
    return this.spreadsheet.isHierarchyTreeType();
  }

  protected getTextIndent() {
    if (!this.isTreeType()) {
      return 0;
    }
    const cellPadding = get(this.theme, 'rowCell.cell.padding');
    const baseIndent = cellPadding.left;
    const iconTheme = get(this.theme, 'rowCell.icon');
    const iconWidth =
      iconTheme.size + iconTheme.margin.left + iconTheme.margin.right;
    let parent = this.meta.parent;
    let multiplier = baseIndent;
    while (parent) {
      if (parent.height !== 0) {
        multiplier += baseIndent + iconWidth;
      }
      parent = parent.parent;
    }
    return multiplier;
  }

  protected getRowTextStyle(isTotals: boolean, isLeaf: boolean) {
    return isLeaf && !isTotals
      ? this.theme.rowCell.text
      : this.theme.rowCell.bolderText;
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

  protected drawCellText() {
    const { offset, height, linkFieldIds = [] } = this.headerConfig;
    const {
      label,
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      isLeaf,
      isTotals,
    } = this.meta;
    const { text: textTheme, icon: iconTheme } = this.theme.rowCell;
    const isTreeType = this.isTreeType();
    // grid & is totals content is empty
    const content = this.getFormattedValue(label);
    const iconWidth =
      iconTheme.size + iconTheme.margin.left + iconTheme.margin.right;

    const textStyle = { ...this.getRowTextStyle(isTotals, isLeaf) };
    textStyle.textAlign = 'left';
    textStyle.textBaseline = 'top';
    const cellPadding = get(this.theme, 'rowCell.cell.padding');
    const totalPadding = cellPadding?.left + cellPadding?.right;
    const textIndent = !isTreeType
      ? this.getTextIndent() + cellPadding?.left
      : this.getTextIndent() + iconWidth;
    const maxWidth = cellWidth - textIndent - totalPadding;
    const text = getEllipsisText(content, maxWidth, textStyle);
    const textX = x + textIndent;
    const textY = getAdjustPosition(
      y,
      cellHeight,
      offset,
      height,
      textTheme.fontSize,
    );

    const textShape = this.addShape('text', {
      attrs: {
        x: textX,
        y: textY,
        text,
        ...textStyle,
        cursor: 'pointer',
      },
    });
    // handle link nodes
    if (linkFieldIds.includes(this.meta.key)) {
      const device = get(this.headerConfig, 'spreadsheet.options.style.device');
      // 配置了链接跳转
      if (!isMobile(device)) {
        const textBBox = textShape.getBBox();
        this.addShape('line', {
          attrs: {
            x1: textBBox.bl.x,
            y1: textBBox.bl.y + 1,
            x2: textBBox.br.x,
            y2: textBBox.br.y + 1,
            stroke: textStyle.fill,
            lineWidth: 1,
          },
        });
        textShape.attr({
          appendInfo: {
            isRowHeaderText: true, // 标记为行头文本，方便做链接跳转直接识别
            cellData: this.meta,
          },
        });
      } else {
        textShape.attr({
          fill: '#0000ee',
          appendInfo: {
            isRowHeaderText: true, // 标记为行头文本，方便做链接跳转直接识别
            cellData: this.meta,
          },
        });
      }
    }
    return textX + measureTextWidth(text, textStyle);
  }

  protected drawHotSpotInLeaf() {
    if (this.meta.isLeaf) {
      // 热区公用一个group
      const prevResizer = this.spreadsheet.foregroundGroup.findById(
        KEY_GROUP_ROW_RESIZER,
      );
      const resizer = (prevResizer ||
        this.spreadsheet.foregroundGroup.addGroup({
          id: KEY_GROUP_ROW_RESIZER,
        })) as IGroup;
      const { offset, position } = this.headerConfig;
      const {
        label,
        x,
        y,
        width: cellWidth,
        height: cellHeight,
        parent,
      } = this.meta;
      resizer.addShape('rect', {
        attrs: {
          x: position.x + x,
          y: position.y - offset + y + cellHeight - HIT_AREA / 2,
          width: cellWidth,
          fill: COLOR_DEFAULT_RESIZER,
          height: HIT_AREA,
          cursor: 'row-resize',
          appendInfo: {
            isResizer: true,
            class: 'resize-trigger',
            type: 'row',
            affect: 'cell',
            caption: parent.isTotals ? '' : label,
            offsetX: position.x + x,
            offsetY: position.y - offset + y,
            width: cellWidth,
            height: cellHeight,
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
      const { x, y, height, width } = this.meta;
      const { cell, text } = this.theme.rowCell;
      for (let i = 0; i < iconTypes.length; i++) {
        const iconRight =
          (text.fontSize + cell.padding?.left) * (iconTypes.length - i);
        const icon = new GuiIcon({
          type: iconTypes[i],
          x: x + width - iconRight,
          y: y + (height - text.fontSize) / 2,
          width: text.fontSize,
          height: text.fontSize,
        });
        icon.set('visible', false);
        icon.on('click', (e: Event) => {
          action(iconTypes[i], this.meta, e);
        });
        this.add(icon);
        if (!this.actionIcons) {
          this.actionIcons = [];
        }
        this.actionIcons.push(icon);
      }
    }
  }
}
