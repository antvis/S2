import _ from 'lodash';
import { getEllipsisText, getTextPosition } from '../utils/text';
import { isIphoneX } from '../utils/is-mobile';
import { IShape } from '@antv/g-canvas';
import { renderLine, renderRect, renderText } from '../utils/g-renders';
import {
  EXTRA_FIELD,
  KEY_GROUP_CORNER_RESIZER,
  COLOR_DEFAULT_RESIZER,
  KEY_TREE_ROWS_COLLAPSE_ALL,
} from '../common/constant';
import { HIT_AREA } from '../facet/header/base';
import { CornerHeaderConfig } from '../facet/header/corner';
import { ResizeInfo } from '../facet/header/interface';
import { CellBoxCfg, GuiIcon, Node, Position } from '..';
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
    this.drawHotspot();
  }

  protected drawCellText() {
    const { position } = this.headerConfig;
    const { label, x, y, width: cellWidth, height: cellHeight } = this.meta;

    if (_.isEqual(label, EXTRA_FIELD)) {
      // don't render extra node
      return;
    }

    const iconStyle = _.get(this.theme, 'corner.icon');
    const cellStyle = _.get(this.theme, 'corner.cell');
    const textStyle = _.get(this.theme, 'corner.text');

    // 当表处于树状结构下，文本对齐方式为：水平居左，垂直居中，此模式下不支持更改对齐方式
    if (
      this.headerConfig.spreadsheet.isHierarchyTreeType() &&
      this.headerConfig.spreadsheet.isPivotMode()
    ) {
      textStyle.textAlign = 'left';
      textStyle.textBaseline = 'middle';
    }

    // 当为树状结构下需要计算文本前收起展开的icon占的位置
    const extraPadding = this.ifNeedIcon()
      ? iconStyle?.size + iconStyle?.margin?.left + iconStyle?.margin?.right
      : 0;

    const text = getEllipsisText(label, cellWidth - extraPadding, textStyle);
    const ellipseIndex = text.indexOf('...');
    let firstLine = text;
    let secondLine = '';

    // 存在文字的省略号 & 展示为tree结构
    if (ellipseIndex !== -1 && this.spreadsheet.isHierarchyTreeType()) {
      // 剪裁到 ... 最有点的后1个像素位置
      const lastIndex = ellipseIndex + (isIphoneX ? 1 : 0);
      firstLine = label.substr(0, lastIndex);
      secondLine = label.slice(lastIndex);
      // 第二行重新计算...逻辑
      secondLine = getEllipsisText(
        secondLine,
        cellWidth - extraPadding,
        textStyle,
      );
    }

    const cellBoxCfg = {
      x: position.x + x + extraPadding,
      y: position.y + y,
      width: cellWidth - extraPadding,
      height: cellHeight,
      textAlign: textStyle?.textAlign,
      textBaseline: textStyle?.textBaseline,
      padding: cellStyle?.padding,
    } as CellBoxCfg;

    const textPosition = getTextPosition(cellBoxCfg);

    const extraInfo = {
      appendInfo: {
        // 标记为行头文本，方便做链接跳转直接识别
        isCornerHeaderText: true,
        cellData: this.meta,
      },
    };
    // first line
    this.textShapes.push(
      renderText(
        this.textShapes,
        textPosition.x,
        textPosition.y,
        firstLine,
        textStyle,
        this,
        extraInfo,
      ),
    );

    // TODO: 单元格统一开启换行，推拽列宽动态换行
    // second line
    if (!_.isEmpty(secondLine)) {
      // first line
      this.textShapes.push(
        renderText(
          this.textShapes,
          textPosition.x,
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
    const { hierarchyCollapse, height, spreadsheet, position } =
      this.headerConfig;
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

  private drawHotspot() {
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
      this.meta.x === 0
    );
  }
}
