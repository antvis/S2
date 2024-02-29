import type { LineStyleProps } from '@antv/g';
import { isEmpty } from 'lodash';
import type { SimpleBBox } from '../../engine';
import {
  CellClipBox,
  type CellTheme,
  type IconTheme,
  type TextAlign,
  type TextBaseline,
} from '../../common/interface';
import { CellBorderPosition } from '../../common/interface';
import { getIconTotalWidth, type GroupedIcons } from './header-cell';

/**
 * text 和 icon 之间布局关系：
 *    y轴： text 和 icon 高度上居中对齐
 *    x轴：
 *       1. text 和 icon 同为 left 或者 right 时，icon bbox 只需要简单放置在 left 或者 right 即可
 *       2. 其他的情况，需要根据实际 text width 确定 icon bbox 开始位置
 */

export const getVerticalTextPosition = (
  bbox: SimpleBBox,
  textBaseline: TextBaseline,
) => {
  const { y, height } = bbox;

  switch (textBaseline) {
    case 'top':
      return y;
    case 'middle':
      return y + height / 2;
    default:
      return y + height;
  }
};

export const getVerticalIconPosition = (
  iconSize: number,
  textY: number,
  textFontSize: number,
  textBaseline: TextBaseline,
) => {
  const offset = (textFontSize - iconSize) / 2;

  switch (textBaseline) {
    case 'top':
      return textY + offset;
    case 'middle':
      return textY - iconSize / 2;
    default:
      return textY - offset - iconSize;
  }
};

// 获取 text 及其跟随 icon 的位置坐标
export const getHorizontalTextIconPosition = (options: {
  bbox: SimpleBBox;
  textWidth: number;
  textAlign: TextAlign;
  groupedIcons: GroupedIcons;
  iconStyle: IconTheme;
}) => {
  const { bbox, textWidth, textAlign, groupedIcons, iconStyle } = options;
  const { x, width } = bbox;

  const leftIconWidth = getIconTotalWidth(groupedIcons.left, iconStyle);
  const rightIconWidth = getIconTotalWidth(groupedIcons.right, iconStyle);

  let textX: number;
  let leftIconX: number;
  let rightIconX: number;

  switch (textAlign) {
    case 'left':
      leftIconX = x;
      textX = x + leftIconWidth;
      rightIconX =
        textX + textWidth + (rightIconWidth && iconStyle.margin!.left!);

      break;
    case 'right':
      textX = x + width - rightIconWidth;
      leftIconX = textX - textWidth - leftIconWidth;
      rightIconX =
        x +
        width -
        rightIconWidth +
        (rightIconWidth && iconStyle.margin!.left!);
      break;

    default:
      const totalWidth = leftIconWidth + textWidth + rightIconWidth;

      leftIconX = x + width / 2 - totalWidth / 2;
      textX = leftIconX + leftIconWidth + textWidth / 2;
      rightIconX =
        leftIconX +
        leftIconWidth +
        textWidth +
        (rightIconWidth && iconStyle.margin!.left!);
      break;
  }

  return {
    textX,
    leftIconX,
    rightIconX,
  };
};

/**
 * 类似 background-clip 属性: https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip
 * 分为三种类型：
 * borderBox: 整个 cell 的范围
 * paddingBox: cell 去除 border 的范围
 * contentBox: cell 去除 (border + padding) 的范围
 * -------------------------------
 * |b|           padding         |
 * |o|  |---------------------|  |
 * |r|  |                     |  |
 * |d|  |                     |  |
 * |e|  |---------------------|  |
 * |r|           padding         |
 * -------------------------------
 * -------border-bottom-----------
 * -------------------------------
 */
export const getCellBoxByType = (
  bbox: SimpleBBox,
  borderPositions: CellBorderPosition[],
  cellStyle: CellTheme,
  boxType: CellClipBox,
): SimpleBBox => {
  if (boxType === CellClipBox.BORDER_BOX) {
    return bbox;
  }

  let { x, y, width, height } = bbox;
  const {
    padding,
    horizontalBorderWidth = 0,
    verticalBorderWidth = 0,
  } = cellStyle;

  borderPositions.forEach((position) => {
    const borderWidth = [
      CellBorderPosition.BOTTOM,
      CellBorderPosition.TOP,
    ].includes(position)
      ? horizontalBorderWidth
      : verticalBorderWidth;

    switch (position) {
      case CellBorderPosition.TOP:
        y += borderWidth;
        height -= borderWidth;
        break;
      case CellBorderPosition.BOTTOM:
        height -= borderWidth;
        break;
      case CellBorderPosition.LEFT:
        x += borderWidth;
        width -= borderWidth;
        break;
      default:
        width -= borderWidth;
        break;
    }
  });

  if (boxType === CellClipBox.CONTENT_BOX) {
    x += padding?.left!;
    y += padding?.top!;
    width -= padding?.left! + padding?.right!;
    height -= padding?.top! + padding?.bottom!;
  }

  return {
    x,
    y,
    width,
    height,
  };
};

export const getBorderPositionAndStyle = (
  position: CellBorderPosition,
  bbox: SimpleBBox,
  style: CellTheme,
) => {
  const { x, y, width, height } = bbox;
  const {
    horizontalBorderWidth = 0,
    horizontalBorderColorOpacity,
    horizontalBorderColor,
    verticalBorderWidth = 0,
    verticalBorderColor,
    verticalBorderColorOpacity,
    borderDash,
  } = style;

  // 如果是空数组 G 底层绘制会报错
  const lineDash: LineStyleProps['lineDash'] = isEmpty(borderDash)
    ? ''
    : borderDash;

  const borderStyle: Partial<LineStyleProps> = [
    CellBorderPosition.TOP,
    CellBorderPosition.BOTTOM,
  ].includes(position)
    ? {
        lineWidth: horizontalBorderWidth,
        stroke: horizontalBorderColor,
        strokeOpacity: horizontalBorderColorOpacity,
        lineDash,
      }
    : {
        lineWidth: verticalBorderWidth,
        stroke: verticalBorderColor,
        strokeOpacity: verticalBorderColorOpacity,
        lineDash,
      };

  let x1 = 0;
  let y1 = 0;
  let x2 = 0;
  let y2 = 0;

  // horizontal
  if (
    position === CellBorderPosition.TOP ||
    position === CellBorderPosition.BOTTOM
  ) {
    let yPosition = y;

    if (position === CellBorderPosition.TOP) {
      // 完全绘制在 Cell 内，否则会导致 Border 粗细不一： https://github.com/antvis/S2/issues/426
      yPosition = y + horizontalBorderWidth / 2;
    } else {
      yPosition = y + height - horizontalBorderWidth / 2;
    }

    y1 = yPosition;
    y2 = yPosition;
    x1 = x;
    x2 = x + width;
  }

  // vertical
  if (
    position === CellBorderPosition.LEFT ||
    position === CellBorderPosition.RIGHT
  ) {
    let xPosition = x;

    if (position === CellBorderPosition.LEFT) {
      xPosition = x + verticalBorderWidth / 2;
    } else {
      xPosition = x + width - verticalBorderWidth / 2;
    }

    x1 = xPosition;
    x2 = xPosition;
    y1 = y;
    y2 = y + height;
  }

  return {
    position: {
      x1,
      x2,
      y1,
      y2,
    },
    style: borderStyle,
  };
};
