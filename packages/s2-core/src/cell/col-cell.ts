import { getEllipsisText, measureTextWidth } from '@/utils/text';
import _ from 'lodash';
import { GuiIcon } from '@/common/icons';
import { renderRect, updateShapeAttr } from '@/utils/g-renders';
import { HIT_AREA } from '@/facet/header/base';
import { ColHeaderConfig } from '@/facet/header/col';
import { ResizeInfo } from '@/facet/header/interface';
import { Node } from '../index';
import { BaseCell } from './base-cell';
import { IGroup } from '@antv/g-canvas';
import {
  KEY_GROUP_COL_RESIZER,
  COLOR_DEFAULT_RESIZER,
} from '../common/constant';

export class ColCell extends BaseCell<Node> {
  protected headerConfig: ColHeaderConfig;
  // protected bottomBorderHotSpot: Set<string>;
  // TODO type define

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
      'fill',
      this.theme.colHeader.cell.selectedBackgroundColor,
    );
  }

  public setInactive() {
    updateShapeAttr(this.interactiveBgShape, 'fillOpacity', 0);
  }

  protected handleRestOptions(...options) {
    this.headerConfig = options[0];
  }

  protected initCell() {
    // when height == 0,draw nothing
    if (this.meta.isHide()) {
      return;
    }
    // 1、draw rect background
    this.drawRectBackground();
    // 2、interactive background shape
    this.drawInteractiveBgShape();
    // 2、draw text
    this.drawCellText();
    // 3、draw sort icons
    this.drawSortIcon();
    // 4、draw right border
    this.drawRightBorder();
    // 5、draw hot-spot rect
    this.drawHotSpot();

    this.updateSelected();
  }

  private updateSelected() {
    const selectedId = this.spreadsheet.store.get('rowColSelectedId');
    if (selectedId && _.find(selectedId, (id) => id === this.meta.id)) {
      this.setActive();
    } else {
      this.setInactive();
    }
  }

  protected getColHotSpotKey() {
    return this.meta.key;
  }

  protected drawRectBackground() {
    const { x, y, width: cellWidth, height: cellHeight } = this.meta;
    this.backgroundShape = renderRect(
      x,
      y,
      cellWidth,
      cellHeight,
      this.theme.colHeader.cell.colBackgroundColor,
      this.theme.colHeader.cell.horizontalBorderWidth,
      this,
    );
  }

  protected drawCellText() {
    const { offset, width, scrollContainsRowHeader, cornerWidth } =
      this.headerConfig;
    const {
      label,
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      isLeaf,
      isTotals,
      key,
    } = this.meta;

    const { icon, text, bolderText } = this.theme.colHeader;

    // 格式化枚举值
    const f = this.headerConfig.formatter(key);
    // const content = f(parent.isTotals ? '' : label);
    const content = f(label);

    const sortIconPadding = this.showSortIcon()
      ? icon.size + icon.margin.right
      : 0;
    const textStyle = isLeaf && !isTotals ? text : bolderText;
    const textShape = getEllipsisText(
      content,
      cellWidth - sortIconPadding,
      textStyle,
    );
    const textWidth = measureTextWidth(textShape, textStyle);
    let textX: number;
    let textAlign: string;
    if (isLeaf) {
      // 最后一个层级的维值，固定居右(但是排除决策模式的场景)
      textX = x + cellWidth - sortIconPadding - icon.margin.right;
      textAlign = 'end';
    } else {
      textAlign = 'center';
      // scroll keep in center
      const cellLeft = x - offset;
      const cellRight = cellLeft + cellWidth;
      const viewportLeft = !scrollContainsRowHeader ? 0 : -cornerWidth;
      const viewportWidth = !scrollContainsRowHeader
        ? width
        : width + cornerWidth;
      const viewportRight = viewportLeft + viewportWidth;
      const extraW = !scrollContainsRowHeader ? 0 : cornerWidth;

      if (cellLeft < viewportLeft && cellRight > viewportRight) {
        // cell width bigger than viewport length
        textX = offset - extraW + viewportWidth / 2;
      } else if (cellLeft < viewportLeft) {
        // left out
        const restWidth = cellWidth - (viewportLeft - cellLeft);
        if (restWidth < textWidth) {
          textX = offset + restWidth;
          textAlign = 'end';
        } else {
          textX = offset - extraW + restWidth / 2;
        }
      } else if (cellRight > viewportRight) {
        // right out
        const restWidth = cellWidth - (cellRight - viewportRight);
        if (restWidth < textWidth) {
          textX = x;
          textAlign = 'start';
        } else {
          textX = x + restWidth / 2;
        }
      } else {
        // all in center
        textX = x + cellWidth / 2;
      }
    }
    // const derivedValue = this.spreadsheet.getDerivedValue(value);
    // if (
    //   !_.isEqual(
    //     derivedValue.derivedValueField,
    //     derivedValue.displayDerivedValueField,
    //   ) &&
    //   derivedValue.derivedValueField.length > 1
    // ) {
    //   // 1、非决策模式下
    //   // 2、衍生值部分显示
    //   // 3、存在多个衍生值（ > 1 ） 首先自己必须是衍生指标
    //   // 4、改列属于衍生值列，且是最后一个优先显示的衍生指标
    //   // 满足上述四个条件，需要...在字段后面，表示还有省略的衍生值
    //   if (
    //     key === EXTRA_FIELD &&
    //     this.spreadsheet.isDerivedValue(value) &&
    //     _.last(derivedValue.displayDerivedValueField) === value
    //   ) {
    //     // 度量列，找到 value值
    //     text += '...';
    //   }
    // }
    this.addShape('text', {
      attrs: {
        x: textX,
        y: y + cellHeight / 2,
        textShape,
        textAlign,
        ...textStyle,
        cursor: 'pointer',
      },
    });
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

  private showSortIcon() {
    const { sortParam } = this.headerConfig;
    const query = this.meta.query;
    return (
      _.isEqual(_.get(sortParam, 'query'), query) &&
      _.get(sortParam, 'type') !== 'none'
    );
  }

  // 绘制排序icon
  private drawSortIcon() {
    const { icon } = this.theme.colHeader;
    if (this.showSortIcon()) {
      const { sortParam } = this.headerConfig;
      const { x, y, width: cellWidth, height: cellHeight } = this.meta;
      const iconShape = new GuiIcon({
        type: _.get(sortParam, 'type', 'none'),
        x: x + cellWidth - icon.size - icon.margin.right,
        y: y + (cellHeight - icon.size) / 2,
        width: icon.size,
        height: icon.size,
      });
      this.add(iconShape);
    }
  }

  // 绘制热区
  private drawHotSpot() {
    const { offset, position, viewportWidth } = this.headerConfig;
    const {
      label,
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      parent,
    } = this.meta;
    // 热区公用一个group
    const prevResizer = this.spreadsheet.foregroundGroup.findById(
      KEY_GROUP_COL_RESIZER,
    );
    const resizer = (prevResizer ||
      this.spreadsheet.foregroundGroup.addGroup({
        id: KEY_GROUP_COL_RESIZER,
      })) as IGroup;
    const prevHorizontalResizer = resizer.find((element) => {
      return element.attrs.name === `horizontal-resizer-${this.meta.key}`;
    });
    // 如果已经绘制当前列高调整热区热区，则不再绘制
    if (!prevHorizontalResizer) {
      // 列高调整热区
      resizer.addShape('rect', {
        attrs: {
          name: `horizontal-resizer-${this.meta.key}`,
          x: position.x,
          y: position.y + y + cellHeight - HIT_AREA / 2,
          width: viewportWidth,
          fill: COLOR_DEFAULT_RESIZER,
          height: HIT_AREA,
          cursor: 'row-resize',
          appendInfo: {
            isResizer: true,
            class: 'resize-trigger',
            type: 'row',
            id: this.getColHotSpotKey(),
            affect: 'field',
            offsetX: position.x,
            offsetY: position.y + y,
            width: viewportWidth,
            height: cellHeight,
          } as ResizeInfo,
        },
      });
    }
    if (this.meta.isLeaf) {
      // 列宽调整热区
      // 基准线是根据container坐标来的，因此把热区画在container
      resizer.addShape('rect', {
        attrs: {
          x: position.x - offset + x + cellWidth - HIT_AREA / 2,
          y: position.y + y,
          width: HIT_AREA,
          fill: COLOR_DEFAULT_RESIZER,
          height: cellHeight,
          cursor: 'col-resize',
          appendInfo: {
            isResizer: true,
            class: 'resize-trigger',
            type: 'col',
            affect: 'cell',
            caption: parent.isTotals ? '' : label,
            offsetX: position.x - offset + x,
            offsetY: position.y + y,
            width: cellWidth,
            height: cellHeight,
          } as ResizeInfo,
        },
      });
    }
  }

  private drawRightBorder() {
    if (!this.meta.isLeaf) {
      const { height, viewportHeight } = this.headerConfig;
      const { x, y, width: cellWidth, height: cellHeight } = this.meta;
      this.addShape('line', {
        attrs: {
          x1: x + cellWidth,
          y1: y + cellHeight,
          x2: x + cellWidth,
          y2: y + height + viewportHeight, // 高度有多，通过 clip 裁剪掉
          stroke: this.theme.colHeader.cell.horizontalBorderColor,
          lineWidth: 1,
        },
      });
    }
  }
}
