import _ from 'lodash';
import { getEllipsisText } from '../utils/text';
import { isIPhoneX } from '../utils/is-mobile';
import { IShape } from '@antv/g-canvas';
import { renderText } from '../utils/g-renders';
import {
  EXTRA_FIELD,
  KEY_GROUP_CORNER_RESIZER,
  COLOR_DEFAULT_RESIZER,
  KEY_TREE_ROWS_COLLAPSE_ALL,
} from '../common/constant';
import { HIT_AREA } from '../facet/header/base';
import { CornerHeaderConfig } from '../facet/header/corner';
import { ResizeInfo } from '../facet/header/interface';
import { GuiIcon, Node } from '..';
import { BaseCell } from './base-cell';
import { IGroup } from '@antv/g-canvas';
export class CornerCell extends BaseCell<Node> {
  protected headerConfig: CornerHeaderConfig;

  protected textShapes: IShape[];

  protected handleRestOptions(...options) {
    if (options.length === 0) {
      throw new Error(
        'CornerCell render need headerConfig&hotConfig in CornerHeader!!!',
      );
    }
    this.headerConfig = options[0];
  }

  public update() {}

  protected initCell() {
    this.textShapes = [];
    this.drawCellRect();
    this.drawCellText();
    this.drawHotpot();
  }

  protected drawCellText() {
    const { position } = this.headerConfig;
    const { label, x, y, width: cellWidth, height: cellHeight } = this.meta;

    if (_.isEqual(label, EXTRA_FIELD)) {
      // don't render extra node
      return;
    }

    const cornerTheme = _.get(this.theme, 'corner');
    const textStyle = cornerTheme?.bolderText;
    const iconStyle = cornerTheme?.icon;
    const cellPadding = cornerTheme?.cell?.padding;
    // 起点坐标为左上
    textStyle.textAlign = 'left';
    textStyle.textBaseline = 'middle';

    // 当为树状结构下需要计算文本前收起展开的icon占的位置
    const extraPadding = this.ifNeedIcon()
      ? iconStyle?.size + iconStyle?.margin?.left + iconStyle?.margin?.right
      : 0;

    const totalPadding = extraPadding + cellPadding?.left + cellPadding?.right;

    const text = getEllipsisText(label, cellWidth - totalPadding, textStyle);
    const ellipseIndex = text.indexOf('...');
    let firstLine = text;
    let secondLine = '';

    // 存在文字的省略号 & 展示为tree结构
    if (ellipseIndex !== -1 && this.spreadsheet.isHierarchyTreeType()) {
      // 剪裁到 ... 最有点的后1个像素位置
      const lastIndex = ellipseIndex + (isIPhoneX ? 1 : 0);
      firstLine = label.substr(0, lastIndex);
      secondLine = label.slice(lastIndex);
      // 第二行重新计算...逻辑
      secondLine = getEllipsisText(
        secondLine,
        cellWidth - totalPadding,
        textStyle,
      );
    }

    const extraInfo = {
      appendInfo: {
        // 标记为行头文本，方便做链接跳转直接识别
        isCornerHeaderText: true,
        cellData: this.meta,
      },
    };

    const textX = position.x + x + extraPadding + cellPadding.left;
    const textY =
      position.y +
      y +
      (_.isEmpty(secondLine) ? cellHeight / 2 : cellHeight / 4);
    // first line
    this.textShapes.push(
      renderText(
        [this.textShapes[0]],
        textX,
        textY,
        firstLine,
        textStyle,
        this,
        extraInfo,
      ),
    );

    // second line
    if (!_.isEmpty(secondLine)) {
      this.textShapes.push(
        renderText(
          [this.textShapes[1]],
          textX,
          position.y + y + cellHeight * 0.65,
          secondLine,
          textStyle,
          this,
          extraInfo,
        ),
      );
    }

    // 如果为树状模式，角头第一个单元格前需要绘制收起展开的icon
    if (this.ifNeedIcon()) {
      this.drawIcon();
    }
  }

  /**
   * 绘制折叠展开的icon
   */
  private drawIcon() {
    // 只有交叉表才有icon
    const {
      hierarchyCollapse,
      height,
      spreadsheet,
      position,
    } = this.headerConfig;
    const iconStyle = _.get(this.theme, 'corner.icon');
    const textStyle = _.get(this.theme, 'corner.text');
    const colHeight = spreadsheet.options.style.colCfg.height;
    const icon = new GuiIcon({
      type: hierarchyCollapse ? 'plus' : 'MinusSquare',
      x:
        position.x +
        this.theme.corner.cell?.padding?.left +
        iconStyle?.margin?.left,
      y: height - colHeight / 2 - iconStyle.size / 2,
      width: iconStyle.size,
      height: iconStyle.size,
      fill: textStyle.fill,
    });
    icon.on('click', () => {
      this.headerConfig.spreadsheet.store.set('scrollY', 0);
      this.headerConfig.spreadsheet.emit(
        KEY_TREE_ROWS_COLLAPSE_ALL,
        hierarchyCollapse,
      );
    });
    this.add(icon);
  }

  private drawCellRect() {
    const { position } = this.headerConfig;
    const { x, y, width: cellWidth, height: cellHeight } = this.meta;
    this.addShape('rect', {
      attrs: {
        x: position.x + x,
        y: position.y + y,
        width: cellWidth,
        height: cellHeight,
        opacity: this.theme.corner.cell.backgroundColorOpacity,
      },
    });
  }

  private drawHotpot() {
    const prevResizer = this.spreadsheet.foregroundGroup.findById(
      KEY_GROUP_CORNER_RESIZER,
    );
    const resizer = (prevResizer ||
      this.spreadsheet.foregroundGroup.addGroup({
        id: KEY_GROUP_CORNER_RESIZER,
      })) as IGroup;
    const { position } = this.headerConfig;
    const { x, y, width: cellWidth, height: cellHeight, field } = this.meta;
    resizer.addShape('rect', {
      attrs: {
        x: position.x + x + cellWidth - HIT_AREA / 2,
        y: position.y + y,
        width: HIT_AREA,
        height: cellHeight,
        fill: COLOR_DEFAULT_RESIZER,
        cursor: 'col-resize',
        appendInfo: {
          isResizer: true,
          class: 'resize-trigger',
          type: 'col',
          id: field,
          affect: 'field',
          offsetX: position.x + x,
          offsetY: position.y + y,
          width: cellWidth,
          height: cellHeight,
        } as ResizeInfo,
      },
    });
  }

  private ifNeedIcon() {
    // 批量折叠或者展开的icon，只存在树状结构的第一个cell前
    return (
      this.headerConfig.spreadsheet.isHierarchyTreeType() &&
      this.headerConfig.spreadsheet.isPivotMode() &&
      this.meta?.x === 0
    );
  }
}
