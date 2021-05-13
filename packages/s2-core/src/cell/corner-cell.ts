import { getEllipsisText } from '../utils/text';
import _ from 'lodash';
import { isIphoneX } from '../utils/is-mobile';
import {
  DEFAULT_PADDING,
  EXTRA_FIELD,
  ICON_RADIUS,
  KEY_SERIES_NUMBER_NODE,
  KEY_GROUP_CORNER_RESIZER,
  COLOR_DEFAULT_RESIZER,
} from '../common/constant';
import { HIT_AREA } from '../facet/header/base';
import { CornerHeaderConfig } from '../facet/header/corner';
import { ResizeInfo } from '../facet/header/interface';
import { Node } from '..';
import { BaseCell } from './base-cell';
import { renderLine } from '../utils/g-renders';
import { IGroup } from '@antv/g-canvas';

/**
 * Create By Bruce Too
 * On 2019-11-06
 */
export class CornerCell extends BaseCell<Node> {
  protected headerConfig: CornerHeaderConfig;

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
    this.drawCellRect();
    this.drawCellText();
    this.drawHotspot();
  }

  protected drawCellText() {
    const { position } = this.headerConfig;
    const {
      label,
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      key,
      seriesNumberWidth,
    } = this.meta;
    if (_.isEqual(label, EXTRA_FIELD)) {
      // dont render extra node
      return;
    }
    const extraPadding = this.spreadsheet.isHierarchyTreeType()
      ? ICON_RADIUS * 2 + DEFAULT_PADDING
      : 0;
    const textStyle = _.get(
      this.headerConfig,
      'spreadsheet.theme.header.bolderText',
    );
    const seriesNumberW = seriesNumberWidth || 0;
    const text = getEllipsisText(
      label,
      cellWidth - seriesNumberW - extraPadding,
      textStyle,
    );
    const ellipseIndex = text.indexOf('...');
    let firstLine = text;
    let secondLine = '';

    // 存在文字的省略号 & 展示为tree结构
    if (ellipseIndex !== -1 && this.spreadsheet.isHierarchyTreeType()) {
      // 剪裁到 ... 最有点的后1个像素位置
      const lastIndex = ellipseIndex + (isIphoneX() ? 1 : 0);
      firstLine = label.substr(0, lastIndex);
      secondLine = label.slice(lastIndex);
      // 第二行重新计算...逻辑
      secondLine = getEllipsisText(
        secondLine,
        cellWidth - seriesNumberW - extraPadding,
        textStyle,
      );
    }

    let textX = position.x + x + extraPadding + cellWidth / 2;
    /* corner text align scene
  - center:
  1、is spreadsheet but not tree mode
  2、is listSheet and node is series number
  - left(but contains cell padding):  --- default
  1、is spreadsheet and tree mode
  - left(no cell padding)
  1、is listSheet but node is not series number
   */
    let textAlign = 'center';
    if (
      !this.spreadsheet.isHierarchyTreeType() ||
      key === KEY_SERIES_NUMBER_NODE
    ) {
      textAlign = 'center';
    } else if (this.spreadsheet.isHierarchyTreeType()) {
      textX = position.x + x + extraPadding;
      textAlign = 'start';
    }
    const textY =
      position.y +
      y +
      (_.isEmpty(secondLine) ? cellHeight / 2 : cellHeight / 4);
    // first line
    this.addShape('text', {
      attrs: {
        x: textX,
        y: textY,
        text: firstLine,
        textAlign,
        ...textStyle,
        appendInfo: {
          isCornerHeaderText: true, // 标记为行头文本，方便做链接跳转直接识别
          cellData: this.meta,
        },
      },
    });
    // second line
    if (!_.isEmpty(secondLine)) {
      this.addShape('text', {
        attrs: {
          x: textX,
          y: position.y + y + cellHeight * 0.65,
          text: secondLine,
          ...textStyle,
          appendInfo: {
            isCornerHeaderText: true, // 标记为行头文本，方便做链接跳转直接识别
            cellData: this.meta,
          },
        },
      });
    }
  }

  private drawCellRect() {
    const { position } = this.headerConfig;
    const { x, y, width: cellWidth, height: cellHeight, label } = this.meta;
    this.addShape('rect', {
      attrs: {
        x: position.x + x,
        y: position.y + y,
        width: cellWidth,
        height: cellHeight,
        stroke: 'transparent',
      },
    });

    if (!this.spreadsheet.isValueInCols() && _.isEqual(label, EXTRA_FIELD)) {
      renderLine(
        x,
        y,
        x,
        y + cellHeight,
        this.theme.header.cell.borderColor[0],
        this.theme.header.cell.borderWidth[0],
        this,
      );
    }
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
}
