import {
  CellTypes,
  COLOR_DEFAULT_RESIZER,
  KEY_GROUP_COL_RESIZER,
} from '@/common/constant';
import { GuiIcon } from '@/common/icons';
import { TextAlign } from '@/common/interface';
import { HIT_AREA } from '@/facet/header/base';
import { ColHeaderConfig } from '@/facet/header/col';
import { ResizeInfo } from '@/facet/header/interface';
import { renderLine, renderRect, renderText } from '@/utils/g-renders';
import {
  getEllipsisText,
  getTextPosition,
  measureTextWidth,
} from '@/utils/text';
import { IGroup } from '@antv/g-canvas';
import { get, isEqual } from 'lodash';
import { HeaderCell } from './header-cell';

export class ColCell extends HeaderCell {
  protected headerConfig: ColHeaderConfig;

  public get cellType() {
    return CellTypes.COL_CELL;
  }

  protected initCell() {
    // 1、draw rect background
    this.drawRectBackground();
    // interactive background shape
    this.drawInteractiveBgShape();
    // draw text
    this.drawCellText();
    // draw sort icons
    this.drawSortIcon();
    // draw right border
    this.drawRightBorder();
    // draw hot-spot rect
    this.drawHotSpot();
    this.update();
  }

  protected getColHotSpotKey() {
    return this.meta.key;
  }

  protected drawRectBackground() {
    const { x, y, width: cellWidth, height: cellHeight } = this.meta;
    this.backgroundShape = renderRect(this, {
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      fill: this.theme.colCell.cell.backgroundColor,
      stroke: this.theme.colCell.cell.horizontalBorderColor,
    });
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

    const {
      icon: iconCfg,
      text: textCfg,
      bolderText: bolderTextCfg,
    } = this.theme.colCell;

    // 格式化枚举值
    const f = this.headerConfig.formatter(key);
    // const content = f(parent.isTotals ? '' : label);
    const content = f(label);

    const sortIconPadding = this.showSortIcon()
      ? iconCfg.size + iconCfg.margin.right
      : 0;
    const textStyle = isLeaf && !isTotals ? textCfg : bolderTextCfg;
    const padding = get(this, 'theme.colCell.cell.padding');
    const text = getEllipsisText(
      content,
      cellWidth - sortIconPadding - padding?.left - padding?.right,
      textStyle,
    );
    const textWidth = measureTextWidth(text, textStyle);
    let textX: number;
    let textY: number;
    let textAlign: TextAlign;
    if (isLeaf) {
      // 最后一个层级的维值，与 dataCell 对齐方式保持一致
      textAlign = this.theme.dataCell.text.textAlign;
      const textBaseline = this.theme.dataCell.text.textBaseline;
      textStyle.textBaseline = textBaseline;
      const cellBoxCfg = {
        x,
        y,
        width: cellWidth,
        height: cellHeight,
        textAlign,
        textBaseline,
        padding,
      };
      const position = getTextPosition(cellBoxCfg);
      textX = position.x;
      textY = position.y;
    } else {
      textAlign = 'center';
      textStyle.textBaseline = 'middle';
      // scroll keep in center
      const cellLeft = x - offset - padding?.left - padding?.right;
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
          textAlign = 'right';
        } else {
          textX = offset - extraW + restWidth / 2;
        }
      } else if (cellRight > viewportRight) {
        // right out
        const restWidth = cellWidth - (cellRight - viewportRight);
        if (restWidth < textWidth) {
          textX = x + padding?.left;
          textAlign = 'left';
        } else {
          textX = x + restWidth / 2;
        }
      } else {
        // all in center
        textX = x + cellWidth / 2;
      }
      textY = y + cellHeight / 2;
    }
    // const derivedValue = this.spreadsheet.getDerivedValue(value);
    // if (
    //   !isEqual(
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
    //     last(derivedValue.displayDerivedValueField) === value
    //   ) {
    //     // 度量列，找到 value值
    //     text += '...';
    //   }
    // }
    this.textShape = renderText(
      this,
      [this.textShape],
      textX,
      textY,
      text,
      {
        textAlign,
        ...textStyle,
      },
      { cursor: 'pointer' },
    );
  }

  // 交互使用的背景色
  protected drawInteractiveBgShape() {
    const { x, y, height, width } = this.meta;
    this.stateShapes.set(
      'interactiveBgShape',
      renderRect(this, {
        x,
        y,
        width,
        height,
        fill: 'transparent',
        stroke: 'transparent',
      }),
    );
  }

  private showSortIcon() {
    const { sortParam } = this.headerConfig;
    const query = this.meta.query;
    return (
      isEqual(get(sortParam, 'query'), query) &&
      get(sortParam, 'type') !== 'none'
    );
  }

  // 绘制排序icon
  private drawSortIcon() {
    const { icon } = this.theme.colCell;
    if (this.showSortIcon()) {
      const { sortParam } = this.headerConfig;
      const { x, y, width: cellWidth, height: cellHeight } = this.meta;
      const iconShape = new GuiIcon({
        type: get(sortParam, 'type', 'none'),
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

      renderLine(
        this,
        {
          x1: x + cellWidth,
          y1: y + cellHeight,
          x2: x + cellWidth,
          y2: y + height + viewportHeight,
        },
        {
          stroke: this.theme.colCell.cell.horizontalBorderColor,
          lineWidth: 1,
        },
      );
    }
  }
}
