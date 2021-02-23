/**
 * Create By Bruce Too
 * On 2019-11-01
 */
import { getEllipsisText, measureTextWidth } from '../utils/text';
import { GM } from '@antv/g-gesture';
import * as _ from 'lodash';
import { GuiIcon } from '../common/icons';
import { IGroup } from '@antv/g-canvas';
import { renderRect, updateShapeAttr } from '../utils/g-renders';
import { isMobile } from '../utils/is-mobile';
import { getAdjustPosition } from '../utils/text-absorption';
import { getAllChildrenNodeHeight } from '../utils/get-all-children-node-height';
import {
  DEFAULT_PADDING,
  EXTRA_FIELD,
  ICON_RADIUS,
  KEY_COLLAPSE_TREE_ROWS,
  KEY_GROUP_ROW_RESIZER,
  COLOR_DEFAULT_RESIZER,
} from '../common/constant';
import { HIT_AREA } from '../facet/header/base';
import { ResizeInfo } from '../facet/header/interface';
import { RowHeaderConfig } from '../facet/header/row';
import { Node } from '../index';
import { BaseCell } from './base-cell';
import { FONT_SIZE } from '../theme/default';

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
    if (selectedId && _.find(selectedId, (id) => id === this.meta.id)) {
      this.setActive();
    } else {
      this.setInactive();
    }
  }

  public setActive() {
    updateShapeAttr(
      this.interactiveBgShape,
      'fillOpacity',
      this.theme.header.cell.interactiveFillOpacity[1],
    );
    _.each(this.actionIcons, (icon) => icon.set('visible', true));
  }

  public setInactive() {
    updateShapeAttr(this.interactiveBgShape, 'fillOpacity', 0);
    _.each(this.actionIcons, (icon) => icon.set('visible', false));
  }

  public destroy(): void {
    super.destroy();
    if (this.gm) {
      this.gm.destroy();
    }
  }

  protected handleRestOptions(...options) {
    this.headerConfig = options[0];
  }

  protected initCell() {
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
    this.drawActionIcons();
    // 6、draw other shape.
    this.drawExtra();

    this.update();
  }

  protected drawActionIcons() {
    const rowActionIcons = this.spreadsheet.options.rowActionIcons;
    if (rowActionIcons) {
      const { iconTypes, display, action } = rowActionIcons;
      const showIcon = () => {
        const level = this.meta.level;
        const { level: rowLevel, operator } = display;
        // eslint-disable-next-line default-case
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
        }
      };
      if (
        showIcon() &&
        this.spreadsheet.isHierarchyTreeType() &&
        this.spreadsheet.isSpreadsheetType()
      ) {
        const { x, y, height, width, id } = this.meta;
        for (let i = 0; i < iconTypes.length; i++) {
          const iconSize = ICON_RADIUS * 2;
          const iconRight =
            (iconSize + DEFAULT_PADDING) * (iconTypes.length - i);
          const icon = new GuiIcon({
            type: iconTypes[i],
            x: x + width - iconRight,
            y: y + (height - iconSize) / 2,
            width: iconSize,
            height: iconSize,
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

  protected drawExtra() {}

  protected isTreeType() {
    return this.spreadsheet.isHierarchyTreeType();
  }

  protected getTextIndent() {
    if (!this.isTreeType()) {
      return 0;
    }
    const baseIndent = this.theme.header.cell.textIndent;
    let parent = this.meta.parent;
    let multiplier = baseIndent;
    while (parent) {
      if (parent.height !== 0) {
        multiplier += baseIndent;
      }
      parent = parent.parent;
    }
    return multiplier;
  }

  protected getRowTextStyle(level, isTotals, isLeaf) {
    return isLeaf && !isTotals
      ? this.theme.header.text
      : this.theme.header.bolderText;
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
      parent,
      level,
      isLeaf,
      isTotals,
      isCustom,
    } = this.meta;
    let content = this.getFormattedValue(label);
    // grid & is totals content is empty
    if (!this.isTreeType() && parent.isTotals) {
      content = '';
    }

    // indent in tree
    const textIndent = this.getTextIndent();
    const textStyle = this.getRowTextStyle(level, isTotals || isCustom, isLeaf);
    const maxWidth =
      cellWidth -
      textIndent -
      DEFAULT_PADDING * 2 -
      (this.isTreeType() ? ICON_RADIUS * 2 : 0);
    const text = getEllipsisText(content, maxWidth, textStyle);
    const textY = getAdjustPosition(y, cellHeight, offset, height, FONT_SIZE);

    const textX =
      x +
      textIndent +
      (this.isTreeType() ? DEFAULT_PADDING * 2 : cellWidth / 2);
    const textAlign = this.isTreeType() ? 'start' : 'center';
    const textShape = this.addShape('text', {
      attrs: {
        x: textX,
        y: textY + FONT_SIZE / 2,
        textAlign,
        text,
        ...textStyle,
        cursor: 'pointer',
      },
    });
    // handle link nodes
    if (linkFieldIds.includes(this.meta.key)) {
      const device = _.get(
        this.headerConfig,
        'spreadsheet.options.style.device',
      );
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
      } = this.meta;
      const textIndent = this.getTextIndent();
      const textY = getAdjustPosition(y, cellHeight, offset, height, FONT_SIZE);
      const iconSize = ICON_RADIUS * 2;
      const icon = new GuiIcon({
        type: isCollapsed ? 'plus' : 'MinusSquare',
        x: x + textIndent - iconSize,
        y: textY + (FONT_SIZE - iconSize) / 2,
        width: iconSize,
        height: iconSize,
      });
      icon.on('click', () => {
        // 折叠行头时因scrollY没变，导致底层出现空白
        if (!isCollapsed) {
          const oldScrollY = this.spreadsheet.store.get('scrollY');
          // 可视窗口高度
          const viewportHeight =
            this.spreadsheet.facet.viewportBBox.height || 0;
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
    const { x, y, height: cellHeight } = this.meta;
    // 1、bottom border
    if (
      !this.meta.isLeaf ||
      (this.meta.isLeaf && !this.spreadsheet.isValueInCols()) ||
      !this.spreadsheet.isSpreadsheetType()
    ) {
      const textIndent = this.getTextIndent();
      this.addShape('line', {
        attrs: {
          x1: x + textIndent,
          y1: y,
          x2: position.x + width + viewportWidth + scrollX,
          y2: y,
          stroke: this.theme.header.cell.borderColor[0],
          lineWidth: this.theme.header.cell.borderWidth[0],
        },
      });
    }

    // 2、leaf left border(only when value in rows)
    if (
      !this.spreadsheet.isValueInCols() &&
      this.meta.isLeaf &&
      this.meta.query &&
      _.has(this.meta.query, EXTRA_FIELD)
    ) {
      this.addShape('line', {
        attrs: {
          x1: x,
          y1: y,
          x2: x,
          y2: y + cellHeight,
          stroke: this.theme.header.cell.borderColor[1],
          lineWidth: this.theme.header.cell.borderColor[1],
        },
      });
    }
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
            isTrigger: true,
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

  // 交互使用的背景色
  protected drawInteractiveBgShape() {
    const { x, y, height, width } = this.meta;
    this.interactiveBgShape = renderRect(
      x,
      y,
      width,
      height,
      this.theme.header.cell.interactiveBgColor,
      'transparent',
      this,
    );
    updateShapeAttr(this.interactiveBgShape, 'fillOpacity', 0);
  }

  protected drawBackgroundColor() {
    let bgColor = this.spreadsheet.theme.header.cell.rowBackgroundColor;
    const { x, y, height, width } = this.meta;
    if (
      !this.spreadsheet.isValueInCols() &&
      this.meta.rowIndex % 2 === 0 &&
      this.meta.query &&
      _.has(this.meta.query, EXTRA_FIELD)
    ) {
      bgColor = this.theme.view.cell.crossColor;
    }
    renderRect(x, y, width, height, bgColor, 'transparent', this);
  }
}
